'use strict';
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Theme from '../utils/Theme';
import ImageCard from './ImageCard';
import WechatArticleCard from './WechatArticleCard';
import API from '../utils/API_v1';
import { getGMTTimeDiff } from '../utils/Util';
import Storage from '../utils/Storage';
import { UserAvatar, GroupAvatar, IconFont } from './Utils';
import Styles from '../utils/Styles';
import MyToast from './MyToast';
import ContextMenu from './ContextMenu';

const article = {
  title: '假期第一周，我竟是这样度过的...',
  author: '微言航语',
  author_id: 'DJ00123987',
  desc: '清华大学习近平新时代中国特色社会主义思想研究院挂靠清华大学马克思主义学院，清华大学社会科学学院等院系参与共建，实行管委会领导下的院长负责制。',
  img_url: 'http://mmbiz.qpic.cn/mmbiz_jpg/k7r8yJjHsa6IBg9Pq0KskxJbdUmetSFTx6eLjoTQfdTWR0fHzr5QI0icZ3R9iaianyk6X4ECYBKkicaDqVawWHMMnw/0?wx_fmt=jpeg',
  url: 'http://mp.weixin.qq.com/s/H45EksG99p9sRIdhWfy0tg',
};

export default class StatusesItem extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      status: this.props.status,
    }
  }

  jumpToUserProfilePage = () => {
    this.props.navigation.navigate('User_ProfilePage', {user: this.state.status.user});
  };

  jumpToGroupPage = () => {
    this.props.navigation.navigate('Group_GroupPage', {group: this.state.status.group}); 
  };

  onProfilePress = () => {
    if (this.state.status.type == API.Status.GROUPSTATUS)
      this.jumpToGroupPage();
    else
      this.jumpToUserProfilePage();
  };

  handleLongPress = (e) => {
    const status = this.state.status;
    const option = (Storage.user && (status.user.id == Storage.user.id) ?
      [ '删除微博', () => {
          API.Status.delete({'id': status.id}, (responseJson)=>{
            MyToast.show('删除成功');
            this.props.handleDeleteItem();
          }, (error) => {
            MyToast.show('删除失败', {type:'warning'});
          });
      }] : 
      ['举报微博', () => MyToast.show('举报') ]
    );
    const options = [
      ['收藏微博', () => MyToast.show('收藏')],
      ['复制正文', () => MyToast.show('复制正文')],
      option,
    ];
    ContextMenu.showMenu(options, e);
  }


  renderUserInfo() {
    const item = this.state.status;
    const isGroupStatus = item.type === API.Status.GROUPSTATUS;
    const display_name = isGroupStatus ? item.group.groupname:item.user.username;
    let self_intro = '';
    if (!isGroupStatus && item.user.self_intro !== '') {
      self_intro = ', ' + item.user.self_intro;
    }
    if (self_intro !== '')
      self_intro = ', ' + self_intro;
    const timestamp = (
      <Text style={{color:'#888'}}>{getGMTTimeDiff(item.timestamp)}</Text>
    );
    const groupStatusSender = isGroupStatus ? (
      <Text style={{color: Theme.themeColor}} onPress={this.jumpToUserProfilePage}>  {item.user.username}</Text>
    ) : null;
    return (
      <View style={{flexDirection:'row', paddingLeft:12, paddingTop:12, alignItems:'center'}}>
        {
          isGroupStatus ? 
          <GroupAvatar group={item.group} size={40} /> :
          <UserAvatar user={item.user} size={40} />
        }
        <View style={{paddingLeft:12}}>
          <Text style={{fontSize:15, color:'#000'}}
                onPress={this.onProfilePress}>{display_name}<Text style={{color: '#bbb'}}>{self_intro}</Text></Text>
          
          <Text style={{fontSize:11}} >{ timestamp } { groupStatusSender }</Text>
        </View>
        { this.props.inDetailedPage ? null: 
          <TouchableWithoutFeedback onPress={this.handleLongPress} >
            <View style={{position:'absolute', right:0, padding:12, top:8}}>
              <Text style={{fontFamily:'iconfont', fontSize:16, color:'#666'}}>&#xe617;</Text>
            </View>
          </TouchableWithoutFeedback>
        }
      </View>
    )
  }

  render() {
    const item = this.state.status;
    return (
      <View {...this.props}>
        <TouchableHighlight 
          underlayColor={Theme.activeUnderlayColor}
          onPress={()=>this.props.navigation.navigate('Status_StatusPage', {status:item})}
        >
          <View style={{backgroundColor: '#fff'}}>
            {item.type === API.Status.GROUPPOST ? null: this.renderUserInfo()}
            <View style={{marginLeft:12, marginRight:14, paddingTop:8}}>
              {this._renderContent(item.text)}{this._renderCard(item)}
            </View>
            {item.type === API.Status.GROUPPOST ? <View style={{height:12}}/> : this.renderFooter()}
          </View>
        </TouchableHighlight>
      </View>
    )
  };

  _updateStatusLike = () => {
    const status = this.state.status;
    status.liked_by_me = !status.liked_by_me;
    status.likes += status.liked_by_me?1:-1;
    this.setState({status: status});
  };

  onLikePress = () => {
    const status = this.state.status;
    if (!status.liked_by_me) {
      this._updateStatusLike();
      API.StatusLike.create({id: status.id}, (responseJson)=>{}, (error)=>{
        this._updateStatusLike();
        MyToast.show('点赞失败', {type:'warning'});
      });
    }
    else {
      this._updateStatusLike();
      API.StatusLike.delete({id: status.id}, (responseJson)=>{}, (error)=>{
        this._updateStatusLike();
        MyToast.show('取消点赞失败', {type:'warning'});
      });
    }
  }


  renderFooter() {
    const item = this.state.status;
    return (
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Status_StatusPage', {status:item, focus:true})}>
          <View style={{width:60, flexDirection: 'row', padding: 16, justifyContent:'flex-start', alignItems:'center'}}>
            { /* <Text style={{fontFamily:'iconfont', fontSize:19, color:'#666'}}>&#xe62a;</Text> */}
            <IconFont icon='&#xe62a;' size={18} color='#666' />
            <Text style={{marginLeft:2, color:'#697480', fontSize:10, paddingTop:-2}}>{item.replies==0?'评论':item.replies}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.onLikePress}>
          <View style={{width:80, flexDirection: 'row', padding: 16, justifyContent:'flex-start', alignItems:'center'}}>
            { /* <Text style={{fontFamily:'iconfont', fontSize:19, color:item.liked_by_me?'#db5f5f':'#666'}}>{item.liked_by_me?'\ue600':'\ue601'}</Text> */}
            <IconFont icon={item.liked_by_me?'\ue672':'\ue671'} size={18} color={item.liked_by_me?'#f56262':'#666'} />
            <Text style={{marginLeft:2, color:'#697480', fontSize:10}}>{item.likes==0?'赞':item.likes}</Text>
          </View>
        </TouchableWithoutFeedback>
        
      </View>
    )
  }

  _renderCard(item) {
    if (item.pics.length != 0)
      return (<ImageCard {...this.props} style={{marginTop: 12}} images={item.pics}/>);
    return null;
    //return (<WechatArticleCard {...this.props} style={{marginTop: 12}} article={article} />)
  }

  _renderContent(text) {
    var contentArray = this._textToContentArray(text);
    return (<Text style={{textAlignVertical: 'center', color: '#555', fontSize: 15, lineHeight:26}}>
      {contentArray.map((content, i) => {
        if (content.text) {
          return (
            <Text key={i}>{content.text}</Text>
          );
        }
        else if (content.at) {
          return (
            <Text key={i} style={{color:'#507daf', paddingBottom: 5}} onPress={()=>{this.props.navigation.navigate('MediumTransPage', {username:content.at})}}>@{content.at}</Text>
          );
        }
        else if (content.topic) {
          return (
            <Text key={i} style={{color:'#507daf', paddingBottom: 5}} onPress={()=>{this.props.navigation.navigate('Status_TopicPage', {topic:content.topic})}}>#{content.topic}#</Text>
          );
        }
        else if (content.emotion) {
          return (
            <Image key={i} source={Emotion.getSource(content.emotion)} style={{width:32, height:32}}/>
          );
        }
    })}
      </Text>);
  }
  
  _textToContentArray(text) {
    var regexp = new RegExp(`(#[\\s\\S]+?#|@[\\u4e00-\\u9fa5_a-zA-Z0-9\\-]+)`, 'g');
    var contentArray = [];
    var regArray = text.match(regexp);
    if (!regArray)
      regArray = [];
    var pos = 0;
    for (let i = 0; i < regArray.length; i++) {
      var t = text.indexOf(regArray[i], pos);
      if (t != pos) {
        contentArray.push({'text': text.substring(pos, t)});
        pos = t;
      }
      var t2 = pos + regArray[i].length;
      if (text[pos]=='@') {
        contentArray.push({'at': text.substring(pos+1, t2)})
      } 
      else if (text[pos]=='#') { // topic
        contentArray.push({'topic': text.substring(pos+1, t2-1)});
      }
      else {
        console.log('impossible', regArray[i]);
      }
      pos = t2;
    }
    if (pos != text.length) {
      contentArray.push({'text': text.substring(pos, text.length)});
    }
    return contentArray;
  }
}

