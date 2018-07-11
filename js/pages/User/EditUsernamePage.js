'use strict';
import React from 'react';
import { 
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import MyToast from '../../components';

export default class EditUsernamePage extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: '修改用户名',
    headerRight: (
      <TouchableHighlight onPress={()=>navigation.state.params.handleFinish()}>
        <View style={{padding:16, backgroundColor:Theme.themeColor}}>
          <Text style={{color:'#fff', fontSize:15}}>保存</Text>
        </View>
      </TouchableHighlight>
    )
  });

  componentDidMount() {
    this.props.navigation.setParams({
      handleFinish: () => {
        const closeCallback = this.props.screenProps.showModalLoading("正在保存");
        API.User.put({username:this.state.username}, (responseJson)=>{
          closeCallback();
          Storage.setItem('user', responseJson);
          MyToast.show('修改成功');
          this.props.navigation.goBack();
        }, (error)=>{
          closeCallback();
          MyToast.show(error.message||'未知错误');
        });
      },
    });
    setTimeout(()=>{
      // delay load to avoid influent screen transition
      this.setState({show: true});
    }, 200);
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      show: false,
    }
  }

  render() {
    if (!this.state.show)
      return null
    return (
      <View style={{flex:1, backgroundColor:'#eee', padding:16}}>
        <View style={{alignItems:'center', flexDirection:'row'}}>
          <TextInput 
            underlineColorAndroid={Theme.themeColor}
            style={{flex:1, fontSize:16}}
            placeholder="请输入新用户名"
            value={this.state.username}
            onChangeText={(text)=>this.setState({username:text})}
            autoFocus={true}
            selectionColor={Theme.themeColor}
          />
          <Text style={{padding:8, fontSize:18, color:'#aaa'}} onPress={()=>this.setState({username:''})}>×</Text>
        </View>
        <View style={{marginLeft:8}}>
          <Text>* 4-30个字符</Text>
          <Text>* 支持中英文、数字、下划线"_"或减号"-"</Text>
          <Text>* 一个中文相当于两个字符</Text>
        </View>
      </View>
    )
  };

}
