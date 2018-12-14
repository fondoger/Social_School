'use strict';
import React from 'react';
import {
  StyleSheet,
  Alert,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API, { timeoutFetch } from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { MyToast, UserAvatar, IconFont } from '../../components';


function Header(props) {
  return (
    <View style={{backgroundColor: Theme.themeColor,
                  height: Theme.headerHeight + Theme.statusBarHeight, justifyContent: 'center', 
                  paddingLeft: 16, paddingTop: Theme.statusBarHeight}}>
      <Text style={{fontSize: 18, color: '#fff'}}>{props.title}</Text>
    </View>
  )
}

function RowButton(props) {
  let { icon, title, color, onPress } = props;
  icon = icon || '\ue659';
  title = title || 'Custom Title';
  color = color || Theme.themeColor;
  return (
    <TouchableHighlight style={{ marginBottom: 8 }} onPress={onPress || null}>
      <View style={styles.item} >
        <IconFont style={styles.toolIcon} icon={icon} color={color} size={24} />
        <Text style={styles.item_text}>{title}</Text>
      </View>
    </TouchableHighlight>
  )
}

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
    this.props.navigation.addListener('willFocus', (playload) => {
      this.setState({ user: Storage.user });
      if (Storage.user) {
        API.User.get({ 'id': Storage.user.id }, (responseJson) => {
          Storage.setItem('user', responseJson);
          this.setState({ user: responseJson });
        })
      }
    });
  }

  renderRowItem(title, icon, color, onPress) {
    return (
      <TouchableHighlight style={styles.toolItem}
        onPress={onPress}>
        <View style={styles.toolItemWrapper}>
          <IconFont style={styles.toolIcon} size={28} icon={icon} color={color} />
          <Text style={styles.toolText}>{title}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    const user = this.state.user;
    return (
      <View style={styles.container}>
        <Header title="我"/>
        <View style={{height: 16}} />
        <TouchableHighlight style={styles.row} underlayColor={Theme.btnActiveBackground}
          onPress={this.onUserPress}>
          <View style={styles.rowUser}>
            {user ? <UserAvatar {...this.props} user={user} size={64} hideLogo={true} /> : null}
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user ? user.username : '未登录'}</Text>
              <Text style={styles.userType}>{user ? '未认证用户' : '登陆畅享更多功能'}</Text>
            </View>
            { user ? 
              <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('User_QRCodePage', { user })}>
                <IconFont style={{ padding: 4 }} icon='&#xe690;' size={26} color='#888' />
              </TouchableWithoutFeedback>
              : null
            }
          </View>
        </TouchableHighlight>
        <View style={[styles.row, styles.rowTools]}>
          <Text style={styles.rowTitle}>教务服务</Text>
          <View style={styles.toolContainer}>
            <CellItem title="课表" icon="&#xe612;" color="#ff9800" onPress={this.handleCourseOnPress} />
            <CellItem title="校车" icon="&#xe67a;" color="#00bcd4" onPress={this.handleBusOnPress} />
            <CellItem title="图书馆" icon="&#xe7a9;" color="#a671ff" onPress={this.handleBoYaOnPress} />
            <CellItem title="校历" icon="&#xe613;" color="#2196f3" onPress={this.handleCalendarOnPress} />
          </View>
        </View>
        <RowItem title="聊天" icon="&#xe6eb;" color="#1296db" onPress={() => this.props.navigation.navigate('User_MessagePage')} />
        <RowItem title="收藏" icon="&#xe618;" color="#dd6145" onPress={() => MyToast.show("功能开发中")} />
        <RowItem title="设置" icon="&#xe656;" color="#3498eb" onPress={() => this.props.navigation.navigate('Common_SettingPage')} />
      </View>
    );
  }

  onUserPress = () => {
    if (this.state.user)
      this.props.navigation.navigate('User_UserPage', { user: this.state.user });
    else
      this.props.navigation.navigate('Common_LoginPage');
  }
  handleCourseOnPress = () => {
    Alert.alert(
      '提示信息',
      '本服务由信息北航微信公众号提供。',
      [
        {text: '不再显示', onPress: () => console.log('Ask me later pressed')},
        {text: '我已知晓', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
    const timetable = "https://app.buaa.edu.cn/timetable/wap/default/index";
    this.props.navigation.navigate("Common_WebviewPage", {url: timetable});
  }
  handleBusOnPress = () => {
    Alert.alert(
      '提示信息',
      '本服务由信息北航微信公众号提供。',
      [
        {text: '不再显示', onPress: () => console.log('Ask me later pressed')},
        {text: '我已知晓', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
    const bus = "https://app.buaa.edu.cn/regularbus/wap/default/index?bus_id=6";
    this.props.navigation.navigate("Common_WebviewPage", {url: bus});
  }
  handleBoYaOnPress = () => {
    Alert.alert(
      '提示信息',
      '本服务由北航图书馆微信公众号提供。（PS：页面内登陆账号与图书馆网站账号相同）',
      [
        {text: '不再显示', onPress: () => console.log('Ask me later pressed')},
        {text: '我已知晓', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
    const lib = "http://wx.lib.buaa.edu.cn";
    this.props.navigation.navigate("Common_WebviewPage", {url: lib});
  }
  handleCalendarOnPress = () => {
    Alert.alert(
      '提示信息',
      '本服务由信息北航微信公众号提供。',
      [
        {text: '不再显示', onPress: () => console.log('Ask me later pressed')},
        {text: '我已知晓', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
    const calendar = "https://app.buaa.edu.cn/schedule/wap/default/index";
    this.props.navigation.navigate("Common_WebviewPage", {url: calendar});
  }
}

const RowItem = ({icon, color, title, onPress}) => (
  <TouchableHighlight style={{ marginBottom: 8 }} underlayColor='#222' onPress={onPress}>
    <View style={styles.item} >
      <IconFont style={{marginHorizontal: 18}} icon={icon} color={color} size={24} />
      <Text style={styles.item_text}>{title}</Text>
    </View>
  </TouchableHighlight>
);

const CellItem = ({icon, color, title, onPress}) => (
  <TouchableHighlight style={styles.toolItem}
    onPress={onPress}>
    <View style={styles.toolItemWrapper}>
      <IconFont style={styles.toolIcon} size={28} icon={icon} color={color} />
      <Text style={styles.toolText}>{title}</Text>
    </View>
  </TouchableHighlight>
);


const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.backgroundColorLight,
    flex: 1,
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
    margin: 12,
    marginBottom: 8,
  },
  toolItem: {
    flex: 1,
  },
  toolItemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingBottom: 8,
  },
  toolText: {
    color: '#444',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 12,
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
    color: '#222',
    fontSize: 16,
  }
});

