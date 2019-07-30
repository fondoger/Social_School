'use strict';
import React from 'react';
import { 
  Text, 
  View,
  Image, 
  Button, 
  FlatList,
  TextInput, 
  ScrollView,
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  TouchableHighlight, 
  KeyboardAvoidingView, 
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { GroupPostItem2, Loading, MyToast, StatusesItem, ArticleItem } from '../../components';

export default class TrendingPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  })

  constructor(props) {
    super(props);
    this.state = {
      statuses: [],
      refreshing: false,
      load_more_ing: false,
      load_more_err: false,
      has_next: true,
      pageInitialized: false,
    };
  }

  componentDidMount() {
    //this.handleLoadMore();
    //this.props.navigation
    this.props.setTabFocusListner(1, ()=>{
      if (!this.state.pageInitialized && Storage.user) {
        //this.setState({pageInitialized: true});
        this.handleLoadMore();
      };
    })
  }

  refreshStatuses = () => {
    API.PublicTimeline.get({limit:10}, (responseJson)=>{
      this.setState({refreshing: false, statuses: responseJson, load_more_ing:false});
      MyToast.show('刷新成功');
    }, (error)=>{
      this.setState({refreshing: false, load_more_ing:false});
      MyToast.show('刷新失败', {type:'warning'});
    })
  };

  handleRefresh = () => {
    this.setState({refreshing: true,});
    this.refreshStatuses();
  };

  handleLoadMore = () => {
    if (this.state.load_more_ing)
      return
    this.setState({load_more_ing: true, load_more_err: false});
    API.PublicTimeline.get({
          limit:10,
          offset:this.state.statuses.length
    }, (responseJson)=>{
      const _statuses = [...this.state.statuses, ...responseJson]
      this.setState({load_more_ing: false, statuses: _statuses, has_next: responseJson.length!=0});
    }, (error)=>{
      MyToast.show(error.message)
      this.setState({load_more_ing: false, load_more_err: true});
    });
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:'#eee'}}>
        <FlatList
          data={this.state.statuses}
          keyExtractor={((item, index) => `${item.type}+${item.id}+${item.likes}+${item.replies}`)}
          renderItem={this.renderByType.bind(this)}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          ListHeaderComponent={()=><View style={{height:8}}></View>}
          ListFooterComponent={this.renderFooter.bind(this)}
          ItemSeparatorComponent={()=><View style={{height:8}}></View>}
        />
      </View>
    );
  }

  deleteItem = (index) => {
    const statuses = this.state.statuses;
    statuses.splice(index, 1);
    this.setState({statuses: statuses});
  }


  renderByType(_item) {
    const { index, item } = _item;
    if (item.price)
      return <SaleItem {...this.props} sale={item} />
    if (item.type == API.Status.GROUPPOST)
      return <GroupPostItem2
                {...this.props}
                showSource={true}
                status={item} />
    if (item.type == API.Status.USERSTATUS || item.type == API.Status.GROUPSTATUS)
      return <StatusesItem
                {...this.props} 
                status={item}
                handleDeleteItem={()=>{this.deleteItem(index)}} />
    if (item.type == API.Article.WEIXIN || 
        item.type == API.Article.WEIBO || 
        item.type == API.Article.BUAANEWS ||
        item.type == API.Article.BUAAART) {
      return <ArticleItem 
                {...this.props}
                article={item} />
    }
    return null;
  }

  renderFooter() {
    const error = this.state.load_more_err || !this.state.has_next;
    const error_msg = this.state.load_more_err ? '加载失败, 点击重试': '没有更多内容';
    return (
      <Loading style={{height:60}} error={error} error_msg={error_msg} onRetry={this.handleLoadMore}/>
    )
  }

  componentDidCatch() {
    MyToast.show("Caught a error in TrendingPage");
  }

}