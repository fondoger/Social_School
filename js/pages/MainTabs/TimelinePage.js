'use strict';
import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  PanResponder,
} from 'react-native';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { 
  MyToast, 
  Loading, 
  SaleItem, 
  ArticleItem,
  StatusesItem, 
  GroupPostItem, 
} from '../../components';
import SplashScreen from 'react-native-splash-screen'

const pageTheme = {
  borderColor: '#d8d8d8',
}

export default class TimelinePage extends React.Component {
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
    };
  }

  componentDidMount() {
    API.registerLoginRequired(()=>{
      this.props.navigation.navigate('Common_LoginPage');
    });
    Storage.init().then(() => {
      this.refreshTimeline();
    });
    setTimeout(()=>{
      this.checkUpdate();
    }, 5000);
  }

  checkUpdate = () => {
    API.Other.update((responseJson)=>{
      console.log(responseJson);
    }, ()=>{});
  };

  refreshTimeline = () => {
    API.Timeline.get({limit:10}, (responseJson)=>{7
      this.setState({
        refreshing: false, 
        statuses: responseJson, 
        load_more_ing: false,
        load_more_error: false,
        has_next: responseJson.length != 0,
      });
      MyToast.show('刷新成功');
    }, (error)=>{
      this.setState({refreshing: false, load_more_ing:false, load_more_error: true});
      MyToast.show('刷新失败', {type:'warning'});
    });
  };

  handleRefresh = () => {
    this.setState({refreshing: true,});
    this.refreshTimeline();
  };

  handleLoadMore = () => {
    if (this.state.load_more_ing)
      return
    this.setState({load_more_ing: true, load_more_err: false});
    API.Timeline.get({
          limit:10,
          offset:this.state.statuses.length,
    }, (responseJson)=>{
      const _statuses = [...this.state.statuses, ...responseJson]
      this.setState({
        load_more_ing: false,
        statuses: _statuses,
        has_next: responseJson.length != 0,
      });
    }, (error)=>{
      this.setState({load_more_ing: false, load_more_err: true});
    });
  }

  renderFooter() {
    const error = this.state.load_more_err || !this.state.has_next;
    const error_msg = this.state.load_more_err ? '加载失败, 点击重试': '没有更多内容, 多关注一些人吧';
    return (
      <Loading style={{height:120}} error={error} error_msg={error_msg} onRetry={this.handleLoadMore}/>
    )
  }

  render() {
    return (
      <View style={styles.container} >
        <FlatList
          data={this.state.statuses}
          keyExtractor={((item, index) => `${item.id}`)}
          renderItem={this.renderByType.bind(this)}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          ListHeaderComponent={this.renderTopNotice.bind(this)}
          ListFooterComponent={this.renderFooter.bind(this)}
          ItemSeparatorComponent={()=><View style={{height:8}}></View>}
          onEndReachedThreshold={0.1}
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
      return <GroupPostItem 
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

  renderTopNotice() {
    return (
      <View style={{backgroundColor: '#f8f8f8', padding: 8, marginBottom:4, marginTop:4, flexDirection: 'row',
                    borderBottomColor: pageTheme.borderColor, borderBottomWidth: 0.5,
                    borderTopColor: '#f4f4f4', borderTopWidth: 0.5, }}>
        <Text style={{color: '#f92772'}}>置顶(4): </Text>
        <Text style={{color: '#444'}}>[活动]庆祝北京航空航天大学成立66周年！</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
});

