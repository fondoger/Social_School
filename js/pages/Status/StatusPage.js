'use strict';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import { getGMTTimeDiff } from '../../utils/Util';
import Styles from '../../utils/Styles';
import { SlideInMenu, BottomInputBar, GroupAvatar, UserAvatar, StatusesItem, StatusReplyItem, Loading, MyToast, HeaderRight } from '../../components';

export default class StatusPage extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const status = navigation.state.params.status;
    const name = status.type == API.Status.GROUPSTATUS ? status.group.groupname : status.user.username;
    const _title = status.title || (name + '的帖子');
    const title = navigation.state.params.showTitle ? _title : "";
    
    const style = {
        backgroundColor: '#fff',
        borderBottomWidth: navigation.state.params.showTitle ? .5 : 0,
        borderColor:'#ccc',      
        paddingTop: Theme.statusBarHeight,
        height: Theme.headerHeight + Theme.statusBarHeight,
        elevation: 0,
        shadowOpacity: 0,
    }
    return {
      title: title,
      headerTintColor: Theme.lightHeaderTintColor,
      headerStyle: style,
      headerTitleContainerStyle: { left: 40 },
      headerRight: (
        <HeaderRight 
          tintColor={Theme.lightHeaderTintColor} 
          backgroundColor={Theme.lightHeaderStyle.backgroundColor}
          onPress={navigation.state.params.handleMoreButton}
        />
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
    setTimeout(() => {
      // delay for more smooth screen transition
      this.initialLoading();
    }, 250);
    this.props.navigation.setParams({ handleMoreButton: this.handleMoreButton })
  }


  initialLoading() {
    this.setState({ init_load_err: false })
    API.Status.get({ id: this.state.status.id }, (responseJson) => {
      this.setState({ status: responseJson, init_load_ing: false, });
    }, (error) => {
      this.setState({ init_load_err: true, });
    });
    this.handleLoadMore();
  }

  handleRefresh = () => {
    this.setState({ refreshing: true, });
    const { status, replies, } = this.state;
    API.Status.get({ id: status.id }, (responseJson) => {
      MyToast.show('刷新成功');
      console.log("Refresh Success: ");
      console.log(responseJson);
      this.setState({ status: responseJson, refreshing: false });
    }, (error) => {
      MyToast.show('刷新失败');
      this.setState({ refreshing: false });
    });
    this.handleLoadMore({ reload: true });
  };

  handleLoadMore = (args) => {
    const reload = args && args.reload;
    if (args && args.reload) {
      this.state.has_next = true;
      this.state.load_more_ing = false;
      this.state.replies = [];
    }
    const { status, replies, reverseOrder, has_next } = this.state;
    if (this.state.load_more_ing || !has_next)
      return
    this.setState({ load_more_ing: true, load_more_err: false });
    API.StatusReply.get({
      status_id: status.id,
      reverse: reverseOrder,
      offset: replies.length,
    }, (responseJson) => {
      var _replies = [...replies, ...responseJson];
      this.setState({
        replies: _replies,
        has_next: responseJson.length == 10,
        load_more_ing: false,
      });
    }, (error) => {
      this.setState({ load_more_ing: false, load_more_err: true });
    });
  };

  renderFooter() {
    const { has_next, load_more_err, replies, load_more_ing } = this.state;
    const error = load_more_err || (!has_next && !load_more_ing);
    const error_msg = load_more_err ? '加载失败, 点击重试' : '没有更多内容';
    //const height = replies.length==0?160: 60;
    if (replies.length != 0 && !has_next)
      return <View style={{ height: 120, marginBottom: 300, }} />
    return (
      <Loading
        error={error}
        style={{ height: 120, marginBottom: 400, backgroundColor: '#fff'}}
        error_msg={error_msg}
        onRetry={this.handleLoadMore.bind(this)}
      />
    )
  }

  handleMoreButton = () => {
    SlideInMenu.showMenu(['删除微博', '复制正文', '收藏微博'], (selected) => {
      if (selected == 0)
        API.Status.delete({ id: this.state.status.id }, (responseJson) => {
          MyToast.show('删除成功');
          setTimeout(() => {
            this.props.navigation.goBack();
          }, 1000);
        }, (err) => { MyToast.show('删除失败😭') });
    });
  }

  handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY > 25 && !this.showTitle) {
      this.showTitle = true;
      this.props.navigation.setParams({showTitle: true});
    } else if (offsetY <= 25 && this.showTitle ){
      this.showTitle = false;
      this.props.navigation.setParams({showTitle: false});
    }
  }

  render() {
    const { status, init_load_ing, init_load_err, } = this.state;
    if (init_load_ing)
      return <Loading
        style={{ backgroundColor: '#fff' }}
        fullScreen={true}
        error={init_load_err}
        onRetry={this.initialLoading.bind(this)}
      />
    return (
      <View style={{ flex: 1, backgroundColor: '#F2F1EE' }}>
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
          onScroll={this.handleScroll}
        />
        <BottomInputBar onSendPress={this.onSendPress.bind(this)} />
      </View>
    )
  }

  onSendPress(text, callback) {
    const { status, reverseOrder, replies, has_next } = this.state;
    API.StatusReply.create({ status_id: status.id, text: text }, (responseJson) => {
      status.replies += 1;
      if (reverseOrder) {
        replies.splice(0, 0, responseJson)
        this.setState({ replies });
      } else if (!has_next) {
        replies.push(responseJson);
        this.setState({ replies });
      }
      MyToast.show('回复成功!', { length: 'long' });
      callback(true);
    }, (error) => {
      MyToast.show('啊呀, 粗错啦, 回复失败!', { type: 'warning', length: 'long' });
      callback(false);
    });
  }

  _onChangeText = (text) => {
    this.props.navigation.setParams({ finishEnabled: text === '' ? false : true });
    this.setState({
      textValue: text,
    });
  }

  _onReverseOrderChange() {
    this.setState({ reverseOrder: !this.state.reverseOrder });
    this.handleLoadMore({ reload: true });
  }

  renderUserStatus() {
    const item = this.state.status;
    return (
      <View style={{ marginTop: -12}}>
        <StatusesItem style={{ borderBottomWidth: 0.5, borderColor: '#ddd', }} {...this.props} hideMenuButtom={true} status={item} />
        {this.renderSectionHeader()}
      </View>
    );

  }

  renderGroupPost() {
    const item = this.state.status;
    return (
      <View>
        { this.renderPostTitle() }
        <StatusesItem style={{ borderBottomWidth: 0.5, borderColor: '#ddd' }} {...this.props} hideMenuButtom={true} status={item} />
        <GroupDetailBanner group={item.group} />
        {this.renderSectionHeader()}
      </View>
    );
  }

  renderHeader() {
    if (this.state.status.type === API.Status.GROUPPOST) {
      return this.renderGroupPost();
    } else {
      return this.renderUserStatus();
    }
  }

  renderSectionHeader() {
    const item = this.state.status;
    const color = this.state.reverseOrder ? Theme.themeColor : '#666';
    return (
      <View style={{
        padding: 12, marginTop: 10, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderBottomWidth: 0.5, borderColor: '#ddd'
      }}>
        <View style={{ height: 15, borderRadius: 2, marginRight: 4, width: 3, backgroundColor: Theme.themeColor }} />
        <Text style={{ flex: 1, fontSize: 14, color: '#666' }}>共{item.replies}条回复</Text>
        <TouchableWithoutFeedback onPress={this._onReverseOrderChange.bind(this)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Text style={{ fontFamily: 'iconfont', fontSize: 20, paddingTop: 2, color: color }}>&#xe685;</Text>
            <Text style={{ fontSize: 14, color: color }}>逆序查看</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  navigateToGroupPage() {
    this.props.navigation.navigate('Group_GroupPage', { group: this.state.status.group });
  }

  navigateToUserPage() {
    this.props.navigation.navigate('User_UserPage', { user: this.state.status.user });
  }

  renderPostTitle() {
    const status = this.state.status;
    return (
      <View style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 12, paddingTop: 0,
            borderColor: '#eee', borderBottomWidth: 0.5, alignItems: 'flex-start' }} >
        <View style={{ flex: 1, paddingTop: 0 }}>
          <Text style={{ color: '#222', fontSize:  22, fontWeight: 'bold', lineHeight: 30}}>{status.title}</Text>
          <Text style={{ color: '#aaa', fontSize: 12,  marginTop: 8, marginBottom: 0 }}>
            <Text style={{color: '#555'}} onPress={this.navigateToUserPage.bind(this)}>{status.user.username} </Text>
            来自 <Text style={{color: Theme.themeColor}} onPress={this.navigateToGroupPage.bind(this)} >{status.group.groupname} </Text>
            小组    {getGMTTimeDiff(status.timestamp)}
          </Text>
        </View>
        <UserAvatar style={{marginLeft: 8}} user={status.user} size={44} />
      </View>
    )
  }

  renderReplyItem(_item) {
    const { index, item } = _item;
    return (
      <StatusReplyItem
        {...this.props}
        reply={item}
        modalMenu={this.refs.modalMenu}
        handleDeleteItem={() => {
          this.state.replies.splice(index, 1);
          this.setState({ replies: this.state.replies });
        }}
      />
    )
  }

}

const GroupDetailBanner_ = ({ group, ...props }) => (
  <TouchableHighlight
    underlayColor={Theme.activeUnderlayColor}
    onPress={() => props.navigation.navigate('Group_GroupPage', { group })}
    style={[{ marginTop: 8 }, Styles.borderBlockItem]}>
    <View style={{ flexDirection: 'row', padding: 12, backgroundColor: '#fff', alignItems: 'flex-start' }} >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, color: '#444', fontWeight: '500', marginBottom: 4 }}
        >{group.groupname}</Text>
        <Text style={{ fontSize: 12, color: '#888' }} >{group.description||"并没有小组介绍。。。"}</Text>
      </View>
      <GroupAvatar size={48} group={group} />
    </View>
  </TouchableHighlight>
);
const GroupDetailBanner = withNavigation(GroupDetailBanner_);