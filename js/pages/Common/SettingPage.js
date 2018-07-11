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


export default class MyScreen extends React.Component {
  static navigationOptions = {
    title: '设置',
  }

  constructor(props) {
    super(props);
    this.state = {
      useDebugServer: Storage.useDebugServer||false,
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={{marginTop:8}} underlayColor='#000' onPress={this.onSwitchValue}>
          <View style={{backgroundColor:'#fff', flexDirection:'row', alignItems:'center', padding:10}} >
            <Text style={{color:'#222', fontSize:15, flex:1}}>使用本地调试服务器</Text>
            <Switch value={this.state.useDebugServer} disabled ={true}  
                    onTintColor='#7fc6ff' tintColor='#999' 
                    thumbTintColor={this.state.useDebugServer?Theme.themeColor:'#fff'} />
          </View>
        </TouchableHighlight>
        <View style={{flexDirection:'row', backgroundColor:'#fff', marginTop:8}}>
        </View>
        <TouchableHighlight style={{marginTop:8}} underlayColor='#000' onPress={this.onSwitchAccountPress}>
          <View style={{backgroundColor:'#fff', justifyContent:'center', alignItems:'center'}} >
            <Text style={{color:Theme.themeColor, fontSize:15, padding:12}}>切换账号</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  onSwitchValue = () => {
    Storage.setItem('useDebugServer', !this.state.useDebugServer);
    this.setState({useDebugServer: !this.state.useDebugServer});
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
  },
});


