'use strict';
import React from 'react';
import { View, Text, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Loading, UserAvatar } from '../../components';
import API from '../../utils/API_v1';

// export default class SearchPage extends React.Component {
//   static navigationOptions = {
//     title: '搜索页',
//   };
//   render() {
//     return (
//       <Loading fullScreen={true} size='large'/>
//     )
//   }

// }
const user_A = {
    "avatar": "http://asserts.fondoger.cn/avatar/168261373d6cb92d80987fce1c9a604c.webp",
    "followed": 1,
    "followed_by_me": false,
    "followers": 0,
    "gender": 1,
    "groups_enrolled": 50,
    "id": 1,
    "last_seen": "Sat, 31 Mar 2018 10:57:07 GMT",
    "member_since": "Sat, 31 Mar 2018 10:57:07 GMT",
    "self_intro": "游走在挂科的边缘",
    "username": "开发者"
};


export default class UserTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      load_more_error: false,
      load_more_ing: false,
      has_next: true,
    }
  }

  componentDidMount() {
    this.handleLoadMore();
  }

  handleLoadMore = () => {
    if (this.state.load_more_ing || !this.state.has_next)
      return
    API.User.get({keyword:'c', limit:10, offset:this.state.items.length}, (responseJson)=>{
        const items = [...this.state.items, ...responseJson]
        this.setState({load_more_ing: false, items:items, has_next: responseJson.length==10});
      }, (error)=>{
        this.setState({load_more_ing: false, load_more_error: true});
      });
  }

  renderUserItem(user) {
    return (
      <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('User_ProfilePage', {user:user})}>
      <View style={{flexDirection:'row', backgroundColor:'#fff', padding:12}}>
        <UserAvatar user={user} size={48} />
        <View style={{flex:1, marginLeft:12}}>
          <Text style={{color:'#444', fontSize:14, fontWeight:'bold', marginTop:2, marginBottom:2}}>{user.username}</Text>
          <Text style={{fontSize:13}}>{user.self_intro}</Text>
        </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    return (
      <FlatList
        data={this.state.items}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({item, index}) => {return this.renderUserItem(item);}}
        onEndReached={this.handleLoadMore}
        ItemSeparatorComponent={()=><View style={{height:0.5, backgroundColor:'#eee'}}></View>}
        ListFooterComponent={this.renderFooter.bind(this)}
      />
    )
  }

  renderFooter() {
    const error = this.state.load_more_err || !this.state.has_next;
    const error_msg = this.state.load_more_err ? '加载失败, 点击重试': '没有更多内容';
    return (
      <Loading style={{height:60}} error={error} error_msg={error_msg} onRetry={this.handleLoadMore}/>
    )
  }
}
