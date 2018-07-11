'use strict';
import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

export default class Loading extends React.Component {
  render() {
    const { fullScreen, error } = this.props;
    const size = fullScreen ? 60: 36;
    const error_msg = this.props.error_msg || '加载失败, 点击重试';
    return (
      <TouchableWithoutFeedback onPress={this.props.onRetry}>
      <View style={[{flex:1}, this.props.style]}>
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          { error ? 
            <Text style={{fontSize:14, color:'#888'}}>{error_msg}</Text>:
            <Image style={{width:size, height:size}} source={require('../../img/loading-120px.webp')} />
          }
        </View>
        <View style={fullScreen?{flex:1}:null}></View>
      </View>
      </TouchableWithoutFeedback>
    )
  }
}