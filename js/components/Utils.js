'use strict';
import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { Theme } from '../utils';


export function DividingLine(props) {
  const paddingLeft = props.paddingLeft || 0;
  const paddingRight = props.paddingRight || 0;
  const color = props.color || 'black';
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{width: paddingLeft}} />
      <View style={{flex: 1, height: 0.5, backgroundColor: color}} />
      <View style={{width: paddingRight}} />
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
    <View {...props} style={[{alignItems:'center', justifyContent:'center'}, props.style]}>
      <Text style={{fontFamily:'iconfont', fontSize:size, color: color}}>{props.icon}</Text>
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


export function HeaderLeft(props) {
  const tintColor = props.tintColor;
  return (
    <TouchableOpacity onPress={props.onPress}>
      <IconFont icon='&#xe622;' style={{width:60, alignItems:'center', padding:12, paddingTop:13}} size={24} color={tintColor} />
    </TouchableOpacity>
  );
}


function _HeaderSettingButton(props) {
  const tintColor = props.tintColor;
  return (
    <TouchableOpacity onPress={props.navigation.state.params.handleSettingButton}>
      <IconFont icon='&#xe617;' style={{width:60, alignItems:'center', padding:12, paddingTop:13}} size={24} color={tintColor} />
    </TouchableOpacity>
  );
}
export const HeaderSettingButton = withNavigation(_HeaderSettingButton);


export function ListUserItem(props) {
  const user = props.user;
  const backgroundColor = props.backgroundColor || Theme.backgroundColor;
  const dividingLineColor = props.dividingLineColor || '#ddd';
  const gender_icon = user.gender === 1 ? '\ue646': // male
                      user.gender === 2 ? '\ue647': // female
                      '';                           // default 
  const gender_color = user.gender === 1 ? '#41aade': '#ff85b6';
  return (
    <View>
      <TouchableHighlight onPress={props.onPress}>
        <View style={{flexDirection:'row', backgroundColor:backgroundColor, padding:8}}>
          <UserAvatar user={user} size={50} blockOnPress={true} />
          <View style={{flex:1, marginLeft:8, justifyContent:'center'}}>
            <View style={{flexDirection: 'row', alignItems:'flex-end'}}>
              <Text style={{color:'#222', fontSize:15}}>{user.username}</Text>
              <IconFont style={{paddingLeft: 2, paddingBottom: 2}} icon={gender_icon} color={gender_color} size={15}/>
            </View>
            <Text style={{fontSize:13}}>{user.self_intro}</Text>
          </View>
        </View>
      </TouchableHighlight>
      <DividingLine color={dividingLineColor} paddingLeft={68} />
    </View>
  )
}



function _UserAvatar(props) {
  const { hideLogo, user, onPress, blockOnPress } = props;
  const user_vip_logo = require('../../img/user_vip.png');
  const size = props.size || 46;
  const defaultAvatar = 'http://asserts.fondoger.cn/default/default_avatar.jpg!thumbnail';
  const view = (
    <View style={[props.style, {height:size, width:size}]}>
      <Image style={[StyleSheet.absoluteFill, {width:size, 
                    height:size, borderRadius:size/2}]} 
             source={{uri: defaultAvatar}} />
      <Image
        style={{width:size, height:size, borderRadius:size/2, 
        borderWidth:0.5, borderColor:'rgba(100,100,100,0.1)'}} 
        source={{uri: user.avatar+'!thumbnail'}} />
      {
        hideLogo ? null:
        <Image style={{position:'absolute', right:-1,
                       bottom:-1, width:13, height:13}} 
               source={user_vip_logo}
        /> 
      }
    </View>
  );
  if (blockOnPress)
    return view;
  const defaultOnPress = ()=>{
    props.navigation.navigate('User_ProfilePage', {user});
  }
  return (
    <TouchableWithoutFeedback onPress={props.onPress || defaultOnPress} >
      { view }
    </TouchableWithoutFeedback>
  )
}
export const UserAvatar = withNavigation(_UserAvatar);


function _GroupAvatar(props) {

}