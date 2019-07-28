'use strict';
import React from 'react';
import {
  StyleSheet, 
  Text,
  View,
  Button,
  FlatList,
  Image,
  ScrollView,
  SectionList,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { Loading, MyToast, IconFont, DividingLine, GroupAvatar, UserAvatar, GroupPostItem } from '../../components';
import Styles from '../../utils/Styles';
import FastImage from 'react-native-fast-image';
import { getGMTTimeDiff } from '../../utils/Util';
import { withNavigation } from 'react-navigation';

const SearchHeader = (props) => (
  <View style={{backgroundColor: Theme.themeColor, justifyContent: 'center', 
                height: Theme.headerHeight + Theme.statusBarHeight,
                paddingTop: Theme.statusBarHeight}}>
        <TouchableWithoutFeedback onPress={()=>{props.navigation.navigate('Common_SearchPage')}}>
          <View style={{flexDirection:'row', marginHorizontal: 14, backgroundColor:'rgba(255,255,255,1)', 
                borderRadius: 20, height: 32, alignItems: 'center', paddingLeft: 12}}>
            <IconFont color='#888' size={20} icon='&#xe623;' />
            <Text style={{color: '#aaa', fontSize:15, flex: 1, 
                          marginHorizontal: 8, lineHeight: 21}}
                  numberOfLines={1}>这或许是一个有趣的搜索框</Text>
            <TouchableWithoutFeedback onPress={()=>MyToast.show("修理ing...")}>
              <View style={{padding: 8, paddingRight: 12}}>
                <IconFont color='#888' size={21} icon='&#xe60f;' />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
  </View>
);


export default class SquareScreen extends React.Component {

  static navigationOptions = {
    title: '广场'
  }

  constructor(props) {
    super(props);
    this.state = {
      //hotActivities: null,
      hotGroups: [],
      hotPublicGroups: [],
      posts: [],
      refreshing: false,
      load_more_ing: false,
      load_more_err: false,
      has_next: true,
    }
  }

  makeRemoteRequest() {
    API.Group.get({type:'hot'}, (responseJson)=>{
      this.setState({hotGroups: responseJson});
    }, (error)=>{});
    API.Group.get({type:'public'}, (responseJson)=>{
      this.setState({hotPublicGroups: responseJson});
    }, (error)=>{});
    this.refreshPosts();
  }

  componentDidMount() {
    // API.Activity.get({type:'hot'}, (responseJson)=>{d
    //   this.setState({hotActivities: responseJson});
    // }, (error)=>{});
    // setTimeout(()=>{
    //   this.setState({show:true})
    // }, 1);
    this.makeRemoteRequest();
  }

  refreshPosts = () => {
    API.Status.get({type:'post'}, (responseJson)=>{7
      this.setState({
        refreshing: false, 
        posts: responseJson, 
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
    this.makeRemoteRequest();
  };
  handleLoadMore = () => {
    if (this.state.load_more_ing || !this.state.has_next)
      return
    this.setState({load_more_ing: true, load_more_err: false});
    API.Status.get({
        type: 'post',
        limit: 10,
        offset: this.state.posts.length,
    }, (responseJson)=>{
      const _posts = [...this.state.posts, ...responseJson]
      this.setState({
        load_more_ing: false,
        posts: _posts,
        has_next: responseJson.length != 0,
      });
    }, (error)=>{
      this.setState({load_more_ing: false, load_more_err: true});
    });
  }

  renderPostItem({ index, item, section }) {
    const onPress = ()=>this.props.navigation.navigate('Status_StatusPage', {status:item});
    const textColor = item.replies == 0 ? '#f56262' : '#aaa';
    const iconColor = item.replies == 0 ? "#DEDEDE" :
                  item.replies <= 5 ? "#FAD389" :
                  item.replies <= 10 ? "#F7B26D" : "#F58A5F";
    return (
      <TouchableHighlight onPress={onPress} underlayColor={Theme.activeUnderlayColor}>
        <View style={{flexDirection: 'row', borderBottomWidth: 0.5, borderColor: '#ddd', 
                      backgroundColor: '#fff', paddingVertical: 12, paddingRight: 12}}>
          <View style={{width: 48, alignItems: 'center'}}>
            <IconFont icon='&#xe605;' size={16} color={iconColor} />
            <Text style={{fontSize: 12, color: textColor, margin: 4}}>
              { item.replies == 0 ? 'new': item.replies }
            </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={{color: '#444', fontSize: 15, marginBottom: 8, numberOfLines: 2, lineHeight: 22}}>{item.title}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <GroupAvatar size={16} group={item.group} borderRadius={2}/>
                <Text style={{fontSize: 12, color: '#777', marginLeft: 4, marginRight: 16}}>{item.group.groupname}</Text>
                <Text style={{fontSize: 11, color:'#bbb'}}>{getGMTTimeDiff(item.timestamp)}</Text>
              </View>
            </View>
            {item.pics.length > 0 ? 
                <Image style={{height: 48, width: 48, borderRadius: 4, marginTop: 2, marginLeft: 8, borderWidth: .5, borderColor: "rgba(200,200,200,.5)"}} source={{uri:item.pics[0]}} />: 
                null
            }
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  reloadPosts = () => {
    this.state.has_next = true;
    this.state.load_more_ing = false;
    this.setState({posts: [], has_next: true});
    this.state.posts = [];
    this.handleLoadMore();
  }

  renderListHeader = () => {
    return (
      <View style={{borderBottomWidth: .5, 
            flexDirection: 'row',
            borderColor: '#ddd', backgroundColor: '#f7f7f7',}}>
        <Text style={{color: '#444', flex: 1, padding: 10, paddingLeft: 16, fontSize: 14}}>正在讨论</Text>
        <TouchableHighlight underlayColor="#bbb" onPress={this.reloadPosts}>
          <View style={{padding: 10, paddingHorizontal: 12, backgroundColor: '#f7f7f7', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontFamily: 'iconfont', color: '#aaa', fontSize: 16}}>&#xe781;</Text>
            <Text style={{color: '#aaa', fontSize: 14}}> 刷新</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  renderMainContent() {
    return (
      <SectionList
        sections={[{key:"0", data:this.state.posts, title:"正在讨论",}]}
        renderSectionHeader={this.renderListHeader}
        keyExtractor={((item, index) => `${item.id}`)}
        //renderItem={this.renderPostItem.bind(this)}
        renderItem={({index, item, section})=><GroupPostItem status={item} groupMode/>}
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleLoadMore}
        ListHeaderComponent={this.renderGroups.bind(this)}
        ListFooterComponent={this.renderFooter.bind(this)}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}
      />
    );
  }

  render() {

    return (
      <View style={{flex: 1, backgroundColor: '#f7f7f7'}} >
        <SearchHeader {...this.props}/>
        { this.renderMainContent() } 
      </View>
    )
  }

  renderFooter() {
    const error = this.state.load_more_err || !this.state.has_next;
    const error_msg = this.state.load_more_err ? '加载失败, 点击重试': '没有更多内容, 多关注一些人吧';
    return (
      <Loading style={{height:120}} error={error} error_msg={error_msg} onRetry={this.handleLoadMore}/>
    )
  }

  renderGroups() {
    const { hotGroups, hotPublicGroups } = this.state;
    return (
      <View style={{width: '100%', height: 185, paddingTop: 8}}>
        <ScrollView
          style={{paddingHorizontal: 0, margin: 0, padding: 0, height: 0}}
          showsHorizontalScrollIndicator={false}
          horizontal={true}>
          <View style={{width: 8}} hint="padding"/>
          {
              hotPublicGroups.length == 0 || hotGroups.length == 0 ? <GroupCardSkeleton /> :
              <GroupCard image={require('../../../img/balloon.jpg')} title="热门小组" >
                <GroupItem group={hotPublicGroups[0]} />
                <DividingLine paddingLeft={36} color="#ddd" />
                <GroupItem group={hotPublicGroups[1]} />
                <DividingLine paddingLeft={36} color="#ddd" />
                <GroupItem group={hotPublicGroups[2]} />
              </GroupCard>
          }
          {
              hotPublicGroups.length == 0 || hotGroups.length == 0 ? <GroupCardSkeleton /> :
              <GroupCard image={require('../../../img/tree.jpg')} title="活跃小组" >
                <GroupItem group={hotGroups[0]} />
                <DividingLine paddingLeft={36} color="#ddd" />
                <GroupItem group={hotGroups[1]} />
                <DividingLine paddingLeft={36} color="#ddd" />
                <GroupItem group={hotGroups[2]} />
              </GroupCard>  
          }
          <GroupCard image={require('../../../img/moon.jpg')} title="更多小组" >
            <Text>点此发现更多小组</Text>
          </GroupCard>
          <View style={{width: 10}} hint="padding"/>
        </ScrollView>
      </View>
    )
  }

  renderLoading() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff',
          justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <ActivityIndicator size='small' color='#ccc' />
          <Text style={{color:'#aaa', fontSize:15, marginLeft: 5}}>Loading...</Text>
        </View>
      </View>
    );
  }
}

const GroupCardSkeleton = ({ skeletonColor="#eee", }) => (
  <View style={{borderRadius: 8, width: 240, height: 165, backgroundColor: '#fff', 
                margin: 6, paddingBottom: 8, elevation: 3, paddingHorizontal: 10}}>
    <View style={{margin: 9, marginVertical: 12, height: 20, width: 120, backgroundColor: skeletonColor}} />
    <View style={{}}>
      <View style={{backgroundColor: skeletonColor, margin: 9, width: 200, height: 20}} />
      <View style={{backgroundColor: skeletonColor, margin: 9, width: 200, height: 20}} />
      <View style={{backgroundColor: skeletonColor, margin: 9, width: 200, height: 20}} />
    </View>
  </View>
);

const GroupCard = ({ image, title, children }) => (
  <View style={{borderRadius: 8, width: 240, height: 165, backgroundColor: '#fff', 
                margin: 6, paddingBottom: 8, elevation: 3,}}>
    <FastImage style={{borderRadius: 8, width:240, height: 45, marginBottom: -10}} 
            resizeMode="cover" source={image} />
    <View style={{flex: 1, height: 10, backgroundColor: '#fff'}} />
    <View style={{position: 'absolute', left: 10, right: 10, top: 10, bottom: 10 }}>
      <Text style={{color: '#fff', fontSize: 13}}>{title}</Text>
      <View style={{paddingVertical: 13, paddingHorizontal: 0}}>
        { children }
      </View>
    </View>
  </View>
);

const GroupItem_ = ({ group, ...props }) => (
  <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Group_GroupPage', { group })} >
    <View key={group.id.toString()} style={{flexDirection:'row', alignItems: 'center', marginVertical: 5}}>
      <GroupAvatar size={28} group={group} borderRadius={2} style={{marginRight: 8}}/>
      <Text style={{color: '#444', fontSize: 13, flex: 1}}>{group.groupname}</Text>
      <Text style={{color: '#aaa', fontSize: 11}}>帖子数: {group.daily_statuses}</Text>
    </View>
  </TouchableWithoutFeedback>
);
const GroupItem = withNavigation(GroupItem_);