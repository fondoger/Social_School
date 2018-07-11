'use strict';
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  Platform,
  StatusBar, 
  TextInput, 
  ScrollView,
  SectionList,
  ActivityIndicator, 
  TouchableHighlight,
  KeyboardAvoidingView, 
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import { getGMTTimeDiff } from '../../utils/Util';
import Styles from '../../utils/Styles';
import { SlideInMenu, BottomInputBar, UserAvatar, StatusesItem, StatusReplyItem, Loading } from '../../components';

const StatusBarHeight = (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight);

export default class StatusPage extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const status = navigation.state.params.status;
    const name = status.type==API.Status.GROUPSTATUS?status.group.groupname:status.user.username;
    const title = status.type==API.Status.GROUPPOST?'的帖子':'的微博';
    return {
      title: name+title,
      headerTintColor:'#444',
      headerStyle: {
        backgroundColor:Theme.headerColorLight,
        borderBottomWidth:0.5,
        borderColor:'#ccc',      
        paddingTop: StatusBarHeight,
        height: Theme.headerHeight + StatusBarHeight,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerRight: (
        <TouchableHighlight onPress={navigation.state.params.handleMoreButton}>
          <View style={{backgroundColor:Theme.headerColorLight, width:50, alignItems:'center', flex:1, justifyContent:'center'}} >
            <Text style={{fontFamily:'iconfont', fontSize:21, color:Theme.headerColorLightTint,}}>&#xe617;</Text>
          </View>
        </TouchableHighlight>
      )
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      textValue: '',
      status: this.props.navigation.state.params.status,
      replies: [],
      reverseOrder: false,
      has_next: true,
      refreshing: false, // for pull to refresh
      load_more_ing: false,
      load_more_err: false,
      init_load_ing: true,
      init_load_err: false,
    };
  }

  componentDidMount() {
    setTimeout(()=>{
      // delay for more smooth screen transition
      this.initialLoading();
    }, 250);
    this.props.navigation.setParams({handleMoreButton:this.handleMoreButton})
  }


  initialLoading() {
    this.setState({init_load_err: false})
    API.Status.get({id:this.state.status.id}, (responseJson)=>{
      this.setState({ status: responseJson, init_load_ing: false,});
    }, (error) => {
      this.setState({init_load_err: true,});
    });
    this.handleLoadMore();
  }

  handleRefresh = () => {
    this.setState({refreshing: true,});
    const { status, replies, } = this.state;
    API.Status.get({id:status.id}, (responseJson)=>{
      this.props.screenProps.showToast('刷新成功');
      this.setState({ status: responseJson, refreshing: false});
    }, (error) => {
      this.props.screenProps.showToast('刷新失败');
      this.setState({ refreshing: false});
    });
    this.handleLoadMore({reload:true});
  };

  handleLoadMore = (args) => {
    const reload = args && args.reload;
    const { status, replies, reverseOrder, has_next } = this.state;
    if (this.state.load_more_ing)
      return
    this.setState({load_more_ing:true, load_more_err: false});
    API.StatusReply.get({
        status_id: status.id, 
        reverse: reverseOrder, 
        offset: reload?0:replies.length,
    }, (responseJson)=>{
      var _replies = reload ? responseJson :[...replies, ...responseJson];
      this.setState({
        replies: _replies,
        has_next: responseJson.length==10,
        load_more_ing:false,
      });
    }, (error) => {
      this.setState({load_more_ing:false, load_more_err:true});
    });
  };

  renderFooter() {
    const { has_next, load_more_err, replies, load_more_ing } = this.state;
    const error = load_more_err || (!has_next && !load_more_ing);
    const error_msg = load_more_err ? '加载失败, 点击重试': '没有更多内容';
    const height = replies.length==0?160: 60;
    return (
      <Loading 
        error={error} 
        style={{height: height, backgroundColor:'#fff', marginBottom:12}} 
        error_msg={error_msg} 
        onRetry={this.handleLoadMore.bind(this)}
      />
    )
  }

  handleMoreButton = () => {
    console.log(this.props.screenProps.showSlideInMenu);
    this.props.screenProps.showSlideInMenu(['删除微博', '复制正文', '收藏微博'], (selected) => {
      if (selected == 0)
        API.Status.delete({id: this.state.status.id}, (responseJson)=>{
          this.props.screenProps.showToast('删除成功');
          setTimeout(()=>{
            this.props.navigation.goBack();
          }, 1000);
        }, (err)=>{this.props.screenProps.showToast('删除失败😭')});
    }) ;   
  }

  render() {
    const {status, init_load_ing, init_load_err, } = this.state;
    if (init_load_ing)
      return <Loading 
        style={{backgroundColor:'#eee'}} 
        fullScreen={true} 
        error={init_load_err} 
        onRetry={this.initialLoading.bind(this)}
      />
    return (
      <View style={{flex:1, backgroundColor:'#eee'}}>
        <FlatList
          ListHeaderComponent={this.renderHeader.bind(this)}
          ListFooterComponent={this.renderFooter.bind(this)}
          data={this.state.replies}
          keyExtractor={((item, index) => item.id.toString())}
          renderItem={this.renderReplyItem.bind(this)}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.01}
        />
        <BottomInputBar {...this.props} onSendPress={this.onSendPress.bind(this)}/>
      </View>
    )
  }

  onSendPress(text, callback) {
    const {status, reverseOrder, replies, has_next} = this.state;
    API.StatusReply.create({status_id:status.id, text: text}, (responseJson)=>{
      status.replies += 1;
      if (reverseOrder) {
        replies.splice(0,0,responseJson)
        this.setState({replies});
      } else if (!has_next) {
        replies.push(responseJson);
        this.setState({replies});
      }
      this.props.screenProps.showToast('回复成功!', {length:'long'});
      callback(true);
    }, (error)=>{
      this.props.screenProps.showToast('啊呀, 粗错啦, 回复失败!', {type:'warning', length:'long'});
      callback(false);
    });
  }

  _onChangeText = (text) => {
    this.props.navigation.setParams({ finishEnabled: text===''?false: true});
    this.setState({
      textValue: text,
    });
  }

  _onReverseOrderChange() {
    this.setState({reverseOrder: !this.state.reverseOrder, replies: []});
    setTimeout(()=>{
      this.handleLoadMore({reload:true});
    }, 20);
  }

  renderHeader() {
    const item = this.state.status;
    return (
      <View style={{paddingTop: 8}}>
        {item.type === API.Status.GROUPPOST ? this.renderPostTitle(): null}
        <StatusesItem style={{borderBottomWidth:0.5, borderColor:'#ddd'}} {...this.props} inDetailedPage={true} status={item}/>
        { item.type === API.Status.GROUPPOST ? this.renderPostUserDetail(): null}
        { this.renderSectionHeader() }
      </View>
    )
  }

  renderSectionHeader() {
    const item = this.state.status;
    const color = this.state.reverseOrder ? Theme.themeColor:'#666';
    return (
      <View style={{padding:12, marginTop:8, flexDirection:'row', alignItems:'center',
          backgroundColor:'#fff', borderBottomWidth:0.5, borderColor:'#ddd'}}>
        <Text style={{flex:1, fontSize:14, color:'#666'}}>共{item.replies}条回复</Text>
        <TouchableWithoutFeedback onPress={this._onReverseOrderChange.bind(this)}>
          <View style={{flexDirection:'row', alignItems:'center',}}>
            <Text style={{fontFamily:'iconfont', fontSize:20, paddingTop:2, color:color}}>&#xe685;</Text>
            <Text style={{fontSize:14, color:color}}>逆序查看</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderPostTitle() {
    const status = this.state.status;
    return (
      <View style={{padding:12, paddingBottom:8, paddingTop:16, 
            borderColor:'#eee', borderBottomWidth:0.5, backgroundColor:'#fff'}}>
        <Text style={{color:'#444', fontSize:17, fontWeight:'500',}}>{status.title}</Text>
        <Text style={{color:'#888', fontSize:12, marginTop:4}}>
          By {status.user.username} at {status.group.groupname}, {getGMTTimeDiff(status.timestamp, 'POSTTIME')}
        </Text>
      </View>
    )
  }

  renderPostUserDetail() {
    const status = this.state.status;
    return (
      <TouchableHighlight 
          underlayColor={Theme.activeUnderlayColor}
          onPress={()=>this.props.navigation.navigate('User_ProfilePage', {user:status.user})}
          style={[{marginTop:8}, Styles.borderBlockItem]}>
        <View style={{flexDirection:'row', padding:12, backgroundColor:'#fff'}} >
          <View style={{flex:1}}> 
            <Text style={{fontSize:16, color:'#444', fontWeight:'555', marginBottom:4}}
              >{status.user.username}</Text>
            <Text style={{fontSize:12, color:'#888'}} >{status.user.self_intro}</Text>
          </View>
          <UserAvatar size={48} {...this.props} user={this.state.status.user}/>
        </View>
      </TouchableHighlight>
    )
  }

  renderReplyItem(_item) {
    const { index, item } = _item;
    return (
      <StatusReplyItem 
        {...this.props}
        reply={item} 
        modalMenu={this.refs.modalMenu}
        handleDeleteItem={()=>{
          this.state.replies.splice(index,1);
          this.setState({replies:this.state.replies});
        }}
      />
    )
  }

}