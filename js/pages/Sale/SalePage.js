'use strict';
import React from 'react';
import { 
  View,
  Text, 
  Image, 
  FlatList,  
  Platform,
  TextInput,
  StatusBar,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers, } from 'react-native-popup-menu';
import { getPassedTime, getSaleTime } from '../../utils/Util';
import Storage from '../../utils/Storage';
import { MyToast } from '../../components';

const _window = require('Dimensions').get('window');
const ScreenWidth = _window.width;
const ScreenHeight = _window.height;
const StatusBarHeight = (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight);
const headerHeight = Theme.headerHeight + StatusBarHeight;

class MyResponsiveImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 1,
    };
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
      <View style={{marginTop:8, flexDirection:'row', aspectRatio:this.state.aspectRatio}}>
        <Image source={this.props.source} style={{flex:1, aspectRatio:this.state.ratio}} onLoad={()=>{
          Image.getSize(this.props.source.uri, (width, height) => {
            this.setState({ratio:width/height});
          });
        }} />
      </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default class SalePage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      sale: props.navigation.state.params.sale,
      comments: props.navigation.state.params.sale.comments,
      comment_ing: false,
      showCommentBar: false,
      textValue: '',
      simpleHeader: true,
    }
  }

  componentDidMount() {
    API.Sale.get({id:this.state.sale.id}, (responseJson) => {
      this.setState({sale:responseJson});
    }, (err) => {});
  }

  render() {
    const { sale, simpleHeader, comments }= this.state;
    return (
      <View style={{flex:1,}}>
        <View style={{backgroundColor:simpleHeader?'#fff':'#fafbfd', paddingTop:StatusBarHeight, flexDirection:'row',
              borderColor:'#ddd', borderBottomWidth:simpleHeader?0:0.5, height:headerHeight, alignItems:'center'}} >
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
              <View style={{width:64, alignItems:'center'}}>
                <Text style={{fontFamily:'iconfont', fontSize:20, color:'#888',}}>&#xe60a;</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{flex:1, alignItems:'center'}}>
              {simpleHeader?null:
              <Text style={{fontSize:16, color:'#f44'}}><Text style={{fontSize:14}}>￥</Text>{sale.price}</Text>
              }
            </View>
            <View style={{width:60}} />
        </View>
        <ScrollView 
          style={{flex:1, backgroundColor:'#eee'}} 
          showsVerticalScrollIndicator={false}
          onScroll={e=>this.setState({simpleHeader:e.nativeEvent.contentOffset.y<60})}
        >
            <View style={{backgroundColor:'#fff', padding:12}}>
              <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Sale_PersonalPage', {user:sale.user})} >
              <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:0.5, borderColor:'#eee', paddingBottom:16,}}>
                <View style={{marginRight:12, width:40, height:40,}} >
                  <Image style={{flex:1, borderRadius:24}} source={{uri:sale.user.avatar+'!thumbnail'}} />
                </View>
                <View>
                  <Text style={{color:'#444', fontWeight:'bold', fontSize:15}}>{sale.user.username}</Text>
                  <Text style={{color:'#888', fontSize:12}}>{getSaleTime(sale.updated_at)}</Text>
                </View>
              </View>
              </TouchableWithoutFeedback>
              <Text style={{fontSize:20, color:'#f44', fontWeight:'bold', paddingTop:18, paddingBottom:16}}><Text style={{fontSize:16}}>￥</Text>{sale.price}</Text>
              <View><Text style={{fontSize:16, color:'#222'}}><Text>{sale.title} </Text>{sale.text}</Text></View>
              {this.renderBigPictures()}
            </View>
            <View style={{backgroundColor:'#fff', marginTop:16}}>
              <Text style={{fontSize:16, color:'#000', fontWeight:'bold', padding:12, 
                    borderBottomWidth:0.5, borderColor:'#ddd'}}>留言{this.state.comments.length!=0?` · ${this.state.comments.length}`:''}</Text>
              {
                comments.length != 0 ? comments.map(this.renderCommentItem) :
                <View style={{alignItems:'center', padding:20, flex:1}}>
                  <Image style={{height:72, width:72}} source={require('../../../img/buaa_logo_tear_in_eyes.png')} />
                  <Text style={{fontSize:15, marginTop:8}}>还没有人留言, 还不快来抢沙发</Text>
                </View>
              }
            </View>
            <View style={{flexDirection:'row',
                  height:40, alignItems:'center', padding:12}}>
                  <View style={{height:0.5, flex:1, backgroundColor:'#ddd'}}></View>
                  <Text style={{margin:8, color:'#888'}}>没有更多内容</Text>
                  <View style={{height:0.5, flex:1, backgroundColor:'#ddd'}}></View>
            </View>
        </ScrollView>
        { this.renderBottomBar() }
      </View>
    )
  }

  renderCommentItem = (comment, index) => {
    return (
      <View key={index.toString()} style={{flexDirection:'row', paddingTop:8, paddingBottom:12, borderBottomWidth:0.5, borderColor:'#eee'}}>
        <View style={{height:40, width:40, margin:12}}>
          <Image style={{height:40, width:40, borderRadius:20}}
                 source={{uri:comment.user.avatar+'!thumbnail'}}/>
        </View>
        <View>
          <Text style={{color:'#444', fontSize:14, fontWeight:'bold'}}>{comment.user.username}</Text>
          <Text style={{paddingTop:4, fontSize:15, paddingBottom:4, color:'#222'}}>{comment.text}</Text>
          <Text>{getPassedTime(comment.timestamp)}</Text>
        </View>
      </View>
    )
  }

  onImagePress = (index) => {
    const images = this.state.sale.pics;
    this.props.navigation.navigate('Common_ImageViewerPage', {initialImage: index, images: images.map((url)=>{return {source: {uri: url+'!mini5'}}})});
  }

  renderBigPictures = () => {
    return (
      <View>
      { 
        this.state.sale.pics.map((url, index) => (
            <MyResponsiveImage key={index.toString()} source={{uri:url+'!large'}} onPress={()=>this.onImagePress(index)}/>
        )) 
      }
      </View>
    )
  };

  renderBottomBar = () => {
    return (
      <View style={{ backgroundColor:'#fff',
            height:54, borderTopWidth:0.5, borderColor:'#e8e8e8'}} >
        {this.state.showCommentBar ? this.renderCommentBar() : this.renderActionBar() }
      </View>
    )
  };

  _revertSaleLike = () => {
    const sale = this.state.sale;
    sale.liked_by_me = !sale.liked_by_me;
    sale.likes += sale.liked_by_me?1:-1;
    this.setState({sale: sale});
  }

  onLikePress = () => {
    if (!this.state.sale.liked_by_me) {
      this._revertSaleLike();
      API.SaleLike.create({sale_id: this.state.sale.id}, (responseJson) => {}, (error) => {
        this._revertSaleLike();
        MyToast.show('点赞失败', {type:'warning'});
      });      
    } else {
      this._revertSaleLike();
      API.SaleLike.delete({sale_id: this.state.sale.id}, (responseJson) => {}, (error) => {
        this._revertSaleLike();
        MyToast.show('取消点赞失败', {type:'warning'});
      });
    }
  }

  sendComment = () => {
    if (this.state.comment_ing)
      return
    this.setState({comment_ing: true});
    API.SaleComment.create({sale_id: this.state.sale.id, text:this.state.textValue}, (responseJson)=>{
      const comments = [...this.state.comments, responseJson];
      MyToast.show('评论成功', {length:'long'});
      this.setState({comments, textValue:'', comment_ing:false});
    }, (error)=>{
      MyToast.show('评论失败'+error.message,  {length:'long'});
      this.setState({comment_ing: false});
    });
  }

  renderActionBar = () => {
    const like = <Text style={{fontFamily:'iconfont', fontSize:18, color:'#222'}}>&#xe870;</Text>
    const liked = <Text style={{fontFamily:'iconfont', fontSize:18, color:'#fe2b54'}}>&#xe86f;</Text>
    const mark = <Text style={{fontFamily:'iconfont', fontSize:18, color:'#222'}}>&#xe86e;</Text>
    const marked = <Text style={{fontFamily:'iconfont', fontSize:18, color:'#9b59b6'}}>&#xe86d;</Text>
    const reply = <Text style={{fontFamily:'iconfont', fontSize:18, color:'#222', marginTop:2}}>&#xe891;</Text>
    return ( 
      <View style={{flex:1, flexDirection:'row', alignItems:'center'}} >
        <TouchableWithoutFeedback onPress={this.onLikePress} >
          <View style={{flex:2, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:4}}>
            {this.state.sale.liked_by_me?liked:like}<Text style={{fontSize:12, color:'#222'}}>超赞</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>this.setState({showCommentBar: true})} >
          <View style={{flex:2, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:4}}>
            {reply}<Text style={{fontSize:12, color:'#222'}}>留言</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>MyToast.show('功能开发中')} >
          <View style={{flex:2, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:4}}>
            {mark}<Text style={{fontSize:12, color:'#222'}}>收藏</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex:1}}></View>
        {
          Storage.user&&Storage.user.id==this.state.sale.user.id ? 
          <TouchableWithoutFeedback onPress={this.onManageSalePress}>
            <View style={{backgroundColor:'#fe4343', height:30, 
                  marginRight:16, justifyContent:'center', 
                  alignItems:'center', paddingLeft:16, paddingRight:16}}>
              <Text style={{fontSize:14, color:'#fff'}}>管理</Text>
            </View>
          </TouchableWithoutFeedback>:
          <TouchableWithoutFeedback onPress={()=>{}}>
          <View style={{backgroundColor:'#fe4343', height:30, 
                marginRight:16, justifyContent:'center', 
                alignItems:'center', paddingLeft:16, paddingRight:16}}>
            <Text style={{fontSize:14, color:'#fff'}}>我想要</Text>
          </View>
          </TouchableWithoutFeedback>
        }
      </View>
    )
  }

  onManageSalePress = () => {
    let options = [
      {name: '擦亮宝贝', callback: () => {
        API.Sale.put({id:this.state.sale.id}, (responseJson)=>{
          MyToast.show('成功擦亮');
          this.setState({sale:responseJson});
        }, (err) => {
          MyToast.show('操作失败');
        });
      }}, 
      {name: '删除宝贝', callback: () => {
        API.Sale.delete({id:this.state.sale.id}, (responseJson)=>{
          MyToast.show('删除成功');
          this.props.navigation.goBack();
        }, (err) => {
          MyToast.show('删除失败');
        });
      }},
    ];
    this.props.screenProps.showModalMenu(options);
  }

  renderCommentBar = () => {
    return (
      <KeyboardAvoidingView 
          behavior="height"
          style={{flex:1, borderWidth:0.5, borderColor:'#ddd', backgroundColor:'#fff',
                  flexDirection:'row', alignItems:'center'}}>
        <TouchableWithoutFeedback onPress={()=>this.setState({showCommentBar:false})}>
          <View style={{width:24, height:24, marginRight:12, marginLeft:12, alignItems:'center'}}>
            <Image style={{width:24, height:24}} source={require('../../../img/aui-icon-back.png')} />
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex:1, flexDirection:'row', alignItems:'center'}} >
          <TextInput 
            style={{flex:1, padding: 0, marginBottom:-8, textAlignVertical: 'top', fontSize: 16}}
            underlineColorAndroid="transparent"
            multiline={false}
            value={this.state.textValue}
            placeholder="有啥问题或者观点?"
            ref='textInput'
            autoGrow={false}
            autoFocus={true}
            onChangeText={(text)=>this.setState({textValue:text})}
          />
        </View>
        <View style={{width:40, paddingRight:10, justifyContent:'center',}}>
        {
          this.state.comment_ing ?
          <ActivityIndicator size='small' color={Theme.themeColor} /> :
          <Text onPress={this.sendComment} style={{fontSize:15,
            color: this.state.textValue!=''?Theme.themeColor:'#888888'}}>回复</Text>
        }
        </View>
      </KeyboardAvoidingView>
    )
  };

}