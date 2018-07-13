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
import Emotion from '../utils/Emotion';
import ImageCard from './ImageCard';
import API from '../utils/API_v1';
import { getGMTTimeDiff } from '../utils/Util';
import Storage from '../utils/Storage';
import UserAvatar from './UserAvatar';
import MyToast from './MyToast';
import ContextMenu from './ContextMenu';

export default class StatusReplyItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      reply: props.reply,
    };
  }

  render () {
    const item = this.state.reply;
    return (
      <TouchableHighlight underlayColor={Theme.activeUnderlayColor} onPress={this.handleLongPress} >
        <View style={{backgroundColor:'#ffffff', flexDirection:'row', paddingTop:2}}>
          <UserAvatar {...this.props} user={item.user} size={38} style={{margin:12}}/>
          <View style={{flex:1, borderBottomWidth:0.5, borderColor:'#ddd', paddingTop:12}}>
            <Text style={{color:'#444', fontWeight:'500', fontSize:14}}>{item.user.username}</Text>
            <View style={{paddingTop:8, paddingRight:12}}>
              {this._renderContent(item.text)}
            </View>
            {this._renderFooter()}
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  handleLongPress = (e) => {
    const reply = this.state.reply;
    const index = this.props.index;
    const option = (Storage.user && (reply.user.id == Storage.user.id) ? 
      {name: '删除评论', callback: () => {
          API.StatusReply.delete({'id': reply.id}, (responseJson)=>{
            MyToast.show('删除成功');
            this.props.handleDeleteItem();
          }, (error) => {
            MyToast.show('删除失败', {type:'warning'});
          });
        }
      }:
      {name: '举报评论', callback: () => MyToast.show('点击了举报')});
    let options = [
      {name: '回复评论', callback: () => MyToast.show('点击了回复')}, 
      {name: '复制评论', callback: () => MyToast.show('点击了复制')}, 
      option
    ];
    ContextMenu.showMenu(options, e);
  }

  _updateStatusReplyLike = () => {
    const reply = this.state.reply;
    reply.liked_by_me = !reply.liked_by_me;
    reply.likes += reply.liked_by_me?1:-1;
    this.setState({reply: reply});
  };

  onLikePress = () => {
    const reply = this.state.reply;
    if (!reply.liked_by_me) {
      this._updateStatusReplyLike();
      API.StatusReplyLike.create({id: reply.id}, (responseJson)=>{}, (error)=>{
        this._updateStatusReplyLike();
        MyToast.show('点赞失败', {type:'warning'});
      });
    }
    else {
      this._updateStatusReplyLike();
      API.StatusReplyLike.delete({id: reply.id}, (responseJson)=>{}, (error)=>{
        this._updateStatusReplyLike();
        MyToast.show('取消点赞失败', {type:'warning'});
      });
    }
  }

  _renderFooter() {
    const item = this.state.reply;
    return (
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <TouchableWithoutFeedback onPress={this.onLikePress}>
          <View style={{width:40, flexDirection: 'row', paddingTop:12, paddingBottom:12, paddingRight:12, justifyContent:'flex-start', alignItems:'center'}}>
            <Text style={{fontFamily:'iconfont', fontSize:19, color:item.liked_by_me?'#db5f5f':'#666'}}>{item.liked_by_me?'\ue600':'\ue601'}</Text>
            <Text style={{marginLeft:2, color:'#697480', fontSize:10}}>{item.likes==0?'赞':item.likes}</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex:1}}/>
        <Text style={{color:'#697480', fontSize:12, textAlign:'left', marginRight:12}}>{getGMTTimeDiff(item.timestamp)}</Text>
      </View>
    )
  }
  _renderContent(text) {
    var contentArray = this._textToContentArray(text);
    return (<Text style={{textAlignVertical: 'center', color: '#444', fontSize: 15, lineHeight:24}}>
      {contentArray.map((content, i) => {
        if (content.text) {
          return (
            <Text key={i}>{content.text}</Text>
          );
        }
        else if (content.at) {
          return (
            <Text key={i} style={{color:'#507daf', paddingBottom: 5}} onPress={()=>{this.props.navigation.navigate('UserPage')}}>@{content.at}</Text>
          );
        }
        else if (content.topic) {
          return (
            <Text key={i} style={{color:'#507daf', paddingBottom: 5}} >#{content.topic}#</Text>
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
    var regexp = new RegExp(`(\\[(${Emotion.regexp})\\]|#[\\s\\S]+?#|@[\\u4e00-\\u9fa5_a-zA-Z0-9\\-]+)`, 'g');
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
      if (text[pos]=='[') { // emotion
        contentArray.push({'emotion': text.substring(pos, t2)})
      }
      else if (text[pos]=='@') {
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
