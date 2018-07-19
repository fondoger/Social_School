'use strict';
import React from 'react';
import {
  StyleSheet, 
  Text,
  View,
  Switch,
  Button,
  FlatList,
  Image,
  TouchableHighlight,
  StackNavigator,
  NativeModules,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { DividingLine } from '../../components';


export default class MyScreen extends React.Component {
  static navigationOptions = {
    title: '设置',
  }

  constructor(props) {
    super(props);
    this.state = {
      useDebugServer: Storage.useDebugServer||false,
      debugMode: Storage.debugMode||false,
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <View hint='Options Wrapper' style={{backgroundColor: '#fff'}} >
          <TouchableHighlight underlayColor='#000' onPress={this.onSwitchValue.bind(this)}>
            <View style={{backgroundColor:'#fff', flexDirection:'row', alignItems:'center', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10}} >
              <Text style={{color:'#222', fontSize:15, flex:1}}>使用开发服务器</Text>
              <Switch value={this.state.useDebugServer} disabled ={true}  
                      onTintColor='#7fc6ff' tintColor='#999' 
                      thumbTintColor={this.state.useDebugServer?Theme.themeColor:'#fff'} />
            </View>
          </TouchableHighlight>
          <DividingLine color='#ddd' paddingLeft={12} paddingRight={12}/>
          <TouchableHighlight underlayColor='#000' onPress={this.onSwitchDebugMode.bind(this)}>
            <View style={{backgroundColor:'#fff', flexDirection:'row', alignItems:'center', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10}} >
              <Text style={{color:'#222', fontSize:15, flex:1}}>开启调试模式</Text>
              <Switch value={this.state.debugMode} disabled ={true}  
                      onTintColor='#7fc6ff' tintColor='#999' 
                      thumbTintColor={this.state.debugMode?Theme.themeColor:'#fff'} />
            </View>
          </TouchableHighlight>         
        </View>
        <TouchableHighlight style={{marginTop:16}} underlayColor='#000' onPress={this.onSwitchAccountPress}>
          <View style={{backgroundColor:'#fff', justifyContent:'center', alignItems:'center'}} >
            <Text style={{color:Theme.themeColor, fontSize:15, padding:12}}>切换账号</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  onSwitchValue() {
    Storage.setItem('useDebugServer', !this.state.useDebugServer);
    this.setState({useDebugServer: !this.state.useDebugServer});
  }

  onSwitchDebugMode() {
    Storage.setItem('debugMode', !this.state.debugMode);
    this.setState({debugMode: !this.state.debugMode});
  }

  onSwitchAccountPress = () => {
    Storage.multiRemove(['token', 'user']);
    this.props.navigation.navigate('Common_LoginPage');
  };
}

const styles = StyleSheet.create({
  container: {
    flex:1, 
    backgroundColor:'#eee',
    paddingTop: 12,
  },
});


