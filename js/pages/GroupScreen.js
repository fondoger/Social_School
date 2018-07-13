'use strict';
import React from 'react';
import {
  StyleSheet, 
  Text,
  View,
  Button,
  FlatList,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../utils/Theme';
import API from '../utils/API_v1';
import Swiper from 'react-native-swiper';
import { TabNavigator, TabBarTop } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Storage from '../utils/Storage';
import Loading from '../components/Loading';


class GroupItem extends React.Component {
  // 新建一个类的目的是为了实现按住图片阴影的效果
  constructor(props) {
    super(props);
    this.state = {
      onPressing: false,
    }
  }
  
  render() {
    const group = this.props.group;
    const testStyle = {
      color: '#fff',
      fontSize: 11,
      backgroundColor: 'rgba(0,0,0,0.3)',
      paddingLeft: 10,
      marginLeft: -8,
      paddingRight: 5,
      borderRadius: 8,
    };
    return (
      <TouchableWithoutFeedback
            onPressIn={()=>this.setState({onPressing:true})}
            onPressOut={()=>this.setState({onPressing:false})}
            onPress={this.props.onPress} >
        <View style={{flex:1, alignItems:'center', backgroundColor:'#f2f4f5'}}>
          <View style={{width:80, height:80, marginBottom:4}}>
            <Image style={{width:80, height:80}}
                   source={{uri: group?(group.avatar+'!thumbnail'):null}}/>
            {
              this.state.onPressing ?
                <View style={{position:'absolute', top:0, left:0,
                      backgroundColor:'rgba(0,0,0,0.25)', width:80, height:80}} />:
                <View style={{position:'absolute', top:0, left:0,
                      backgroundColor:'rgba(0,0,0,0.05)', width:80, height:80}} />
            }
            <View style={{position:'absolute', top:0, left:0,
                  backgroundColor:'rgba(0,0,0,0)', width:80, height:80, paddingTop:2}} >
              <View style={{flexDirection:'row', marginTop:2}}><Text style={testStyle}>新帖: {group.daily_statuses>99?'99+':group.daily_statuses}</Text></View>
              {group.public?null:<View style={{flexDirection:'row', marginTop:2}}><Text style={testStyle}>有新活动</Text></View>}
            </View>
          </View>
          <Text style={{color:'#444', fontSize:12.5}}>{group?group.groupname:'加载中'}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

class FirstPage extends React.Component {
  static navigationOptions = {
    title: '团体',
  }
  constructor(props) {
    super(props);
    this.state = {
      hotActivities: Storage.hotActivities,
      hotGroups: Storage.hotGroups,
      hotPublicGroups: Storage.hotPublicGroups,
      show: false,
    };
  }

  componentDidMount() {
    API.Activity.get({type:'hot'}, (responseJson)=>{
      Storage.setItem('hotActivities', responseJson);
      this.setState({hotActivities: responseJson});
    }, (error)=>{});
    setTimeout(()=>{
      this.setState({show:true})
    }, 1);
    API.Group.get({type:'hot'}, (responseJson)=>{
      Storage.setItem('hotGroups', responseJson);
      this.setState({hotGroups: responseJson});
    }, (error)=>{});
    API.Group.get({type:'public'}, (responseJson)=>{
      Storage.setItem('hotPublicGroups', responseJson);
      this.setState({hotPublicGroups: responseJson});
    }, (error)=>{});
  }

  renderSwiperItem(activity) {
    return (
      activity?
      <TouchableWithoutFeedback onPress={()=>MyToast.show('点击了活动: '+activity.title)}>
        <Image style={{flex:1, aspectRatio:2.5}}
               source={{uri: activity.picture}} />
      </TouchableWithoutFeedback>:
      <Text>加载中</Text>
    )
  }  

  renderGroupItem(group) {
    return (
      <GroupItem group={group} onPress={()=>this.props.navigation.navigate('Group_GroupPage', {group:group})}/>
    )
  }

  renderActivityItem(activity) {
    return (
      // 需要展示的东西
      // 1. 活动话题
      // 2. 活动简介 (可能有)
      // 3. 活动话题
      // 4. 发起团体
      // 5. 话题参与度
      // 6. 活动时间, 必须
      // 7. 活动地点 (可能有)
      <TouchableHighlight key={activity.id} style={{ marginBottom:8,}}
          onPress={()=>MyToast.show('点击了'+activity.title)}>
        <View style={{backgroundColor:'#fff', padding:12}}>
          <Text style={{color:'#222', fontSize:18}}>{activity.title}</Text>
          <Text style={{marginTop:8, marginBottom:12, fontSize:15}}>{activity.description}</Text>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:'#507daf'}}>#{activity.keyword}#</Text>
            <Text style={{marginLeft:16, flex:1}}>话题参与度:<Text style={{color:Theme.themeColor}}>{780}</Text></Text>
            <Text >{activity.group.groupname}</Text>
            <View style={{height:24, width:24}}>
              <Image
                style={{width:24, height:24, borderRadius:12}} 
                source={{uri: activity.group.avatar+'!thumbnail'}} />
            </View> 
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    const { hotActivities, hotGroups, hotPublicGroups } = this.state;
    if (!hotActivities || !hotActivities || !hotPublicGroups) {
      return <Loading fullScreen={true} />
    }
    return (
      <View style={{flex:1}}>

        <ScrollView style={{flex:1, backgroundColor: '#f2f4f5'}} >
          <View style={{flex:1, aspectRatio:2.5}}>
            <Swiper autoplay paginationStyle={{ bottom:7 }}
                    autoplayTimeout={6}
                    dotStyle={{width:6, height:6, borderRadius:3,
                               backgroundColor:'rgba(230,230,230,0.85)'}}
                    activeDotStyle={{width:6, height:6, borderRadius:3, backgroundColor:Theme.themeColor}}>
              {this.renderSwiperItem(hotActivities[0])}
              {this.renderSwiperItem(hotActivities[1])}
              {this.renderSwiperItem(hotActivities[2])}
            </Swiper>
          </View>
          <View>
            <Text style={{borderLeftWidth:2, borderColor:Theme.themeColor,
                          fontSize:16, color:'#222',
                          marginTop:20, marginBottom:12, paddingLeft:6}}>热门团体</Text>
            <View style={{flexDirection:'row', margin:-1.5}}>
              {this.renderGroupItem(hotGroups[0])}
              {this.renderGroupItem(hotGroups[1])}
              {this.renderGroupItem(hotGroups[2])}
              {this.renderGroupItem(hotGroups[3])}
            </View>
          </View>
          <View>
            <Text style={{borderLeftWidth:2, borderColor:Theme.themeColor,
                          fontSize:16, color:'#222',
                          marginTop:20, marginBottom:12, paddingLeft:6}}>公开团体</Text>
            <View style={{flexDirection:'row'}}>
              {this.renderGroupItem(hotPublicGroups[0])}
              {this.renderGroupItem(hotPublicGroups[1])}
              {this.renderGroupItem(hotPublicGroups[2])}
              {this.renderGroupItem(hotPublicGroups[3])}
            </View>
          </View>
          <View>
            <Text style={{borderLeftWidth:2, borderColor:Theme.themeColor,
                          fontSize:16, color:'#222',
                          marginTop:20, marginBottom:12, paddingLeft:6}}>进行中的活动</Text>
            <View style={{minHeight: 60}}>
              {
                this.state.hotActivities.length != 0 ?
                this.state.hotActivities.map((activity)=>{
                  return this.renderActivityItem(activity);
                }):
                <View style={{flex:1, aspectRatio:2.5}}>
                  <Text>暂时没有活动</Text>
                </View>
              }
            </View>
          </View>
          <View style={{height:60, justifyContent:'center', alignItems:'center'}}>
            <Text>没有更多内容</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

}

class SecondPage extends React.Component {
  static navigationOptions = {
    title: '活动',
  }

  render() {
    return     (
      <Text>你们好</Text>

    )

  }
}

class ThirdPage extends React.Component {
  static navigationOptions = {
    title: '我的',
  }

  render() {
    return <Text>Second Page</Text>
  }
}

const GroupScreenTab = createMaterialTopTabNavigator({
  First: FirstPage,
  Second: SecondPage,
  Third: ThirdPage,
},{
  title: '团体',
  backBehavior: 'none',
  animationEnabled: false,
  tabBarOptions: {
    useNativeDriver: true,
    activeTintColor: Theme.themeColor,
    inactiveTintColor: '#333333',
    allowFontScaling: false,
    style: {
      backgroundColor: '#feffff',
      height: 36,
      elevation: 0,
      shadowOpacity: 0,
    },
    indicatorStyle: {
      backgroundColor: Theme.themeColor,
      width: 60,
      marginLeft: 30,
      height: 2.5,
    },
    tabStyle: {
    },
    labelStyle: {
      marginTop: 1.5,
      fontSize: 14,
    }
  },
});

GroupScreenTab.navigationOptions = {
  title: '团体'
};

export default GroupScreenTab;

// const GroupScreen = TabNavigator({
//   First: {
//     screen: FirstPage,
//     navigationOptions: {
//       tabBarLabel: '微博',
//     },
//   },
//   Thrid: {
//     screen: ThirdPage, 
//     navigationOptions: {
//       tabBarLabel: '我的',
//     },
//   },
//   Second: {
//     screen: SecondPage, 
//     navigationOptions: {
//       tabBarLabel: '活动',
//     },
//   },
// }, {


// export default GroupScreen;
