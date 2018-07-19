'use strict';
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TextInput,
  StyleSheet,
  PixelRatio,
  Keyboard,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Loading, UserAvatar, IconFont, MyToast, DividingLine, HeaderLeft, ListUserItem } from '../../components';
import { API, Theme,  Storage } from '../../utils';

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



class UserTab extends React.Component {
  static navigationOptions = { title: '用户' };
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      load_more_ing: false,
      load_more_err: false,
      has_next: true,
      prevKeyword: '',
    };
  }

  componentDidMount() {
    //MyToast.show("componentDidMount: UserTab");
    console.log("componentDidMount: UserTab");
    console.log("initial props:");
    console.log(this.props);
    this.listener = this.props.navigation.addListener('willFocus', playload => {
      console.log('willFocus: UserTab');
      console.log(playload);
      if (this.props.screenProps.keyword !== this.state.prevKeyword) {
        this.handleLoadMore();
      }
    });
  }

  componentWillUnMount() {
    this.listener.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    // called when once parent calls setState(),
    if (prevProps.screenProps.keyword !== this.props.screenProps.keyword) {
      this.state.items = [];
      this.state.has_next = true;
      this.state.load_more_ing = false;
      if (this.props.navigation.isFocused)
        this.handleLoadMore();
    }
  }

  handleLoadMore() {
    if (this.state.load_more_ing || !this.state.has_next)
      return
    console.log('fetch remote data, keyword:' + this.props.screenProps.keyword);
    this.setState({
      prevKeyword: this.props.screenProps.keyword,
      load_more_err: false,
      load_more_ing: true,
    });
    API.User.get({keyword:this.props.screenProps.keyword, limit:10, offset:this.state.items.length}, (responseJson)=>{
      const items = [...this.state.items, ...responseJson]
      this.setState({load_more_ing: false, items:items, has_next: responseJson.length==10});
    }, (error)=>{
      this.setState({load_more_ing: false, load_more_err: true});
    });
  }

  render() {
    return (
      <FlatList
        data={this.state.items}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({item, index}) => <ListUserItem user={item}/>}
        onEndReached={this.handleLoadMore.bind(this)}
        ItemSeparatorComponent={()=><View style={{height:0.5, backgroundColor:'#eee'}}></View>}
        ListFooterComponent={this.renderFooter.bind(this)}
      /> 
    )
  }

  renderFooter() {
    // 1. 在load_more_err时，显示重试提示信息
    // 2. has_next, 在没有更多内容时，若内容为空则显示找不到，若内容不为空，则显示没有更多内容
    // 3. 上述两种情况, error=true, 
    // 3. load_more_ing 的作用是防止重复调用handle_load_more()
    const { load_more_err, has_next, items } = this.state;
    const error = load_more_err || !has_next;
    const error_msg = load_more_err ? '加载失败, 点此重试': 
                      items.length ==  0 ? `找不到与"${this.props.screenProps.keyword}"相关的内容` : '' ;
    return (
      <Loading 
        style={{height:items.length==0?180:60}} 
        error={error} 
        error_msg={error_msg} 
        onRetry={this.handleLoadMore.bind(this)}
      />
    )
  }

}


class StatusTab extends React.Component {
  static navigationOptions = { title: '内容' };

  render() {
    return <View />
  }
}


const SearchResultTabs = createMaterialTopTabNavigator({
  StatusTab: StatusTab,
  UserTab: UserTab,
},{
  lazy: true,
  backBehavior: 'none',
  tabBarOptions: {
    useNativeDriver: true,
    activeTintColor: Theme.themeColor,
    inactiveTintColor: '#333333',
    allowFontScaling: false,
    style: {
      backgroundColor: '#feffff',
      height: 38,
      elevation: 0,
      shadowOpacity: 0,
    },
    indicatorStyle: {
      backgroundColor: Theme.themeColor,
    },
    labelStyle: {
      marginTop: 1.5,
      fontSize: 14,
    },
  },
});

export default class SearchPage extends React.Component {

  static navigationOptions = { header: null, }

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      textValue: '',
      keyword: '',
      textInputFocused: false,
      showInitialPage: true,
      search_history: Storage.search_history || [],
    }
  }

  onSearchItemPress() {
    if (this.state.textValue === '')
      return;
    this.setState((prevState, props)=>({
      keyword: prevState.textValue,
      showInitialPage: false,
    }));
    Keyboard.dismiss();
    this.updateHistory(this.state.textValue);
  }
/*
        <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
          <IconFont icon='&#xe622;' style={{width:60, alignItems:'center', padding:12, paddingTop:13}} size={24} color='#fff' />
        </TouchableWithoutFeedback>
        */
  renderSearchBar() {
    return (
      <View style={styles.searchBar}>
        <HeaderLeft tintColor='#fff'/>
        <View style={styles.textInputWrap} >
          <TextInput 
            style={styles.textInput}
            multiline={false}
            placeholder="动态、用户、团体、二手"
            value={this.state.textValue}
            onChangeText={(text)=>this.setState({textValue: text})}
            underlineColorAndroid="transparent"
            selectionColor='rgba(255,255,255,.75)'
            placeholderTextColor='rgba(255,255,255,.4)'
            onFocus={()=>this.setState({textInputFocused: true})}
            onBlur={()=>this.setState({textInputFocused: false})}
            onSubmitEditing={this.onSearchItemPress.bind(this)}
          />
          {
            this.state.textValue === '' ? null:
            <IconFont icon="&#xe691;" hint="clear text button" 
                      size={20} color="#fff" tyle={{margin:6, marginBottom:4}}
                      onPress={()=>this.setState({textValue: ''})}/>
          }
          </View>
      </View>
    )
  }

  renderSearchHint() {
    if (!this.state.textInputFocused || this.state.textValue === "")
      return null;
    return (
      <View style={{position:'absolute', paddingLeft:16, paddingRight:16, paddingTop:4, left: 0, top: 0, right: 0, bottom: 0}}>
        <View style={{flexDirection:'row', elevation: 8, backgroundColor:'#fff'}}>
          <TouchableHighlight onPress={this.onSearchItemPress.bind(this)} style={{flex:1, flexDirection:'row'}} >
            <View style={{backgroundColor:'#fff', padding: 16, flex:1}}>
              <Text style={{color:Theme.themeColorDeep, fontSize:16,}}>搜索 “{this.state.textValue}”</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  render() {
    const { showInitialPage } = this.state;
    return (
      <View style={styles.container} >
        { this.renderSearchBar() }
        <View style={{flex: 1}}>
          {
            showInitialPage ? this.renderInitialPage():
            <SearchResultTabs screenProps={{keyword: this.state.keyword}} />
          } 
          { this.renderSearchHint() }
        </View>
      </View>
    )
  }

  onChipPress(text) {
    this.setState({textValue: text}, ()=>{
      this.onSearchItemPress();
    });
  } 

  updateHistory(text) {
    Storage.search_history = Storage.search_history || [];
    Storage.search_history = Storage.search_history.filter(item => item !== text);
    Storage.search_history.unshift(text);
    Storage.search_history = Storage.search_history.slice(0, 5);
    Storage.setItem('search_history', Storage.search_history);
  }

  removeHistory(text) {
    Storage.search_history = Storage.search_history.filter(item => item !== text);
    Storage.setItem('search_history', Storage.search_history);
    this.setState({search_history: Storage.search_history});
  }

  renderInitialPage() {
    const hot_search = ['新声音量', '毛不易', '石头计划', '镇魂', '乐华七子NEXT', 
      '忘了牵手', '旅客', 'Everybody Hurts', 'Chanson De Toile', '摩登兄弟'];
    const search_history = this.state.search_history;
    return (
      <View style={{flex:1}}>
        <View style={{padding: 10}}> 
          <Text style={{fontSize: 13, marginTop: 12, marginBottom: 12}}>热门搜索</Text>
          <View style={{flexDirection:'row', flexWrap:'wrap', margin: -5}}>
          {
            hot_search.map((item, index)=>(
              <Chip text={item} key={item} onPress={()=>this.onChipPress(item)} />
            ))
          }
          </View>
        </View>
        <View style={{marginTop: 12}}> 
        {
          search_history.map((item, index) =>(
            <HistoryItem text={item} onPress={()=>this.onChipPress(item)} 
                         onDeletePress={()=>this.removeHistory(item)}/>
          ))
        }
        </View>
        <View style={{alignItems:'center', flex: 1, justifyContent:'flex-end'}}>
          <Text style={{color:'#ddd', margin: 8, fontSize: 12}}>Designed by @网易云音乐</Text>
        </View>
      </View>
    )
  }
}





class Chip extends React.Component {
  setActiveStyle() {
    this.inner.setNativeProps({backgroundColor:'#ced0d0'}); 
    this.text.setNativeProps({style:{color:'#fff'}});
  }
  setInactiveStyle() {
    this.inner.setNativeProps({backgroundColor:Theme.backgroundColor}); 
    this.text.setNativeProps({style:{color:'#222'}})
  }
  render() {
    const { text } = this.props;
    return (
      <View style={styles.chipOuter}>
        <TouchableWithoutFeedback 
            onPressIn={this.setActiveStyle.bind(this)}
            onPressOut={this.setInactiveStyle.bind(this)}
            onPress={this.props.onPress} >
          <View style={styles.chipInner} ref={ref=>this.inner=ref}>
            <Text style={styles.chipText} ref={ref=>this.text=ref}>{text}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

class HistoryItem extends React.Component {
  render() {
    return(
      <View>
        <TouchableWithoutFeedback 
            onPressIn={()=>{
              this.outer.setNativeProps({backgroundColor:'#ccc'}); 
              this.inner.setNativeProps({backgroundColor:'#ccc'});
            }}
            onPressOut={()=>{
              this.outer.setNativeProps({backgroundColor:Theme.backgroundColor}); 
              this.inner.setNativeProps({backgroundColor:Theme.backgroundColor});
            }}
            onPress={this.props.onPress}>
          <View style={{flexDirection:'row', backgroundColor:Theme.backgroundColor, alignItems:'center'}}
                ref={ref=>this.outer=ref} >
            <IconFont style={{padding: 12, paddingTop: 15}} icon='&#xe60e;' color='#bbb' size={18} />
            <Text style={{flex:1, fontSize:13, color:'#222'}}>{this.props.text}</Text>
            <TouchableHighlight onPress={this.props.onDeletePress}>
              <View ref={ref=>this.inner=ref}
                    style={{padding: 16, backgroundColor:Theme.backgroundColor}} >
                <IconFont icon='&#xe691;' color='#aaa' size={16} />
              </View>
            </TouchableHighlight>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flexDirection:'row'}}>
          <View style={{width: 42}} />
          <View style={{height:.5, backgroundColor:'#ddd', flex:1}} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.backgroundColor,
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
  chipOuter: {
    backgroundColor:'#ced0d0', 
    padding: 1, 
    height:30, 
    borderRadius:15,
    margin: 5,
  },
  chipInner: {
    height: 28, 
    borderRadius:14, 
    alignItems:'center', 
    justifyContent:'center',
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: Theme.backgroundColor,
  },
  chipText: {
    color: '#222',
  },
});