'use strict';
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Theme from '../utils/Theme';
import Emotion from '../utils/Emotion';
import ImageCard from './ImageCard';
import WechatArticleCard from './WechatArticleCard';
import API from '../utils/API_v1';
import { getGMTTimeDiff } from '../utils/Util';
import UserAvatar from './UserAvatar';
import Styles from '../utils/Styles';

export default class GroupPostItem extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      status: this.props.status,
    }
  }

  render() {
    const status = this.state.status;
    return (
      <View style={{backgroundColor:'#fff'}}>
        { this.props.showSource ? this.renderSource():null}
        <TouchableHighlight 
          underlayColor='#aaacad'
          onPress={()=>this.props.navigation.navigate('Status_StatusPage', {status:status})}
        >
          <View style={{padding:12, backgroundColor:'#fff'}}>
            <Text style={{fontSize:15, fontWeight:'bold', color:'#333'}}>{status.title}</Text>
            <Text style={{fontSize:14, color:'#444', paddingTop:8, paddingBottom:10}} numberOfLines={3}>{status.text}</Text>
            {this.renderFooter()}
          </View>
        </TouchableHighlight>
      </View>
    )
  };

  renderFooter() {
    const status = this.state.status;
    return (
      <View style={{flexDirection:'row', alignItems:'center'}} >
        <UserAvatar {...this.props} size={16} hideLogo={true} user={status.user}/>
        <Text style={{fontSize:13, color:'#888', marginLeft:4}}>
          <Text style={{color:'#555'}} onPress={this.jumpToUserProfilePage.bind(this)}>{status.user.username}</Text>
          <Text style={{color:'#aaa'}}>, {getGMTTimeDiff(status.timestamp,'POSTTIME')}</Text>
        </Text>
      </View>
    )
  }

  jumpToUserProfilePage() {
    this.props.navigation.navigate('User_ProfilePage', {user: this.state.status.user});
  };

  renderSource() {
    const status = this.state.status;
    return (
      <View style={{flexDirection:'row', alignItems:'center', padding:10, borderBottomWidth:0.5, borderColor:'#ddd'}}>
        <Text style={{paddingLeft:2, paddingRight:2, borderRadius:4,
              backgroundColor:Theme.themeColor, color:'#fff', fontSize:10}}>热帖</Text>
        <Text style={{fontSize:12, color:'#aaa'}}> 来自{status.group.groupname}</Text>
      </View>
    )
  }

}

