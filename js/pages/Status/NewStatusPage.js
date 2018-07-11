'use strict';
import React from 'react';
import { 
  View, 
  Text,
  Image,
  TextInput, 
  ScrollView,
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  TouchableHighlight, 
  KeyboardAvoidingView,
  TouchableWithoutFeedback, 
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Emotion from '../../utils/Emotion';
import Storage from '../../utils/Storage';
import { MyToast, ImageSelector } from '../../components';

export default class NewStatusPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params.type===API.Status.USERSTATUS?'发表新动态':
            navigation.state.params.type===API.Status.GROUPSTATUS?'发布团体微博':
            navigation.state.params.type===API.Status.GROUPPOST?'发表帖子':'粗错啦'),
    headerRight:(
      navigation.state.params.sending ?
      <ActivityIndicator style={{marginRight:12,}} size='small' color="#fff" /> :
      <TouchableHighlight onPress={navigation.state.params.handleFinish}>
        <View style={{padding:16, backgroundColor:Theme.themeColor}}>
          <Text style={{color:'#fff', fontSize:15, 
            opacity: navigation.state.params.finishEnabled?1:0.6
            }}>完成</Text>
        </View>
      </TouchableHighlight>
    )
  });

  handleFinish = () => {
    const images = this.refs.imageSelector.state.images;
    const navParams = this.props.navigation.state.params;
    if (!navParams.finishEnabled)
      return
    this.props.navigation.setParams({ sending: true });
    this.refs.imageSelector.uploadImages('status', (images)=>{
      var imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        imageUrls.push(images[i].uploaded_url);
      }
      API.Status.create({
          type: navParams.type,
          text: this.state.textValue,
          title: this.state.titleValue,
          group_id: navParams.group ? navParams.group.id:null,
          pics: imageUrls,
      }, (responseJson)=>{
        const message = (
          navParams.type == API.Status.USERSTATUS?"成功发表动态":
          navParams.type == API.Status.GROUPSTATUS?"成功发布团体微博":
          navParams.type == API.Status.GROUPPOST?"成功发布帖子":"唔, 粗错啦!"
        );
        this.props.navigation.setParams({ sending: false });
        MyToast.show(message);
        this.props.navigation.replace('Status_StatusPage', {status:responseJson});
      }, (error)=>{
        MyToast.show('啊哦, 出了点问题', {type:'waning', length:'long'});  
        this.props.navigation.setParams({ sending: false });
      });
    }, (error)=>{
      MyToast.show('上传图片失败',  {type:'waning', length:'long'});
      this.props.navigation.setParams({ sending: false });
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      textValue: "",
      titleValue: '',
      image_urls: [],
      image_uploading: false,
    }
  }

  componentWillMount() {
    if (!Storage.token) {
      this.props.navigation.replace('Common_LoginPage');
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      finishEnabled: false, 
      handleFinish: this.handleFinish
    });
  }

  renderFooter() {
    return (
      <KeyboardAvoidingView behavior="height" style={{borderWidth: 0.5, borderColor: '#eee'}}>
        <View style={{flexDirection: 'row', backgroundColor: '#f4f4f4'}}>
        <TouchableOpacity style={styles.toolbar_icon_container} onPress={this._onToolbarPicture}>
          <Image source={require('../../../img/compose_toolbar_picture.png')} style={styles.toolbar_icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbar_icon_container} onPress={this._onToolbarMention}>
          <Image source={require('../../../img/compose_mentionbutton_background.png')} style={styles.toolbar_icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbar_icon_container} onPress={this._onToolbarTopic}>
          <Image source={require('../../../img/compose_trendbutton_background.png')} style={styles.toolbar_icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbar_icon_container} onPress={this._onToolbarMore}>
          <Image source={require('../../../img/compose_toolbar_more.png')} style={styles.toolbar_icon} />
        </TouchableOpacity>
        </View>
        <View style={{display:'none', backgroundColor: '#e8e8e8', height: 80}}>
        </View>
      </KeyboardAvoidingView>
    )
  }

  renderTitleInput() {
    return (
      <View style={{backgroundColor:'#fff', padding:12, borderBottomWidth:0.5, borderColor:'#eee'}}>
        <TextInput 
          style={{padding: 0, fontSize: 16}}
          underlineColorAndroid="transparent"
          multiline={false}
          placeholder="标题"
          value={this.state.titleValue}
          onChangeText={this._onChangeTitle}
          selectionColor={Theme.themeColor}
        />
      </View>
    )
  }

  render() {
    const navParams = this.props.navigation.state.params;
    return (
      <View style={{flex: 1}}>
        {
          navParams.type==API.Status.GROUPPOST ?
          this.renderTitleInput():null
        }
        <ScrollView style={styles.container}>
          <TextInput 
            style={{minHeight: 80, textAlignVertical: 'top',
                    padding: 0, fontSize: 16}}
            underlineColorAndroid="transparent"
            multiline={true}
            value={this.state.textValue}
            placeholder={
              navParams.type==API.Status.USERSTATUS?"分享新鲜事...":
              navParams.type==API.Status.GROUPSTATUS?"分享团体新鲜事":
              navParams.type==API.Status.GROUPPOST?"正文":null
            }
            onChangeText={this._onChangeText}
            selectionColor={Theme.themeColor}
          />
          <ImageSelector {...this.props} style={{marginTop: 8}}
              ref='imageSelector'/>
        </ScrollView>
        {
          navParams.type!=API.Status.GROUPPOST ?
          this.renderFooter():null
        }
      </View>
    )
  }

  _onChangeText = (text) => {

    this.props.navigation.setParams({
      finishEnabled: text===''||(this.props.navigation.state.params.type
        ==API.Status.GROUPPOST && this.state.titleValue==='')?false: true
    });
    // 如果在原来的地方匹配不到了. 就删除原来真个一段
    var regexp = new RegExp(`@[\\u4e00-\\u9fa5_a-zA-Z0-9\\-]+`, 'g');
    if (text + ' ' === this.state.textValue) {
      let at = -1;
      let t;
      while ((t = text.indexOf('@', at+1)) != -1) 
        at = t;
      if (at != -1) {
        let t3 = text.slice(at);
        let t2;
        if (t2 = t3.match(regexp)) {
          if (t2[0].length + at == text.length)
            text = text.slice(0, at);
        }
      }
    } else if (text + ']'===this.state.textValue) {
      var regexp = new RegExp(`\\[(${Emotion.regexp})\\]`, 'g');
      let pos = -1;
      let t;
      while ((t = text.indexOf('[', pos+1)) != -1)
        pos = t;
      if (pos != -1) {
        let t2 = text.slice(pos);
        let t3;
        if (t3 = t2.match(regexp)) {
          if (t3[0].length + pos == text.length)
            text = text.slice(0, pos);
        }
      }
    } else if (text + '#'===this.state.textValue) {
      var regexp = new RegExp(`#[\\s\\S]+?#`, 'g');
      let pos = -1;
      let t;
      while ((t = text.indexOf('#', pos+1)) != -1)
        pos = t;
      if (pos != -1) {
        let t2 = this.state.textValue.slice(pos);
        let t3;
        if (t3 = t2.match(regexp)) {
          if (t3[0].length + pos - 1 == text.length)
            text = text.slice(0, pos);
        }
      }
    }
    this.setState({
      textValue: text,
    });
  }
  _onChangeTitle = (title) => {
    this.props.navigation.setParams({
      finishEnabled: title===''||this.state.textValue===''?false: true
    });
    this.setState({
      titleValue: title,
    });
  }
  _onToolbarPicture = () => {
    const imageSelector = this.refs.imageSelector;
    if (imageSelector.state.images.length == 9) {
      console.log('最多只能选9个图片哦.');
      return;
    }
    imageSelector._onSelectMorePress();
  }
  _onToolbarMention = () => {
    this.setState({textValue: this.state.textValue + '@张三 '});
  }
  _onToolbarTopic = () => {
    this.setState({textValue: this.state.textValue + '#北航美食#'});
  }
  _onToolbarMore = () => {
  }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
      padding: 12,
    },
    toolbar_icon_container: {
      flexDirection: 'row',
      justifyContent: 'center',
      flex: 1,
    },
    toolbar_icon: {
      width: 24,
      height: 24,
      margin: 12,
    },
});

