'use strict';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ListUserItem, HeaderSettingButton, MyToast } from '../../components';



export default class QRCodePage extends React.Component {

  static navigationOptions = {
    title: '二维码名片',
    headerRight: HeaderSettingButton,
  };

  componentDidMount() {
    this.props.navigation.setParams({handleSettingButton:this.handleSettingButton.bind(this)});
  }

  handleSettingButton() {
    MyToast.show('Press');
  }

  getQRCodeImageUrl(user) {
    const text = `Social_BUAA:USER:id=${user.id}`;
    const logo = user.avatar+'!qrcode';
    const qr_image_url = `https://tool.kd128.com/qrcode?text=${text}&logo=${logo}`;
    return qr_image_url;
  }

  render() {
    const user = this.props.navigation.state.params.user;
    const qr_image_url = this.getQRCodeImageUrl(user);
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ListUserItem user={user} backgroundColor='#fff' dividingLineColor='#fff'/>
          <Image style={styles.image} source={{uri: qr_image_url}} />
          <View style={styles.textHintWrap}><Text style={styles.textHint}>扫一扫加我为好友</Text></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f3032',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#fff',
    padding: 16,
  },
  userInfo: {
    width: 250,
  },
  image: {
    width: 250,
    height: 250,
  },
  textHintWrap: {
    alignItems: 'center',
    paddingTop: 4
  },
  textHint: {
    color: '#888',
    fontSize: 16,
  },
});