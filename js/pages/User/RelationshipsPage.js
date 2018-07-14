'use strict';
import React from 'react';
import { 
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { Loading, UserAvatar, StatusesItem, GroupPostItem } from '../../components';


export default class RelationshipsPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const navParams = navigation.state.params;
    const person = navParams.user.id == (Storage.user&&Storage.user.id) ? '我': 'Ta';
    const title = navParams.type === 'user_followed' ? `${navParams.user.followed} ${person}关注的人` :
                 navParams.type === 'user_followers' ? `${navParams.user.followers} 关注${person}的人` :
                 navParams.type === 'user_groups' ? `${navParams.user.groups_enrolled} ${person}加入的团体` : null;
    return { title: title, }
  };

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
    this.setState({load_more_ing: true, load_more_error: false});
    const type = this.props.navigation.state.params.type;
    const user = this.props.navigation.state.params.user;

    const func = type === 'user_followed' ? API.UserFollowed.get :
                 type === 'user_followers' ? API.UserFollower.get :
                 type === 'user_groups' ? API.UserGroup.get : null;
    if (func)
      func({id:user.id, limit:10, offset:this.state.items.length}, (responseJson)=>{
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

  renderGroupItem(group) {
    return (
      <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Group_GroupPage', {group:group})}>
      <View style={{flexDirection:'row', backgroundColor:'#fff', padding:12}}>
        <View style={{width:48, height:48}}>
          <Image style={{width:48, height:48}} source={{uri:group.avatar+'!thumbnail'}}/>
        </View>
        <View style={{flex:1, marginLeft:16}}>
          <Text style={{color:'#444', fontSize:14, fontWeight:'bold', marginTop:2, marginBottom:2}}>{group.groupname}</Text>
          <Text style={{fontSize:13}}>{group.description}</Text>
        </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }

  renderByType(_item) {
    const { index, item } = _item;
    if (item.username)
      return this.renderUserItem(item);
    return this.renderGroupItem(item);
  }

  renderFooter() {
    return (
      <View style={{height:80, justifyContent:'center', alignItems:'center'}}>
        { this.state.load_more_error ? 
          <Text style={{color:'#888'}} onPress={this.handleLoadMore}>哎呀, 出了点问题, 加载失败!(点击重试)</Text> :
          this.state.load_more_ing ?
          <ActivityIndicator size='small' color='#888' /> :
          this.state.has_next ?
          <Text style={{color:'#888'}}>加载中</Text>:
          this.state.items.length == 0  ?
          <Text style={{color:'#888'}}>没有更多内容</Text> :
          <Text style={{color:'#888'}}>已经全部加载完毕!</Text> }
      </View>
    )
  }

  render() {
    return (
      <FlatList
        data={this.state.items}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={this.renderByType.bind(this)}
        onEndReached={this.handleLoadMore}
        ItemSeparatorComponent={()=><View style={{height:0.5, backgroundColor:'#eee'}}></View>}
        ListFooterComponent={this.renderFooter.bind(this)}
        onEndReachedThreshold={0.01}
        />
    )
  }

}
