'use strict';
import React from 'react';
import { View, Text, TouchableHighlight, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { MyToast } from '../../components';


export default class RegisterPage extends React.Component {

  static navigationOptions = {
    title: '注册',
  };

  constructor(props) {
    super(props);
    this.state = {
      "email": '',
      "password": '',
      "verification_code": '',
      "get_code_ing": false,
      "register_ing": false,
      "remain_secs": 0,
    }
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:'#fff'}}>
        <View style={{padding:32}}>
          <View style={{marginTop:12, padding:4, borderBottomWidth:0.5, borderColor:'#888'}} >
            <TextInput 
              style={{padding: 0, fontSize: 18}}
              underlineColorAndroid="transparent"
              multiline={false}
              placeholder="邮箱"
              keyboardType="email-address"
              onChangeText={(text)=>this.setState({'email':text})}
            />
          </View>
          <View style={{marginTop:12, marginBottom:6, padding:4, borderBottomWidth:0.5, borderColor:'#888'}} >
            <TextInput 
              style={{padding: 0, fontSize: 18}}
              underlineColorAndroid="transparent"
              multiline={false}
              placeholder="密码"
              secureTextEntry={true}
              onChangeText={(text)=>this.setState({'password':text})}
            />
          </View>
          <Text>* 至少含一个字母</Text>
          <Text>* 至少含一个数字</Text>
          <Text>* 至少8位</Text>
          <View style={{marginTop:6, marginBottom:24, padding:4, borderBottomWidth:0.5, borderColor:'#888',}} >
            <TextInput 
              style={{padding: 0, fontSize: 18}}
              underlineColorAndroid="transparent"
              multiline={false}
              placeholder="验证码"
              maxLength={6}
              keyboardType="numeric"
              onChangeText={(text)=>this.setState({'verification_code':text})}
            />
            <Text style={{fontSize:15, position:'absolute', right:2, bottom:6,
                          color:(this.state.remain_secs==0 && !this.state.get_code_ing
                                 && this.state.password!='' && this.state.password!='')
                                 ?Theme.themeColor:'#888'}}
                onPress={this.onGetVerificationCode}>{
                this.state.get_code_ing?'请等待':this.state.remain_secs>0?`剩余${this.state.remain_secs}秒`: '获取验证码'}</Text>
          </View>
          <TouchableHighlight onPress={this.onRegisterPress}>
            <View style={{justifyContent:'center', alignItems:'center', flexDirection:'row', backgroundColor:'#41b629'}}>
              { this.state.register_ing ? <ActivityIndicator  size='small' color='#fff'/> : null }
              <Text style={{color: (this.state.password!=''&&this.state.email!=''&&this.state.verification_code!='')
                                    ?'#fff':'#ccc', fontSize:15, lineHeight:40}}>注册</Text>
            </View>
          </TouchableHighlight>
          <View style={{marginTop:32, alignItems:'center', flexDirection:'row'}}>
            <View style={{height:1, flex:1, backgroundColor:'#eee'}}></View>
            <Text style={{margin:4}}>或者</Text>
            <View style={{height:1, flex:1, backgroundColor:'#eee'}}></View>
          </View>
          <View style={{margin:12, justifyContent:'center', alignItems:'center'}}> 
            <TouchableHighlight onPress={this.onLoginPress}>
              <Text style={{color:'#fff', fontSize:15, paddingTop:9, 
                            paddingBottom:9, paddingLeft:12, paddingRight:12, 
                            backgroundColor:Theme.themeColor, fontWeight:'bold'}}>返回登陆</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }

  componentDidMount() {
    this.timer = setInterval(()=>{
      if (this.state.remain_secs > 0)
        this.setState({remain_secs: this.state.remain_secs-1});
    }, 1000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  onGetVerificationCode = () => {
    const { password, email, register_ing, remain_secs, get_code_ing } = this.state;
    if (password == '' || email == '' || remain_secs > 0 || get_code_ing)
      return
    this.setState({get_code_ing: true});
    API.User.waiting({email: email, password: password}, (responseJson) => {
      MyToast.show('验证码已经发送到邮箱, 请注意查收', {length:'long'});
      this.setState({get_code_ing: false, remain_secs:60});
    }, (error) => {
      if (error.message) MyToast.show(error.message, {length:'long'});
      this.setState({get_code_ing: false});
    });
  };

  onRegisterPress = () => {
    const { password, email, register_ing, verification_code } = this.state;
    if (password == '' || email == '' || verification_code == '' || register_ing)
      return
    this.setState({register_ing: true});
    API.User.create({email:email, verification_code:verification_code}, (responseJson)=>{
      MyToast.show('注册成功');
      const { token, user } = responseJson;
      Storage.multiSet([['token',token],['user',user], ['latest_email', email]]);
      this.setState({register_ing: false});
      this.props.navigation.goBack();
    }, (error) =>{
      if (error.message && error.message == 'verification_code error')
        MyToast.show('验证码错误', {length:'long'});
      else
        MyToast.show('注册失败:'+error, {length:'long'});
      this.setState({register_ing: false});
    });
  };

  onLoginPress = () => {
    this.props.navigation.replace('Common_LoginPage');
  };
}
