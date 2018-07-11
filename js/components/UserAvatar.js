'use strict';
import React from 'react';
import { 
  View, 
  Image, 
  StyleSheet,
  TouchableWithoutFeedback, 
} from 'react-native';

const defaultAvatar = 'http://asserts.fondoger.cn/default/default_avatar.jpg!thumbnail';

export default class UserAvatar extends React.Component {

  _defaultOnAvatarPress = () => {
    if (this.props.user)
      this.props.navigation.navigate('User_ProfilePage', {user: this.props.user});
    else if (this.props.group)
      this.props.navigation.navigate('Group_GroupPage', {group: this.props.group});
  }

  render() {
    const {hideLogo, user, group } = this.props;
    const user_vip_logo = require('../../img/user_vip.png');
    const avatar = user ? user.avatar: group.avatar;
    const size = this.props.size || 46;
    return (
      <TouchableWithoutFeedback 
          onPress={this.onPress||this._defaultOnAvatarPress}>
        <View style={[this.props.style, {height:size, width:size}]}>
          <Image style={[StyleSheet.absoluteFill, {width:size, 
                        height:size, borderRadius:size/2}]} 
                 source={{uri: defaultAvatar}} />
          <Image
            style={{width:size, height:size, borderRadius:size/2, 
            borderWidth:0.5, borderColor:'rgba(100,100,100,0.1)'}} 
            source={{uri: avatar+'!thumbnail'}} />
          {
            hideLogo ? null:
            <Image style={{position:'absolute', right:-1,
                           bottom:-1, width:13, height:13}} 
                   source={user_vip_logo}
            /> 
          }
        </View>
      </TouchableWithoutFeedback>
    )
  }
}