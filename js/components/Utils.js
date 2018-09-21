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
import FastImage from 'react-native-fast-image';


export function DividingLine(props) {
  const paddingLeft = props.paddingLeft || 0;
  const paddingRight = props.paddingRight || 0;
  const color = props.color || 'black';
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ width: paddingLeft }} />
      <View style={{ flex: 1, height: 0.5, backgroundColor: color }} />
      <View style={{ width: paddingRight }} />
    </View>
  );
}


export function Loading(props) {
  const { fullScreen, error } = props;
  const size = fullScreen ? 60 : 40;
  const error_msg = props.error_msg !== undefined ? props.error_msg : 'Please provide error_msg';
  return (
    <TouchableWithoutFeedback onPress={props.onRetry}>
      <View style={[{ flex: 1 }, props.style]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {error ?
            <Text style={{ fontSize: 14, color: '#888' }}>{error_msg}</Text> :
            <Image style={{ width: size, height: size }} source={require('../../img/loading-120px.webp')} />
          }
        </View>
        <View style={fullScreen ? { flex: 1 } : null}></View>
      </View>
    </TouchableWithoutFeedback>
  );
}


export function IconFont(props) {
  const size = props.size || 24;
  const color = props.color || '#000';
  return (
    <View {...props} style={[{ alignItems: 'center', justifyContent: 'center' }, props.style]}>
      <Text style={{ fontFamily: 'iconfont', fontSize: size, color: color }}>{props.icon}</Text>
    </View>
  );
}
IconFont.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

export function HeaderLeft(props) {
  const tintColor = props.tintColor;
  return (
    <TouchableOpacity onPress={props.onPress}>
      <IconFont icon='&#xe622;' style={{ width: 60, alignItems: 'center', padding: 12, paddingTop: 13 }} size={24} color={tintColor} />
    </TouchableOpacity>
  );
}

export function HeaderRight(props) {
  let { icon, tintColor, onPress, backgroundColor } = props;
  tintColor = tintColor || '#fff';
  backgroundColor = backgroundColor || Theme.themeColor;
  icon = icon || '\ue617';
  return (
    <TouchableHighlight onPress={onPress} underlayColor={tintColor}>
      <View style={{ backgroundColor }} >
        <IconFont icon={icon} style={{ width: 54, alignItems: 'center', padding: 12 }} size={22} color={tintColor} />
      </View>
    </TouchableHighlight>
  );
}


function _HeaderSettingButton(props) {
  const tintColor = props.tintColor;
  return (
    <TouchableOpacity onPress={props.navigation.state.params.handleSettingButton}>
      <IconFont icon='&#xe617;' style={{ width: 60, alignItems: 'center', padding: 12, paddingTop: 13 }} size={24} color={tintColor} />
    </TouchableOpacity>
  );
}
export const HeaderSettingButton = withNavigation(_HeaderSettingButton);


function _ListUserItem(props) {
  const user = props.user;
  const gender_icon = user.gender === 1 ? '\ue646' : user.gender === 2 ? '\ue647' : '';
  const gender_color = user.gender === 1 ? '#41aade' : '#ff85b6';
  const backgroundColor = props.backgroundColor || Theme.backgroundColorLight;
  const dividingLineColor = props.dividingLineColor || '#ddd';
  const onPress = () => {
    props.navigation.navigate('User_ProfilePage', { user });
  }
  return (
    <View>
      <TouchableHighlight onPress={onPress}>
        <View style={{ flexDirection: 'row', backgroundColor: backgroundColor, padding: 10 }}>
          <_UserAvatarView user={user} size={48} />
          <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={{ color: '#222', fontSize: 14 }}>{user.username}</Text>
              <IconFont style={{ paddingLeft: 2, paddingBottom: 2 }} icon={gender_icon} color={gender_color} size={15} />
            </View>
            <Text style={{ fontSize: 13 }}>{user.self_intro}</Text>
          </View>
        </View>
      </TouchableHighlight>
      <DividingLine color={dividingLineColor} paddingLeft={68} />
    </View>
  )
}
export const ListUserItem = withNavigation(_ListUserItem);


function _ListGroupItem(props) {
  const { group } = props;
  const onPress = () => {
    props.navigation.navigate('Group_GroupPage', { group });
  }
  return (
    <View>
      <TouchableHighlight onPress={onPress}>
        <View style={{ flexDirection: 'row', backgroundColor: Theme.backgroundColorLight, padding: 10 }}>
          <_GroupAvatarView group={group} size={48} />
          <View style={{ flex:1, marginLeft:16, justifyContent: 'center'}}>
            <Text style={{ color:'#222', fontSize:14 }}>{group.groupname}</Text>
            <Text style={{ fontSize:13 }}>{group.description}</Text>
          </View>
        </View>
      </TouchableHighlight>
      <DividingLine color='#ddd' paddingLeft={68} />
    </View>
  )
}
export const ListGroupItem = withNavigation(_ListGroupItem);


export function PlaceholderImage(props) {
  return (
    <View>
      <View style={[{backgroundColor: 'gray'}, props.style ]} />
      <FastImage {...props} style={[props.style, {position:'absolute', left:0, right: 0}]} />
    </View>
  );
}

function _UserAvatarView(props) {
  let { user, hideLogo, size } = props;
  size = props.size || 46;
  const user_vip_logo = require('../../img/user_vip.png');
  return (
    <View style={[props.style, { height: size, width: size }]}>
      <PlaceholderImage 
        style={{
          width: size, height: size, borderRadius: size / 2,
          borderWidth: 0.5, borderColor: 'rgba(100,100,100,0.1)'
        }}
        source={{ uri: user.avatar + '!thumbnail' }} 
      />
      {
        hideLogo ? null :
          <Image style={{
            position: 'absolute', right: -1,
            bottom: -1, width: 13, height: 13
          }}
            source={user_vip_logo}
          />
      }
    </View>
  );
}

function _UserAvatar(props) {
  const {  user, hideLogo, size, onPress} = props;
  const defaultOnPress = () => {
    props.navigation.navigate('User_ProfilePage', { user });
  }
  return (
    <TouchableWithoutFeedback onPress={onPress || defaultOnPress} >
      <View>
        <_UserAvatarView {...props} />
      </View>
    </TouchableWithoutFeedback>
  )
}
export const UserAvatar = withNavigation(_UserAvatar);

export function _GroupAvatarView(props) {
  const { group, size } = props;
  return (
    <PlaceholderImage
      style={{
        width: size, height: size, borderRadius: 3,
        borderWidth: 0.5, borderColor: 'rgba(200,200,200,0.5)'
      }}
      source={{ uri: group.avatar + '!thumbnail' }} 
    />
  )
}

function _GroupAvatar(props) {
  const { group, size, onPress } = props;
  const defaultOnPress = () => {
    props.navigation.navigate('Group_GroupPage', { group });
  }
  return (
    <TouchableWithoutFeedback onPress={onPress || defaultOnPress}>
      <View><_GroupAvatarView {...props} /></View>
    </TouchableWithoutFeedback>
  )
}
export const GroupAvatar = withNavigation(_GroupAvatar);