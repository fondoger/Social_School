'use strict';
import React from 'react';
import { 
  Text,
  View,
  Image,
  Easing, 
  Animated, 
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import {
  MyToast,
  Loading,
  UserAvatar,
  StatusesItem,
  GroupPostItem2,
} from '../../components';

const _window = require('Dimensions').get('window');
const ScreenWidth = _window.width;
const ScreenHeight = _window.height;
const StatusBarHeight = (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight);
const headerHeight = Theme.headerHeight + StatusBarHeight;

export default class UserPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerStyle: {
      backgroundColor:'rgba(0,0,0,0)', 
      paddingTop: StatusBarHeight,
      height: Theme.headerHeight + StatusBarHeight,
    }
  });

  constructor(props) {
    super(props);
    this.state = {
      user: props.navigation.state.params.user,
      statuses: [],
      load_more_err: false,
      load_more_ing: false,
      has_next: true,
      user_following: false,
      user_unfollowing: false,
      headerOpacity: new Animated.Value(0),
      headerOverlayOpacity: new Animated.Value(0),
      headerUnderlayTextOpacity: new Animated.Value(0),
    }
  }

  componentDidMount() {
    this.handleLoadMore();
    API.User.get({id:this.state.user.id}, (responseJson)=>{
      this.setState({user: responseJson});
    }, (error)=>{});

    this.props.navigation.addListener('willFocus', (playload)=>{
      if (Storage.user && Storage.user.id == this.state.user.id) {
        this.setState({user: Storage.user});
      }
    });
  }

  handleLoadMore = () => {
    if (this.state.load_more_ing)
      return
    this.setState({load_more_ing: true, load_more_err: false});
    API.Status.get({
          type:'user',
          user_id: this.state.user.id,
          offset:this.state.statuses.length
    }, (responseJson)=>{
      const _statuses = [...this.state.statuses, ...responseJson]
      this.setState({load_more_ing: false, statuses: _statuses, has_next: responseJson.length==10});
    }, (error)=>{
      this.setState({load_more_ing: false, load_more_err: true});
      MyToast.show(error.message)
    })    
  }

  renderByType(_item) {
    const { index, item } = _item;
    if (item.type == API.Status.GROUPPOST)
      return <GroupPostItem2 
                {...this.props}
                showSource={true}
                status={item} />
    return <StatusesItem 
              {...this.props} 
              status={item} 
              abstract={true}
              handleMoreButton={()=>{this._handleItemMoreButton(index);}} />
  }

  renderFooter() {
    const error = this.state.load_more_err || !this.state.has_next;
    const error_msg = this.state.load_more_err ? '加载失败, 点击重试': '没有更多内容';
    return (
      <Loading style={{height:60}} error={error} error_msg={error_msg} onRetry={this.handleLoadMore}/>
    )
  }

  handleScroll(e) {
    let offsetY = e.nativeEvent.contentOffset.y;
    let pointHeight = ScreenWidth / 2.2 - headerHeight;
    const T = 30;
    const a = pointHeight - offsetY;
    const underlayOpacity = (a < T && a > 0) ? (T - a) / T : 0;
    this.state.headerUnderlayTextOpacity.setValue(underlayOpacity);
    const overlayOpacity = Math.min(offsetY / pointHeight, 1);
    this.state.headerOverlayOpacity.setValue(overlayOpacity); 
    this.state.headerOpacity.setValue(offsetY >= pointHeight? 1: 0);
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
          ItemSeparatorComponent={()=><View style={{height:8}}></View>}
          ListFooterComponent={this.renderFooter.bind(this)} 
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.1}
          onScroll={this.handleScroll.bind(this)}
          />
        <Animated.View style={{position:'absolute', top:0, left:0, right:0,
              height:headerHeight, backgroundColor:Theme.themeColor,
              opacity: this.state.headerOpacity, justifyContent:'center',
              paddingLeft:64, paddingTop: StatusBarHeight}} >
              <Text style={{color:'#fff', fontSize:18}}>{this.state.user.username}</Text>
        </Animated.View>
      </View>
    )
  }

  onFollowUserPress = () => {
    if (this.state.user_following)
      return
    this.setState({user_following: true});
    API.UserFollowed.create({id: this.state.user.id}, (responseJson) => {
      this.state.user.followed_by_me = true;
      this.state.user.followers += 1;
      this.setState({user_following: false, user:this.state.user});
    }, (error) => {
      this.setState({user_following: false});
      MyToast.show('关注用户失败! ☹☹');
    });
  }

  onUnfollowUserPress = () => {
    if (this.state.user_unfollowing)
      return
    this.setState({user_unfollowing: true});
    API.UserFollowed.delete({id: this.state.user.id}, (responseJson) => {
      this.state.user.followed_by_me = false;
      this.state.user.followers -= 1;
      this.setState({user_unfollowing: false, user:this.state.user});
    }, (error) => {
      this.setState({user_unfollowing: false});
      MyToast.show('取关用户失败! ☹☹');
    });
  }

  onEditProfilePress = () => {
    this.props.navigation.navigate('User_EditProfilePage');
  }

  onPrivateMessagePress = () => {
    this.props.navigation.navigate('User_ChatPage', {user:this.state.user})
  }

  renderUnfollowButton = () => {
    return (
      <TouchableWithoutFeedback onPress={this.onUnfollowUserPress} >
        <View style={{flex:9, height:36, backgroundColor: '#ddd', flexDirection: 'row',
            justifyContent:'center', alignItems:'center', borderRadius:3, borderWidth:1, borderColor:'#ddd'}}>
          { this.state.user_unfollowing ? <ActivityIndicator style={{marginRight:12,}} size='small' color="#666" />:null}
          <Text style={{color:'#666', fontSize:14}}>已关注</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderFollowButton = () => {
    return (
      <TouchableWithoutFeedback onPress={this.onFollowUserPress} >        
        <View style={{flex:9, height:36, flexDirection: 'row',
            justifyContent:'center', alignItems:'center', borderRadius:3, borderWidth:1, borderColor:Theme.themeColor}}>
          { this.state.user_following ? <ActivityIndicator style={{marginRight:12,}} size='small' color={Theme.themeColor} />:null}
          <Text style={{color:Theme.themeColor, fontSize:14}}>关注</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  };

  renderFollowAndMessageButton = () => {
    return (
      <View style={{flexDirection:'row'}}>
        <View style={{flex:3}}></View>
        { this.state.user.followed_by_me ? this.renderUnfollowButton() : this.renderFollowButton() }
        <View style={{flex:2}}></View>
        <TouchableWithoutFeedback onPress={this.onPrivateMessagePress}>
          <View style={{flex:9, paddingTop:8, paddingBottom:8,
              justifyContent:'center', alignItems:'center', borderRadius:3, borderWidth:1, borderColor:Theme.themeColor}}>
            <Text style={{color:Theme.themeColor, fontSize:12.5}}>私信</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex:3}}></View>
      </View>
    )
  };

  renderEditProfileButton = () => {
    return (
      <View style={{flexDirection:'row'}}>
        <View style={{flex:2}}></View>
        <TouchableWithoutFeedback onPress={this.onEditProfilePress}>
          <View style={{flex:3, paddingTop:8, paddingBottom:8,
              justifyContent:'center', alignItems:'center', borderRadius:3, borderWidth:1, borderColor:Theme.themeColor}}>
            <Text style={{color:Theme.themeColor, fontSize:12.5}}>编辑个人信息</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex:2}}></View>
      </View>
    )
  };

  onUserFollowedPress = () => {
    this.props.navigation.navigate('User_RelationshipsPage', {user:this.state.user, type:'user_followed'});
  };

  onUserFollowersPress = () => {
    this.props.navigation.navigate('User_RelationshipsPage', {user:this.state.user, type:'user_followers'});
  };

  onUserGroupsEnrolledPress = () => {
    this.props.navigation.navigate('User_RelationshipsPage', {user:this.state.user, type:'user_groups'});
  }

  renderHeader = () => {
    const user = this.state.user;
    return (
      <View>
        <View style={{flex:1, aspectRatio:2.2, flexDirection:'row'}}>
          <Image style={{flex:1}} 
                 source={{uri: 'http://mmbiz.qpic.cn/mmbiz_jpg/OicCOBfngjymsJmniaQWJqibHRxzgSBY0HoM1ZpuwsxBuUTfN8n8iaxeoLcteCn861VqBg5l3PrEaeNMUV5gYqu5Iw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1'}}/>
          <View style={{position:'absolute', top:0, left:0, right:0, height:ScreenWidth/2.2, backgroundColor:'rgba(0,0,0,0.2)'}}></View>
        </View>
        <View style={{backgroundColor:'#fff', paddingLeft:8, paddingRight:8}}>
          <View style={{alignItems:'center', marginTop:50}}>
            <Text style={{color:'#444', fontWeight:'500', fontSize:17}}>{user.username}</Text>
            <Text style={{color:'#444', fontSize:15}}>{user.self_intro}</Text>
          </View>
          <View style={{borderBottomWidth:0.5, borderColor:'#ccc', padding:16}}>
          { Storage.user && this.state.user.id == Storage.user.id ? this.renderEditProfileButton():this.renderFollowAndMessageButton()}
          </View>
          <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:0.5, borderColor:'#ccc'}}>
            <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#fff'}}>
              <Text style={{paddingTop:12, paddingBottom:12, fontSize:15, color:'#222'}} onPress={this.onUserFollowedPress}>{user.followed}<Text style={{fontSize:13, color:'#666'}}> 他关注的人</Text></Text>
            </View>
            <View style={{width:1, height:16, backgroundColor:'#ccc'}}></View>
            <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#fff'}}>
              <Text style={{paddingTop:12, paddingBottom:12, fontSize:15, color:'#222'}} onPress={this.onUserFollowersPress}>{user.followers}<Text style={{fontSize:13, color:'#666'}}> 关注他的人</Text></Text>
            </View>
            <View style={{width:1, height:16, backgroundColor:'#ccc'}}></View>
            <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#fff'}}>
              <Text style={{paddingTop:12, paddingBottom:12, fontSize:15, color:'#222'}} onPress={this.onUserGroupsEnrolledPress}>{user.groups_enrolled}<Text style={{fontSize:13, color:'#666'}}> 加入的团体</Text></Text>
            </View>
          </View>
        </View>
        <View style={{position:'absolute', top:ScreenWidth/2.2-51, width:ScreenWidth, alignItems:'center'}}>
          <TouchableWithoutFeedback onPress={()=>{}}>
            <View style={{borderWidth:3, borderRadius:50, borderColor:'#fff'}}>
              <UserAvatar {...this.props} user={user} size={96} hideLogo={true} style={{margin:-1}} onPress={()=>{
                this.props.navigation.navigate('Common_PhotoViewPage', {images: [{source: {uri: user.avatar+'!thumbnail', bigUri: user.avatar}}]})
              }}/>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Animated.View style={{position:'absolute', top:0, left:0, right:0, height:ScreenWidth/2.2, 
            backgroundColor: '#fff', opacity:this.state.headerOverlayOpacity}} />
        <Animated.View style={{position:'absolute', top:0, left:0, right:0, height:ScreenWidth/2.2,
            opacity: this.state.headerUnderlayTextOpacity}} >
          <Text style={{position:'absolute', left:64, bottom:12, color:'#fff', fontSize:18}}>{user.username}</Text>
        </Animated.View>
        { 
          this.state.statuses.length == 0  ? null :
          <Text style={{padding:6, paddingLeft: 12, fontSize:13, color:'#666'}}>他的动态</Text>
        }
      </View>
    )
  };
}
