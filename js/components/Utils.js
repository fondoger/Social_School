'use strict';
import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';


export function DividingLine(props) {
  const paddingLeft = props.paddingLeft || 0;
  const color = props.color || 'black';
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{width: paddingLeft}} />
      <View style={{flex: 1, height: 0.5, backgroundColor: color}} />
    </View>
  );
}


export function Loading(props) {
  const { fullScreen, error } = props;
  const size = fullScreen ? 60: 40;
  const error_msg = props.error_msg !== undefined ? props.error_msg: 'Please provide error_msg';
  return (
    <TouchableWithoutFeedback onPress={props.onRetry}>
    <View style={[{flex:1}, props.style]}>
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        { error ? 
          <Text style={{fontSize:14, color:'#888'}}>{error_msg}</Text>:
          <Image style={{width:size, height:size}} source={require('../../img/loading-120px.webp')} />
        }
      </View>
      <View style={fullScreen?{flex:1}:null}></View>
    </View>
    </TouchableWithoutFeedback>
  );
}


export function IconFont(props) {
  const size = props.size || 24;
  const color = props.color || '#000';
  return (
    <View ref={props.ref} style={[{alignItems:'center', justifyContent:'center'}, props.style]}>
      <Text {...props} style={{fontFamily:'iconfont', fontSize:size, color: color}}>{props.icon}</Text>
    </View>
  );
}
IconFont.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};


export function PlaceholderImage(props) {
  return (
    <View {...props}>
      <Image style={StyleSheet.absoluteFill} resizeMode='contain' source={require('../../img/placeholder.jpg')} />
      <Image {...props} />
    </View>
  )
}


function _HeaderLeft(props) {
  const tintColor = props.tintColor;
  return (
    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
      <IconFont icon='&#xe622;' style={{width:60, alignItems:'center', padding:12, paddingTop:13}} size={24} color={tintColor} />
    </TouchableOpacity>
  );
}
export const HeaderLeft = withNavigation(_HeaderLeft);