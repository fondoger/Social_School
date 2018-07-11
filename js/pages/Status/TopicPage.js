'use strict';
import React from 'react';
import { 
  Text,
  View,
  Image,
  FlatList,
  Animated,
  Platform,
  StatusBar,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import StatusesItem from '../../components/StatusesItem';
import GroupPostItem from '../../components/GroupPostItem';
import Storage from '../../utils/Storage';
import { StackNavigator } from 'react-navigation';
import Loading from '../../components/Loading';

const _window = require('Dimensions').get('window');
const ScreenWidth = _window.width;
const ScreenHeight = _window.height;
const StatusBarHeight = (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight);
const headerHeight = Theme.headerHeight + StatusBarHeight;

export default class ProfilePage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerStyle: {
      backgroundColor:'rgba(0,0,0,0)', 
      paddingTop: StatusBarHeight,
      height: headerHeight,
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      topic: {
        name: props.navigation.state.params.topic,
        views: 0,
        statuses: 0,
        followers: 0,
        themeColor: '#c6c5ac',
      },
      statuses: [],
      topicTransAnim: new Animated.Value(0),
      headerOpacity: new Animated.Value(0),
      topicDynamicOpacity: new Animated.Value(1),
      topicStaticOpacity: new Animated.Value(0),
      overlayOpacity: new Animated.Value(0),
      load_more_ing: false,
      load_more_err: false,
      has_next: true,
    }
  }

  componentDidMount() {
    this.refreshTopicInfo();
  }

  refreshTopicInfo = () => {
    const name = this.state.topic.name;
    API.Topic.get({topic: name}, (responseJson) => {
      this.setState({topic: responseJson});
    }, (error) => {});
  }

  handleRefresh = () => {
    const name = this.state.topic.name;
    this.refreshTopicInfo();
    API.Status.get({type:'topic', topic:name}, (responseJson)=>{
      this.setState({statuses: responseJson});
    }, (err)=>{});
  }

  handleLoadMore = () => {
    if (this.state.load_more_ing)
      return
    const { topic, statuses } = this.state;
    this.setState({load_more_ing: true, load_more_err: false});
    API.Status.get({type:'topic', topic:topic.name, offset:statuses.length}, (responseJson) => {
      const _statuses = [...statuses, ...responseJson];
      this.setState({
        statuses: _statuses, 
        has_next: responseJson.length == 10,
        load_more_ing: false,
      });
    }, (error) => {
      this.setState({load_more_ing: false, load_more_err: true})
    });
  }

  handleScroll = (e) => {
    let offsetY = e.nativeEvent.contentOffset.y;
    let pointHeight = ScreenWidth / 1.8 - headerHeight;
    let beginHeight = 40;
    let T = 44;
    let a = offsetY - beginHeight;
    const topicTransAnim = Math.min(a > 0  ? a / T * 40: 0, 40);
    this.state.topicTransAnim.setValue(topicTransAnim);
    const overlayOpacity = Math.min(a > 0 ? a / (pointHeight - beginHeight): 0, 1);
    this.state.overlayOpacity.setValue(overlayOpacity);
    this.state.topicDynamicOpacity.setValue(a >= T ? 0: 1);
    this.state.topicStaticOpacity.setValue(a >= T ? 1: 0);
    this.state.headerOpacity.setValue(offsetY >= pointHeight ? 1: 0);
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:'#eee'}}>
        <FlatList
          data={this.state.statuses}
          keyExtractor={((item, index) => `${item.id}+${item.likes}+${item.replies}`)}
          renderItem={this.renderByType.bind(this)}
          onEndReached={this.handleLoadMore}
          ListHeaderComponent={this.renderHeader.bind(this)}
          ListFooterComponent={this.renderFooter.bind(this)} 
          ItemSeparatorComponent={()=><View style={{height:8}}></View>}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.1}
          onScroll={this.handleScroll}
          />
          <Animated.View style={{position:'absolute', top:0, left:0, right:0,
                height:headerHeight, backgroundColor:this.state.topic.themeColor,
                opacity: this.state.headerOpacity}} />
          <Animated.View style={{position:'absolute', top:0, left:0, right:0,
                height:headerHeight,
                opacity: this.state.topicStaticOpacity, justifyContent:'center',
                paddingLeft:64, paddingTop: StatusBarHeight}} >
                <Text style={{color:'#fff', fontSize:18}}>#{this.state.topic.name}#</Text>
          </Animated.View>
      </View>
    )
  }

  renderHeader = () => {
    const { topic } = this.state;
    return (
      <View>
        <View>
          <View style={{flex:1, aspectRatio:1.8, flexDirection:'row'}}>
            <Image style={{flex:1}} 
                   source={{uri: 'http://asserts.fondoger.cn/topic_images/2.jpg'}}/>
            <View style={{position:'absolute', top:0, left:0, right:0, height:ScreenWidth/1.8, backgroundColor:'rgba(0,0,0,0.2)'}}></View>
          </View>
          <View style={{position:'absolute', left:24, bottom:20, flexDirection:'row', justifyContent:'space-between', marginTop:8}}>
            <Text style={{fontSize:12, color:'#fff'}}>阅读{topic.views}   讨论{topic.statuses}   关注{topic.followers}</Text>
          </View>
          <Animated.View style={{position:'absolute', left:0, top:0, right:0, height: ScreenWidth/1.8,
            backgroundColor:topic.themeColor, opacity:this.state.overlayOpacity}} />
          <Animated.View style={{position:'absolute', left:24, top:120, opacity:this.state.topicDynamicOpacity, transform:[{translateX: this.state.topicTransAnim}]}}>
            <Text style={{fontSize:18, color:'#fff', marginBottom:8}}>#{topic.name}#</Text>
          </Animated.View>       
        </View>
        <View><Text style={{padding:6, paddingLeft:12, fontSize:13, color:'#666'}}>最新微博</Text></View>
      </View>
    )
  };

  deleteItem = (index) => {
    const statuses = this.state.statuses;
    statuses.splice(index, 1);
    this.setState({statuses: statuses});
  }

  renderByType = (_item) => {
    const { index, item } = _item;
    console.log(item);
    return <StatusesItem 
              {...this.props} 
              status={item}
              inDetailedPage={false}
              handleDeleteItem={()=>{this.deleteItem(index)}}
            />
  }

  renderFooter() {
    const error = this.state.load_more_err || !this.state.has_next;
    const error_msg = this.state.load_more_err ? '加载失败, 点击重试': '没有更多内容';
    return (
      <Loading style={{height:60}} error={error} error_msg={error_msg} onRetry={this.handleLoadMore}/>
    )
  }

}
