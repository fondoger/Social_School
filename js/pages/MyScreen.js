'use strict';
import React from 'react';
import {
  StyleSheet, 
  Text,
  View,
  Button,
  FlatList,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StackNavigator,
} from 'react-native';
import Theme from '../utils/Theme';
import API from '../utils/API_v1';
import Storage from '../utils/Storage';
import { MyToast, UserAvatar, IconFont } from '../components';

export default class MyScreen extends React.Component {
  static navigationOptions = {
    title: '我',
  }
  constructor(props) {
    super(props);
    this.state = {
      tools: {
        'Kebiao': 0,
        'Xiaoche': 1,
        'Bykt': 2,
        'Other': 3,
      },
      user: Storage.user,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', (playload)=>{
      this.setState({user: Storage.user});
      if (Storage.user) {
        API.User.get({'id':Storage.user.id}, (responseJson)=>{
          Storage.setItem('user',responseJson);
          this.setState({user: responseJson});
        })
      }
    });
  }

  render() {
    const user = this.state.user;
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.row} underlayColor={Theme.btnActiveBackground}
          onPress={this.onUserPress}>
            <View style={styles.rowUser}>
              { user ? <UserAvatar {...this.props} user={user} size={64} hideLogo={true}/>: null }
              <View style={styles.userInfo}>
                <Text style={styles.username}>{user?user.username:'未登录'}</Text>
                <Text style={styles.userType}>{user?'未认证用户':'登陆畅享更多功能'}</Text>
              </View>
              <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('User_QRCodePage', {user})}>
              <IconFont style={{padding: 4, backgroundColor: '#fff'}} icon='&#xe690;' size={26} color='#888' />
              </TouchableWithoutFeedback>
            </View>
        </TouchableHighlight>
        <View style={[styles.row, styles.rowTools]}>
          <Text style={styles.rowTitle}>教务服务</Text>
          <View style={styles.toolContainer}>
            <TouchableHighlight style={styles.toolItem} underlayColor={Theme.btnActiveBackground}
             onPress={this._toolCallback.bind(this, this.state.tools.Kebiao)}>
              <View style={styles.toolItemWrapper}>
                <Image style={styles.toolIcon} source={require('../../img/timetable.png')} />
                <Text style={styles.toolText}>课表</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.toolItem} underlayColor={Theme.btnActiveBackground}
             onPress={this._toolCallback.bind(this, this.state.tools.Xiaoche)}>
              <View style={styles.toolItemWrapper}>
                <Image style={styles.toolIcon} source={require('../../img/bus.png')} />
                <Text style={styles.toolText}>校车</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.toolItem} underlayColor={Theme.btnActiveBackground}
             onPress={this._toolCallback.bind(this, this.state.tools.Bykt)}>
              <View style={styles.toolItemWrapper}>
                <Image style={styles.toolIcon} source={require('../../img/bykt.png')} />
                <Text style={styles.toolText}>博雅</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.toolItem} underlayColor={Theme.btnActiveBackground}
             onPress={this._toolCallback.bind(this, this.state.tools.Other)}>
              <View style={styles.toolItemWrapper}>
                <Image style={styles.toolIcon} source={require('../../img/query.png')} />
                <Text style={styles.toolText}>其他</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
        {/*
        <View style={[styles.row, styles.rowTools, {flex:1, marginBottom:16}]}>
          <Text style={styles.rowTitle}>我的消息</Text>
          <View style={[styles.toolContainer, {flex:1, justifyContent:'center', alignItems: 'center'}]}>
            <Text>收到新私信: 一封邀您加入创业团队的邀请函.</Text>
          </View>
        </View> */}
        <TouchableHighlight style={{marginBottom:8}} underlayColor='#222' onPress={()=>this.props.navigation.navigate('User_MessagePage')}>
          <View style={styles.item} >
            <Image style={styles.item_icon} source={require('../../img/setting.png')}/>
            <Text style={styles.item_text}>我的消息</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{marginBottom:8}} underlayColor='#222' onPress={()=>MyToast.show('功能开发中')}>
          <View style={styles.item} >
            <Image style={styles.item_icon} source={require('../../img/collection.png')}/>
            <Text style={styles.item_text}>收藏</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{marginBottom:8}} underlayColor='#222' onPress={()=>this.props.navigation.navigate('Common_SettingPage')}>
          <View style={styles.item} >
            <Image style={styles.item_icon} source={require('../../img/setting.png')}/>
            <Text style={styles.item_text}>设置</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  onUserPress = () => {
    if (this.state.user)
      this.props.navigation.navigate('User_ProfilePage', {user:this.state.user});
    else
      this.props.navigation.navigate('Common_LoginPage');
  }

  _toolCallback(who) {
    const tools = this.state.tools;
    if (who == tools.Kebiao) {
      MyToast.show('功能开发中');
    }
    else if (who == tools.Xiaoche) {
      MyToast.show(Storage.user.username);
    }
    else if (who == tools.Bykt)
      MyToast.show('功能开发中');
    else if (who == tools.Other)
      MyToast.show('功能开发中');
  }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: Theme.pageBackgroundColor,
      flex: 1,
      paddingTop: 16,
    },
    row: {
      backgroundColor: '#fff',
      marginBottom: 16,
    },
    rowTitle: {
      marginLeft: 16,
      marginRight: 16,
      paddingTop: 4,
      paddingBottom: 4,
      borderBottomColor: Theme.borderColor,
      borderBottomWidth: Theme.borderWidth,
    },
    rowUser: {
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    userInfo: {
      paddingTop: 4,
      marginLeft: 12,
      flex: 1,
    },
    username: {
      fontSize: 16,
      color: '#000',
    },
    userType: {
      marginTop: 8,
      color: '#888',
      fontSize: 14,
    },
    rowTools: {

    },
    toolContainer: {
      flexDirection: 'row',
    },
    toolIcon: {
      height: 32,
      width: 32,
      margin: 12,
      marginBottom: 8,
    },
    toolItem: {
      flex: 1,
      paddingBottom: 8,
    },
    toolItemWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    toolText: {
      color: '#888',

    },
    item: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    item_icon: {
      width: 26,
      height: 26,
      marginTop: 12,
      marginBottom: 10,
      marginLeft: 16,
      marginRight: 16,
    },
    item_text: {
      color: '#000',
      fontSize: 17,
    }
});

