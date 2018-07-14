'use strict';
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TextInput,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import { Loading, UserAvatar, IconFont } from '../../components';
import { API, Theme } from '../../utils';

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

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      load_more_error: false,
      load_more_ing: false,
      has_next: true,
      keyword: '',
      textInputFocused: false,
    }
  }

  handleLoadMore = () => {
    if (this.state.load_more_ing || !this.state.has_next)
      return
    API.User.get({keyword:this.state.keyword, limit:10, offset:this.state.items.length}, (responseJson)=>{
      const items = [...this.state.items, ...responseJson]
      this.setState({load_more_ing: false, items:items, has_next: responseJson.length==10});
    }, (error)=>{
      this.setState({load_more_ing: false, load_more_error: true});
    });
  }

  onSearchItemPress() {
    this.state.items = [];
    this.state.load_more_ing = false;
    this.state.has_next = true;
    this.handleLoadMore();
  }

  renderSearchBar() {
    return (
      <View style={styles.searchBar}>
        <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
          <IconFont icon='&#xe622;' style={{width:60, alignItems:'center', padding:12, paddingTop:13}} size={24} color='#fff' />
        </TouchableWithoutFeedback>
        <View style={styles.textInputWrap} >
          <TextInput 
            style={styles.textInput}
            multiline={false}
            placeholder="动态、用户、团体、二手"
            value={this.state.keyword}
            onChangeText={(text)=>this.setState({keyword: text})}
            underlineColorAndroid="transparent"
            selectionColor='rgba(255,255,255,.75)'
            placeholderTextColor='rgba(255,255,255,.4)'
            onFocus={()=>this.setState({textInputFocused: true})}
            onBlur={()=>this.setState({textInputFocused: false})}
            onSubmitEditing={this.onSearchItemPress.bind(this)}
          />
          {
            this.state.keyword === '' ? null:
            <IconFont icon="&#xe691;" size={20} color="#fff"
                      style={{margin:6, marginBottom:4}}
                      onPress={()=>this.setState({keyword: ''})}/>
          }
          </View>
      </View>
    )
  }

  renderSearchHint() {
    if (!this.state.textInputFocused || this.state.keyword === "")
      return null;
    return (
      <View style={{position:'absolute', flex:1, flexDirection:'row', paddingLeft:16, paddingRight:16, paddingTop:4}}>
        <View style={{flex:1, flexDirection:'row', elevation: 8, backgroundColor:'#fff'}}>
          <TouchableHighlight onPress={this.onSearchItemPress.bind(this)} style={{flex:1, flexDirection:'row'}} >
            <View style={{backgroundColor:'#fff', padding: 16, flex:1}}>
              <Text style={{color:Theme.themeColorDeep, fontSize:16,}}>搜索 "{this.state.keyword}"</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
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
      <View style={styles.container} >
        { this.renderSearchBar() }
        <View>
          <FlatList
            data={this.state.items}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={({item, index}) => {return this.renderUserItem(item);}}
            onEndReached={this.handleLoadMore}
            ItemSeparatorComponent={()=><View style={{height:0.5, backgroundColor:'#eee'}}></View>}
            ListFooterComponent={this.renderFooter.bind(this)}
          />  
          { this.renderSearchHint() }
        </View>
      </View>
    )
  }

  renderFooter() {
    const { load_more_err, has_next, items, keyword } = this.state;
    const error = this.state.load_more_err || !this.state.has_next;
    const error_msg = this.state.load_more_err ? '加载失败, 点击重试': 
                      items.length ==  0 ? `找不到与"${keyword}"相关的内容` : '没有更多内容' ;
    return (
      <Loading style={{height:items.length==0?180:60}} error={error} error_msg={error_msg} onRetry={this.handleLoadMore}/>
    )
  }

  renderInitialPage() {
    const hot_search = ['新声力量', '毛不易', '石头计划', '镇魂', '乐华七子NEXT', 
      'Wrecking Ball', 'Hymn For The Weekend', '模特', '偶像练习生'];
    return (
      <View style={styles.container}>
        <View>
          <Text>热门搜索</Text>
          <View></View>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    paddingTop: Theme.statusBarHeight,
    height: Theme.headerHeight + Theme.statusBarHeight,
    backgroundColor: Theme.themeColor,
  },
  textInputWrap: {
    flex:1, 
    flexDirection:'row', 
    alignItems:'flex-end', 
    margin:7,
    marginLeft:0, 
    paddingBottom:2, 
    borderBottomWidth:1, 
    borderColor:'rgba(255,255,255,.75)',
  },
  textInput: {
    padding:0, 
    flex:1, 
    fontSize:16,
    color: '#fff',
  },
});