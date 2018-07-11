'use strict';
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  Animated,
  FlatList,
  Platform,
  StatusBar,
  ScrollView,
  StyleSheet,   
  SectionList,
  TouchableOpacity, 
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';
import { TabNavigator, TabBarTop } from 'react-navigation';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import { getGMTTimeDiff } from '../../utils/Util';
import Swiper from 'react-native-swiper';
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers, } from 'react-native-popup-menu';
import { MyToast, GroupPostItem, StatusesItem, NormalButton, SelectButton, ContextMenu } from '../../components';

const _window = require('Dimensions').get('window');
const ScreenWidth = _window.width;
const ScreenHeight = _window.height;
const StatusBarHeight = (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight);
const headerHeight = Theme.headerHeight + StatusBarHeight;

export default class GroupPage extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const navParams = navigation.state.params;
    const menuWrapper = {
      alignItems: 'center',
      flexDirection: 'row',
      paddingRight: 8,
      paddingTop: 6,
      paddingBottom: 4,
    };
    const menuText = {
      color: '#222',
      fontSize: 15,
    };
    const menuIcon = {
      fontFamily: 'iconfont',
      fontSize: 20,
      color: '#222',
      paddingLeft: 8,
      paddingRight: 8,
    };
    const onPress = (e) => {
      //
    }
    return {
      headerTransparent: true,
      headerStyle: {
        backgroundColor:'rgba(0,0,0,0)', 
        paddingTop: StatusBarHeight,
        height: headerHeight,
      },
      headerRight: (
          <TouchableWithoutFeedback onPress={navigation.state.params.onMoreButtonPress}>
            <View style={{padding: 12}}>
              <Text style={{fontFamily: 'iconfont', fontSize: 22, color: '#fff'}} >&#xe633;</Text>
            </View>
          </TouchableWithoutFeedback>
      )
      // headerRight: (
      //   <Menu rendererProps={{ placement: 'bottom' }} onSelect={value => alert(`Selected number: ${value}`)}>
      //     <MenuTrigger customStyles={{triggerWrapper:{ padding:12}}} triggerTouchable={{background: TouchableNativeFeedback.Ripple('#fff', true)}}>
      //       <Text style={{fontFamily: 'iconfont', fontSize: 22, color: '#fff'}} >&#xe633;</Text>
      //     </MenuTrigger>
      //     <MenuOptions customStyles={{optionsContainer:{borderRadius:1, marginTop:Theme.headerHeight, marginRight:12}}}>
      //       <MenuOption onSelect={()=>navigation.navigate('Status_NewStatusPage',
      //               {type:API.Status.GROUPPOST, group:navParams.group})}>
      //         <View style={menuWrapper}>
      //           <Text style={menuIcon}>&#xe66c;</Text>
      //           <Text style={menuText}>发表贴子</Text>
      //         </View>
      //       </MenuOption>
      //       <MenuOption onSelect={()=>navigation.navigate('Status_NewStatusPage',
      //               {type:API.Status.GROUPSTATUS, group:navParams.group})}>
      //         <View style={menuWrapper}>
      //           <Text style={menuIcon}>&#xe62d;</Text>
      //           <Text style={menuText}>发布微博</Text>
      //         </View>
      //       </MenuOption>
      //       <MenuOption onSelect={()=>navigation.navigate('Status_NewStatusPage',
      //               {type:API.Status.GROUPPOST, group:navParams.group})}>
      //         <View style={menuWrapper}>
      //           <Text style={menuIcon}>&#xe6c5;</Text>
      //           <Text style={menuText}>发起活动</Text>
      //         </View>
      //       </MenuOption>            
      //     </MenuOptions>
      //   </Menu>
      // )
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      group: this.props.navigation.state.params.group,
      activities: [],
      group_statuses: [],
      posts: [],
      headerOpacity: new Animated.Value(0),
      headerOverlayOpacity: new Animated.Value(0),
      headerUnderlayTextOpacity: new Animated.Value(0),
    }
  }

  onMoreButtonPress(e) {
    const options = [
      {name: '收藏微博', callback: () => MyToast.show('收藏')},
      {name: '复制正文', callback: () => MyToast.show('复制正文')},
    ];
    ContextMenu.showIconMenu(options, {pageX: ScreenWidth-8, pageY: headerHeight});
  }

  componentDidMount() {
    this.props.navigation.setParams({onMoreButtonPress: this.onMoreButtonPress.bind(this)});
    API.Activity.get({group_id:this.state.group.id}, (responseJson)=>{
      console.log(responseJson);
      this.setState({activities: responseJson});
    }, (error)=>{});
    API.Status.get({type:'group_status', group_id:this.state.group.id}, (responseJson)=>{
      this.setState({group_statuses: responseJson});
    }, (error)=>{});
    API.Status.get({type:'post', group_id:this.state.group.id}, (responseJson)=>{
      this.setState({posts:responseJson});
    }, (error)=>{});

  }

  renderHeader() {
    const group = this.state.group;
    const groupInfoNum = {
      fontSize: 13,
      color: '#222',
    };
    const groupInfoHint = {
      fontSize: 13,
      color: '#888',
    };
    const groupDesciption = {
      fontSize: 13,
      color: '#888',
    }
    return (
      <View>
        <View style={{backgroundColor:'#fff'}}>
            <View style={{flex:1, aspectRatio:2.5, flexDirection:'row'}}>
              <Image style={{flex:1}} 
                     source={{uri: 'http://asserts.fondoger.cn/topic_images/4.jpg'}}/>
            </View>
            <View style={{width: ScreenWidth, height: ScreenWidth/2.5, backgroundColor: 'rgba(0,0,0,0.2)',
                          position: 'absolute', top: 0, left: 0}} />
            <View style={{width: ScreenWidth, background: '#fff', paddingLeft: 16}}>
              <View style={{height: 44, flexDirection:'row', padding:8, paddingRight:12}} >
                <View style={{flex:1}} />
                <SelectButton 
                  style={{width:72, height:30}} 
                  text='关注' selectText='已关注' 
                  onPress={(callback)=>setTimeout(()=>{callback(true)}, 2000)} 
                />
              </View>
              <Text style={{color:'#333', fontSize: 17,}}>{group.groupname}</Text>
              <View style={{flexDirection:'row', paddingTop: 8, paddingBottom: 8}}>
                <Text style={groupInfoHint}><Text style={groupInfoNum}>108</Text> 关注</Text>
                <View style={{width: 10}} />
                <Text style={groupInfoHint}><Text style={groupInfoNum}>12</Text> 成员</Text>
                <View style={{width: 10}} />
                <Text style={groupInfoHint}><Text style={groupInfoNum}>53</Text> 帖子</Text>
              </View>
              <View style={{marginTop:4, marginBottom:16}}>
                <Text style={groupDesciption}>这是一个公开团体, 任何人可以发布帖子.</Text>
              </View>
            </View>
            <View style={{position:'absolute', top: ScreenWidth/2.5-42, left: 16,
                  borderRadius: 2.5, borderWidth: 2, borderColor: '#fff', width: 80, height: 80}} >
              <Image 
                style={{width:76, height:76,}}
                source={{uri:group.avatar + '!thumbnail'}}
              />
            </View>
            <Animated.View style={{position:'absolute', top:0, left:0, right:0, height:ScreenWidth/2.5, 
                backgroundColor:Theme.themeColor, opacity:this.state.headerOverlayOpacity}} />
            <Animated.View style={{position:'absolute', top:0, left:0, right:0, height:ScreenWidth/2.5,
                opacity: this.state.headerUnderlayTextOpacity}} >
              <Text style={{position:'absolute', left:64, bottom:12, color:'#fff', fontSize:18}}>{group.groupname}</Text>
            </Animated.View>
        </View>
      </View>
    )
  }

  renderActivityItem(activity) {
    return (
      // 在GroupScreen重用
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

  renderSectionHeader({section}) {
    return (
        <Text style={{padding: 6, paddingLeft: 12,
          fontSize:13, color:'#666', }}>{section.title}</Text>
    )    
  }

  renderFooter() {
    const posts = this.state.posts;
    return (
      <View style={{height:50, marginBottom:100, justifyContent:'center', alignItems:'center'}}>
        <Text style={{fontSize:16}}>
          {posts.length!=0?'没有更多内容':'暂时没有帖子哦, 发表一个吧'}
        </Text>
      </View>
    )    
  }

  renderSectionItem({item, section}) {
    return (
      section.key==="activity" ?
      this.renderActivityItem(item):
      section.key==="group_statuses" ? 
      <StatusesItem {...this.props} status={item} />:
      section.key==="posts" ?
      <GroupPostItem
        {...this.props}
        status={item}
      />:
      null
    )
  }

  handleScroll(e) {
    let offsetY = e.nativeEvent.contentOffset.y;
    let pointHeight = ScreenWidth / 2.5 - headerHeight;
    const T = 30;
    const a = pointHeight - offsetY;
    const underlayOpacity = (a < T && a > 0) ? (T - a) / T : 0;
    this.state.headerUnderlayTextOpacity.setValue(underlayOpacity);
    const overlayOpacity = Math.min(offsetY / pointHeight, 1);
    this.state.headerOverlayOpacity.setValue(overlayOpacity);
    this.state.headerOpacity.setValue(offsetY >= pointHeight? 1: 0);
  }

  render() {
    const group = this.state.group;
    const activities = this.state.activities;
    const group_statuses = this.state.group_statuses;
    const posts = this.state.posts;
    const sections = [];
    if (activities.length != 0)
      sections.push({key:"activity", data:activities, title:"进行中的活动",})
    if (group_statuses.length != 0)
      sections.push({key:"group_statuses", data:group_statuses, title:"官方微博",})
    sections.push({key:"posts", data:posts, title:"最新帖子",})

    return (
      <View style={{flex:1, backgroundColor:"#eee"}}>
        <SectionList
          sections={sections}
          ListHeaderComponent={this.renderHeader.bind(this)}
          ListFooterComponent={this.renderFooter.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          renderItem={this.renderSectionItem.bind(this)}
          stickySectionHeadersEnabled={false}
          ItemSeparatorComponent={()=><View style={{height:8}}></View>}
          onScroll={this.handleScroll.bind(this)}
        />
        <Animated.View style={{position:'absolute', top:0, left:0, right:0,
              height:headerHeight, backgroundColor:Theme.themeColor,
              opacity: this.state.headerOpacity, justifyContent:'center',
              paddingLeft:64, paddingTop: StatusBarHeight}} >
              <Text style={{color:'#fff', fontSize:18}}>{this.state.group.groupname}</Text>
        </Animated.View>
      </View>
    )

  }
}


/*
My Custom Tabs


class FirstTab extends React.Component {
  render() {
    return (
        <FlatList
          {...this.props}
          showsHorizontalScrollIndicator={false}
          key={"0"}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9,9,9,9,9,9,9,9,9,9,9,9,9,9]}
          keyExtractor={((item, index) => index.toString())}
          renderItem={({item, index})=><Text style={{height:200}}>我中意你</Text>}
        />
    )
  }
}
class SecondTab extends React.Component {
  render() {
    return (
      <FlatList
        {...this.props}
        showsHorizontalScrollIndicator={false}
        key={"0"}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        keyExtractor={((item, index) => index.toString())}
        renderItem={({item, index})=><Text style={{height:200}}>我喜欢你</Text>}
      />
    )
  }
}
class ThirdTab extends React.Component {
  render() {
    return (
      <FlatList
        {...this.props}
        showsHorizontalScrollIndicator={false}
        key={"0"}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        keyExtractor={((item, index) => index.toString())}
        renderItem={({item, index})=><Text style={{height:100}}>你好哇</Text>}
      />
    )
  }
}

const Tabs = TabNavigator({
  First: {
    screen: FirstTab,
    navigationOptions: {
      tabBarLabel: '帖子',
    },
  },
  Second: {
    screen: SecondTab, 
    navigationOptions: {
      tabBarLabel: '微博',
    },
  },
  Thrid: {
    screen: ThirdTab, 
    navigationOptions: {
      tabBarLabel: '活动',
    },
  },
}, {
  tabBarComponent: TabBarTop,
  backBehavior: 'none',
  animationEnabled: false,
  tabBarPosition: 'top',
  tabBarOptions: {
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
  }
})


renderTabs() {
  return (
    <View style={{backgroundColor:'#fff',}}>
      <View style={{flexDirection:'row',}} >
        <TouchableWithoutFeedback onPress={()=>{this.setState({tabIndex:0}); this.refs.scrollView.scrollTo({y:ScreenWidth/2, animated:false})}}>
        <View style={{flex:1, alignItems:'center'}}>
          <Text style={this.state.tabIndex==0?styles.tabActive:styles.tabInactive}>帖子</Text>
        </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>{this.setState({tabIndex:1}); this.refs.scrollView.scrollTo({y:ScreenWidth/2, animated:false})}}>
        <View style={{flex:1, alignItems:'center'}}>
          <Text style={this.state.tabIndex==1?styles.tabActive:styles.tabInactive}>微博</Text>
        </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>{this.setState({tabIndex:2}); this.refs.scrollView.scrollTo({y:ScreenWidth/2, animated:false})}}>
        <View style={{flex:1, alignItems:'center'}}>
          <Text style={this.state.tabIndex==2?styles.tabActive:styles.tabInactive}>活动</Text>
        </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

  My Custom Tabs
  this.state.tabIndex == 0 ?
  <FirstTab />:
  this.state.tabIndex == 1 ?
  <SecondTab />:
  <ThirdTab />

const styles = StyleSheet.create({
  tabInactive: {
    fontSize: 15,
    color: '#888',
    height: 40,
    borderColor: '#fff',
    paddingTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    borderBottomWidth: 2.5,
  },
  tabActive: {
    fontSize: 15,
    color: Theme.themeColor,
    height: 40,
    borderColor: Theme.themeColor,
    paddingTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    borderBottomWidth: 2.5,
  }
});

*/
