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
import { UserAvatar, GroupAvatar, OfficialAccountAvatar, IconFont } from './Utils';
import MyToast from './MyToast';
import ContextMenu from './ContextMenu';
import Styles from '../utils/Styles';



export default class StatusesItem extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      article: this.props.article,
    }
  }

  handleLongPress = (e) => {
    const options = [
      ['收藏微博', () => MyToast.show('收藏')],
      ['复制正文', () => MyToast.show('复制正文')],
    ];
    ContextMenu.showMenu(options, e);
  }

  onHeaderPress() {
    const article = this.state.article;
    let injectedJavaScript = null;
    if (article.type == 'WEIXIN') {
      injectedJavaScript = `window.location.replace(document.getElementsByClassName('wx-news-list2')[0].getElementsByTagName('a')[0].href)`;
    }
    this.props.navigation.navigate('Common_WebviewPage', {
      url: article.official_account.page_url,
      injectedJavaScript: injectedJavaScript,
    });
  }

  renderHeader() {
    const item = this.state.article;
    const timestamp = (
      <Text style={{color:'#888'}}>{getGMTTimeDiff(item.timestamp)}</Text>
    );
    const display_name = item.official_account.accountname;
    const self_intro = null; 
    const source = null;
    return (
      <View style={{flexDirection:'row', paddingLeft:12, paddingTop:12, alignItems:'center'}}>
        <OfficialAccountAvatar account={item.official_account} size={40} onPress={this.onHeaderPress.bind(this)}/>
        <View style={{paddingLeft:12}}>
          <Text style={{fontSize:15, color:'#000'}}
                onPress={this.onHeaderPress.bind(this)}>
              {display_name}
              <Text style={{color: '#bbb'}}>{self_intro}</Text>
          </Text>
          <Text style={{fontSize:11}} >{ timestamp } { source }</Text>
        </View>
        { this.props.hideMenuButtom ? null: 
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
    const item = this.state.article;
    return (
      <View {...this.props}>
        <TouchableHighlight 
          underlayColor={Theme.activeUnderlayColor}
          onPress={()=>this.props.navigation.navigate("Common_WebviewPage", {url: item.extra_url})}
        >
          <View style={{backgroundColor: '#fff'}}>
            { this.renderHeader() }
            <View style={{marginLeft:12, marginRight:14, paddingTop:8}}>
            { this.renderContentByType() }
            </View>
            {item.type === API.Status.GROUPPOST ? <View style={{height:12}}/> : this.renderFooter()}
          </View>
        </TouchableHighlight>
      </View>
    )
  };

  renderContentByType = ()=>{
    const article = this.state.article;
    if (article.type == 'WEIXIN')
      return this.renderWeixinContent();
    else if (article.type == 'WEIBO')
      return this.renderWeiboContent();
    return null;
  }

  
  renderWeixinContent = ()=>{
    const article = JSON.parse(this.state.article.extra_data);
    return (
      <View style={{borderRadius: 5}}>
        <Image style={{flex:1, aspectRatio:1.8, borderRadius: 5}} source={{uri: article.linkInfo.pictureUrl}} />
        <View style={[{top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', 
                       backgroundColor: 'rgba(0,0,0,.2)', borderRadius: 5}, Styles.absoluteFill]} >
          <Text style={{color: 'rgba(255,255,255,.5)', fontSize: 12, padding: 8, alignSelf: 'flex-end'}}>微信公众号</Text>
          <View style={{flex: 1}} />
          <Text style={{color: '#fff', fontSize: 17, padding: 16, paddingBottom: 8}}>{ article.linkInfo.title }</Text>
          <Text></Text>
        </View>
      </View>
    )
  }

  renderWeiboContent = ()=>{
    const weibo = JSON.parse(this.state.article.extra_data);
    return (
      <View style={{flexDirection: 'column'}}>
        { this.renderWeiboText(weibo.text) }
        {  
          weibo.pics ? this.renderWeiboPics(weibo) :
          weibo.page_info ? this.renderWeiboPageInfo(weibo) : null
        }
      </View>
    )
  }

  renderWeiboText = (text)=>{
    var contentArray = this.textToContentArray(text);
    return (<Text style={{textAlignVertical: 'center', color: '#555', fontSize: 15, lineHeight:26}}>
      {contentArray.map((content, i) => {
        if (content.text) {
          return (
            <Text key={i} >{content.text}</Text>
          );
        }
        else if (content.url) {
          return (
            <Text key={i} style={{color:'#507daf', paddingBottom: 5}} 
                  onPress={()=>{this.props.navigation.navigate('Common_WebviewPage', {url:content.url})}}>
              {content.content}
            </Text>
          );
        }
        else if (content.url_icon) {
          return (
            <Image key={i} style={{width:34, height:34,}} source={{uri: content.url_icon}} />
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

  textToContentArray = (text)=>{
    text = text.replace(/<br \/>/g, "\n");
    const regexp = /<a[^>]*>(?:.*?)<\/a>|<span class="url-icon">(?:.*?)<\/span>/g;
    const contentArray = [];
    let regArray = text.match(regexp);
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
      if (text[pos+1] == 'a') {
        const match = regArray[i].match(/href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/);
        let url = match[2];
        if (url[0] == '/') {
          url = 'https://m.weibo.cn' + url;
        }
        contentArray.push({'url': url, 'content': match[3].replace(/<[^>]*>/g, '')})
      } else if (text[pos+1] == 's') {
        const match = regArray[i].match(/src=(["'])(.*?)\1/);
        contentArray.push({'url_icon': 'https:' + match[2]});
      }
      pos = t2;
    }
    if (pos != text.length) {
      contentArray.push({'text': text.substring(pos, text.length)});
    }

    return contentArray;
  }

  renderWeiboPics = (weibo)=>{
    const images = weibo.pics.map(pic => pic.url);
    return <ImageCard {...this.props} style={{marginTop: 12}} images={images}/>
  }

  renderWeiboPageInfo = (weibo)=>{
    const page_info = weibo.page_info;
    if (page_info.type == 'search_topic') {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8',
                      borderWidth: 1, borderColor:'#f0f0f0', marginTop: 12, paddingTop: 0.5, borderRadius: 3}}>
          <Image style={{width: 60, height: 60, marginRight: 12}} source={{ uri: page_info.page_pic.url }}/>
          <Text style={{color: '#333', fontSize: 16}}>{page_info.page_title}</Text>
        </View>
      )
    }
    else if (page_info.type == 'video') {
      return (
        <View style={{flexDirection: 'row'}}>
          <Image style={{ flex: 1, aspectRatio: 1.8}} source={{ uri: page_info.page_pic.url }}/>
          <View style={{position:'absolute', top:0, left:0, right:0, bottom:0,
                        backgroundColor:'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent:'center'}} >
            <Text style={{color:'#ccc', fontSize:16}}>微博视频</Text>
          </View>
        </View>
      )
    }
  }

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
    const item = this.state.article;
    item.replies = 2;
    item.likes = 8;
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


}

