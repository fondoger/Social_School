'use strict';
import React from 'react';
import { WebView, View, Text } from 'react-native';

export default class KebiaoPage extends React.Component {
  static navigationOptions = {
    title: '第十四周课表',
  };
  constructor(props) {
    super(props); 
    this.state = {
      loading: true,
    }
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#eee'}}>
        <Text style={{height: this.state.loading?null: 0}}>加载中</Text>
        <WebView source={require('./kecheng-debug.html')} style={{width: this.state.loading?0: null}} onNavigationStateChange={this._onNavigationStateChange}/>
      </View>
    )
  }
  _onNavigationStateChange = (navState) => {
    if (navState.loading == false)
      this.setState({loading: false});
  }
}
