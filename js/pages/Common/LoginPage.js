'use strict';
import React from 'react';
import { View, Text, TouchableHighlight, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { MyToast } from '../../components';

export default class LoginPage extends React.Component {

  static navigationOptions = {
    title: '登陆',
  };

  constructor(props) {
    super(props);
    this.state = {
      "email": Storage.latest_email||'',
      "password": '',
      "log_in_ing": false,
    }
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:'#fff'}}>
        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={30}>
          <View style={{flexDirection:'row'}}>
            <View style={{backgroundColor:Theme.themeColor, flex:1, aspectRatio:1.8}} ></View>
          </View>
          <View style={{padding:32}}>
            <View style={{marginTop:12, padding:4, borderBottomWidth:0.5, borderColor:'#888'}} >
              <TextInput 
                style={{padding: 0, fontSize: 18}}
                underlineColorAndroid="transparent"
                multiline={false}
                placeholder="邮箱"
                ref='email'
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={(text)=>this.setState({'email':text})}
              />
            </View>
            <View style={{marginTop:12, marginBottom:24, padding:4, borderBottomWidth:0.5, borderColor:'#888'}} >
              <TextInput 
                style={{padding: 0, fontSize: 18}}
                underlineColorAndroid="transparent"
                multiline={false}
                placeholder="密码"
                secureTextEntry={true}
                ref='password'
                onChangeText={(text)=>this.setState({'password':text})}
              />
            </View>
            <TouchableHighlight onPress={this.onLoginPress}>
              <View style={{justifyContent:'center', alignItems:'center', flexDirection:'row', backgroundColor:Theme.themeColor}}>
                { this.state.log_in_ing ? <ActivityIndicator  size='small' color='#fff'/> : null }
                <Text style={{color: this.state.password!=''&&this.state.email!=''?'#fff':'#aaa', fontSize:15, lineHeight:40}}>登陆</Text>
              </View>
            </TouchableHighlight>
            <View style={{alignItems:'center', padding:12}}>
              <Text style={{color:Theme.themeColor}} onPress={()=>MyToast.show('点击了忘记密码')}>忘记密码?</Text>
            </View>
            <View style={{alignItems:'center', flexDirection:'row'}}>
              <View style={{height:1, flex:1, backgroundColor:'#eee'}}></View>
              <Text style={{margin:4}}>或者</Text>
              <View style={{height:1, flex:1, backgroundColor:'#eee'}}></View>
            </View>
            <View style={{margin:12, justifyContent:'center', alignItems:'center'}}> 
              <TouchableHighlight onPress={this.onRegisterPress}>
                <Text style={{color:'#fff', fontSize:15, paddingTop:9, 
                              paddingBottom:9, paddingLeft:12, paddingRight:12, 
                              backgroundColor:'#41b629', fontWeight:'bold'}}>注册账号</Text>
              </TouchableHighlight>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    )
  }

  onLoginPress = () => {
    const { password, email, log_in_ing } = this.state;
    if (password == '' || email == '' || log_in_ing)
      return
    this.setState({log_in_ing: true});
    API.Other.token(email, password, (responseJson)=>{
      MyToast.show('登陆成功');
      const { token, user } = responseJson;
      Storage.multiSet([['token',token],['user',user], ['latest_email', email]]);
      this.setState({log_in_ing: false});
      this.props.navigation.goBack();
    }, (error) =>{
      if (error.message && error.message == 'Invalid credentials')
        MyToast.show('账号或密码错误');
      else
        MyToast.show('登陆失败'+error);
      this.setState({log_in_ing: false});
    });
  }

  onRegisterPress = () => {
    this.props.navigation.replace('Common_RegisterPage');
  }
}
