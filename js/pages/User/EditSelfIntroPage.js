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

export default class EditUsernamePage extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: '修改自我介绍',
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
        API.User.put({self_intro:this.state.self_intro}, (responseJson)=>{
          closeCallback();
          Storage.setItem('user', responseJson);
          MyToast.show('修改成功');
          this.props.navigation.goBack();
        }, (error)=>{
          closeCallback()
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
      self_intro: Storage.user.self_intro,
      show: false,
    }
  }

  render() {
    if (!this.state.show)
      return null
    return (
      <View style={{flex:1, backgroundColor:'#eee', padding:16}}>
        <Text style={{}}>一句简明的自我介绍能让人迅速了解你哦</Text>
        <View style={{alignItems:'center', flexDirection:'row'}}>
          <TextInput 
            underlineColorAndroid={Theme.themeColor}
            style={{flex:1, fontSize:16}}
            value={this.state.self_intro}
            onChangeText={(text)=>this.setState({self_intro:text})}
            autoFocus={true}
            selectionColor={Theme.themeColor}
          />
          <Text style={{padding:8, fontSize:18, color:'#aaa'}} onPress={()=>this.setState({self_intro:''})}>×</Text>
        </View>
      </View>
    )
  };

}
