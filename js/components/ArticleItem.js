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
        <OfficialAccountAvatar account={item.official_account} size={40} />
        <View style={{paddingLeft:12}}>
          <Text style={{fontSize:15, color:'#000'}}
                onPress={this.onProfilePress}>{display_name}<Text style={{color: '#bbb'}}>{self_intro}</Text></Text>
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
          onPress={()=>this.props.navigation.navigate('Status_StatusPage', {status:item})}
        >
          <View style={{backgroundColor: '#fff'}}>
            { this.renderHeader() }
            <View style={{marginLeft:12, marginRight:14, paddingTop:8}}>
              {this.renderContentByType()}
            </View>
            {item.type === API.Status.GROUPPOST ? <View style={{height:12}}/> : this.renderFooter()}
          </View>
        </TouchableHighlight>
      </View>
    )
  };

  renderContentByType() {
    const article = this.state.article;
    if (article.type == 'WEIXIN')
      return null;
    else if (article.type == 'WEIBO')
      return this.renderWeiboContent();
    return null;
  }

  renderWeiboContent() {
    const weibo = JSON.parse(this.state.article.extra_data);
    return (
      <View style={{flexDirection: 'column'}}>
        <Text style={{textAlignVertical: 'center', color: '#555', fontSize: 15, lineHeight:26}}>
          { weibo.text }
        </Text>
        {  
          weibo.pics ? this.renderWeiboPics(weibo) :
          weibo.page_info ? this.renderWeiboPageInfo(weibo) : null
        }
      </View>
    )
  }

  renderWeiboPics(weibo) {
    const images = weibo.pics.map(pic => pic.url);
    return <ImageCard {...this.props} style={{marginTop: 12}} images={images}/>
  }

  renderWeiboPageInfo(weibo) {
    const page_info = weibo.page_info;
    if (page_info.type == 'search_topic') {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8',
                      borderWidth: 1, borderColor:'#f0f0f0', marginTop: 12, paddingTop: 0.5, boarderRadius: 3}}>
          <Image style={{width: 60, height: 60, marginRight: 12}} source={{ uri: page_info.page_pic.url }}/>
          <Text style={{color: '#333', fontSize: 16}}>{page_info.page_title}</Text>
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

  _renderCard(item) {
    if (item.pics.length != 0)
      return (<ImageCard {...this.props} style={{marginTop: 12}} images={item.pics}/>);
    return null;
    //return (<WechatArticleCard {...this.props} style={{marginTop: 12}} article={article} />)
  }

}

