'use strict';
import React from 'react';
import { 
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import ImagePicker from 'react-native-image-crop-picker';
import Upyun from '../../utils/Upyun';
import { MyToast, StatuesesItem, GroupPostItem, ModalMenu, SlideInMenu } from '../../components';

const _window = require('Dimensions').get('window');
const ScreenWidth = _window.width;
const ScreenHeight = _window.height;

export default class EditProfilePage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '编辑个人信息',
  });

  constructor(props) {
    super(props);
    this.state = {
      user: Storage.user,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', (playload)=>{
      this.setState({user: Storage.user});
    });
  }

  changeGenderTo = (gender) => {
    API.User.put({gender:gender}, (responseJson)=>{
      this.setState({user: responseJson});
      Storage.setItem('user', responseJson);
    }, (error)=>{ MyToast.show('出错啦');})
  }

  onImageSelected = (image) => {
    ModalMenu.showLoading('正在上传图片');
    Upyun.upload({fileUri:image.path, prefix:'avatar'}, (uploaded_url)=>{
      API.User.put({avatar:uploaded_url}, (responseJson)=>{
        ModalMenu.hide();
        Storage.setItem('user', responseJson);
        this.setState({user: responseJson});
        MyToast.show('修改头像成功');
      }, (err) => {
        ModalMenu.hide();
        MyToast.show('出错啦');
      });
    }, (err)=>{
      ModalMenu.hide();
      MyToast.show('上传图片失败');
    })
  }

  onAvatarPress = () => {
    const user = this.state.user;
    const pickerConfig = {
      width: 720,
      height: 720,
      cropping: true,
      mediaType: 'photo',
      cropperActiveWidgetColor: Theme.themeColor,
      cropperToolbarColor: Theme.themeColor,
      cropperStatusBarColor: Theme.themeColor,
    };
    ModalMenu.showComponent( () => (
      <TouchableWithoutFeedback>
        <View style={{padding:20, backgroundColor:'#fff', borderRadius:3,}}>
          <Text style={{color:'#222', fontSize:18}}>选择头像</Text>
          <View style={{marginTop:12, flexDirection:'row'}}>
            <TouchableHighlight style={{marginRight:16}} onPress={()=>{ImagePicker.openCamera(pickerConfig).then(this.onImageSelected); ModalMenu.hide()}}>
              <View style={{backgroundColor:'#fff', alignItems:'center', padding:12, paddingLeft:24, paddingRight:24}}>
                <Text style={{fontFamily:'iconfont', fontSize:36, color:'#3498db'}}>&#xe872;</Text>
                <Text style={{color:'#444', fontSize:14}}>拍照</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={{marginLeft:16}} onPress={()=>{ImagePicker.openPicker(pickerConfig).then(this.onImageSelected); ModalMenu.hide()}}>
              <View style={{backgroundColor:'#fff', alignItems:'center', padding:12, paddingLeft:24, paddingRight:24}}>
                <Text style={{fontFamily:'iconfont', fontSize:36, color:'#9b59b6'}}>&#xe889;</Text>
                <Text style={{color:'#444', fontSize:14}}>相册</Text>
              </View>
            </TouchableHighlight>              
          </View>
        </View>
      </TouchableWithoutFeedback>
    ));
  }

  onGenderPress = () => {
    const user = this.state.user;
    SlideInMenu.showMenu(['男', '女', '未知'], (selected) => {
      if (selected == 0)
        this.changeGenderTo(1);
      else if (selected == 1)
        this.changeGenderTo(2);
      else
        this.changeGenderTo(0);
    });
  }

  onQrCodePress() {
    const { user } = this.state;
    const text = `Social_BUAA:user_id=${user.id}`;
    console.log('user avatar: ' + user.avatar);
    const qr_image_url = `https://tool.kd128.com/qrcode?text=${text}&logo=${user.avatar+'!qrcode'}`;
    this.props.navigation.navigate('Common_ImageViewerPage', {initialImage: 0, images: [{source: {uri: qr_image_url}}]});
  }

  render() {
    const user = this.state.user;
    const gender = (user.gender==1 ? '男':
                    user.gender==2 ? '女': '未知');
    return (
      <View style={{flex:1, backgroundColor:'#eee'}} >
        <View style={{marginTop: 16, backgroundColor:'#fff'}}>
          <TouchableHighlight onPress={this.onAvatarPress} >
            <View style={styles.rowContainer} >
              <View style={[styles.rowWrapper, {height:60}]} >
                <Text style={styles.rowText}>头像</Text>
                <Image style={{height:52, width:52, borderRadius:26}} source={{uri:user.avatar}} />
              </View>
            </View>
          </TouchableHighlight>
          <View style={styles.dividingLine} />
          <TouchableHighlight onPress={()=>this.props.navigation.navigate('User_EditUsernamePage')} >
            <View style={styles.rowContainer} >
              <View style={styles.rowWrapper} >
                <Text style={styles.rowText}>用户名</Text>
                <Text style={styles.rowTextLight}>{user.username}</Text>
              </View>
            </View>
          </TouchableHighlight>
          <View style={styles.dividingLine} />
          <TouchableHighlight onPress={this.onGenderPress} >
            <View style={styles.rowContainer} >
              <View style={styles.rowWrapper} >
                <Text style={styles.rowText}>性别</Text>
                <Text style={styles.rowTextLight}>{gender}</Text>
              </View>
            </View>
          </TouchableHighlight>
          <View style={styles.dividingLine} />
          <TouchableHighlight onPress={()=>this.props.navigation.navigate('User_EditSelfIntroPage')} >
            <View style={styles.rowContainer} >
              <View style={styles.rowWrapper} >
                <Text style={styles.rowText}>自我介绍</Text>
                <Text style={styles.rowTextLight}>{user.self_intro}</Text>
              </View>
            </View>
          </TouchableHighlight>
          <View style={styles.dividingLine} />
          <TouchableHighlight onPress={this.onQrCodePress.bind(this)} >
            <View style={styles.rowContainer} >
              <View style={styles.rowWrapper} >
                <Text style={styles.rowText}>二维码名片</Text>
                <Image style={{height:24, width:24,}} source={require('../../../img/qrcode.png')} />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dividingLine: {
    height: 0.5,
    backgroundColor: '#ddd',
    marginLeft: 12,
    marginRight: 12,
  },
  rowContainer: {
    backgroundColor: '#fff',
    padding: 12,
  },
  rowWrapper: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    color: '#222',
    fontSize: 15,
  },
  rowTextLight: {
    color: '#888',
    fontSize: 15,
  },

})
