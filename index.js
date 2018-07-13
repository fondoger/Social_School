import React from 'react';
import { AppRegistry, Button, StyleSheet, Image, Text, View, StatusBar, Platform, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import MyScreen from './js/pages/MyScreen';
import HomeScreen from './js/pages/HomeScreen';
import GroupScreen from './js/pages/GroupScreen';
import DiscoverScreen from './js/pages/DiscoverScreen';
import Theme from './js/utils/Theme';
import KebiaoPage from './js/pages/KebiaoPage';
import WechatArticlePage from './js/pages/WechatArticlePage';
import {
  MyToast,
  ModalMenu,
  ContextMenu,
  SlideInMenu,
} from './js/components';


import Common_LoginPage from './js/pages/Common/LoginPage';
import Common_RegisterPage from './js/pages/Common/RegisterPage';
import Common_SettingPage from './js/pages/Common/SettingPage';
import Common_ImageViewerPage from './js/pages/Common/ImageViewerPage';
import Common_SearchPage from './js/pages/Common/SearchPage';

import Status_StatusPage from './js/pages/Status/StatusPage';
import Status_TopicPage from './js/pages/Status/TopicPage';
import Status_NewStatusPage from './js/pages/Status/NewStatusPage';

import User_ChatPage from './js/pages/User/ChatPage';
import User_MessagePage from './js/pages/User/MessagePage';
import User_ProfilePage from './js/pages/User/ProfilePage';
import User_EditProfilePage from './js/pages/User/EditProfilePage';
import User_EditUsernamePage from './js/pages/User/EditUsernamePage';
import User_EditSelfIntroPage from './js/pages/User/EditSelfIntroPage';
import User_RelationshipsPage from './js/pages/User/RelationshipsPage';

import Group_GroupPage from './js/pages/Group/GroupPage';

import Sale_SquarePage from './js/pages/Sale/SquarePage';
import Sale_SalePage from './js/pages/Sale/SalePage';
import Sale_PersonalPage from './js/pages/Sale/PersonalPage';
import Sale_EditSalePage from './js/pages/Sale/EditSalePage';

import MediumTransPage from './js/pages/Common/MediumTransPage';

// Remove react-navigation Bug warning, temporarily solution
import { YellowBox } from 'react-native'; 
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


const MainTabs = createBottomTabNavigator({
  Home: HomeScreen,
  Group: GroupScreen,
  Discover: DiscoverScreen,
  My: MyScreen,
}, {  
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      const tabIcons = {
        Home: {false: '\ue7c6', true: '\ue7c3'},
        Group: {false: '\ue753', true: '\ue7f4'},
        Discover: {false: '\ue61f', true: '\ue620'},
        My: {false: '\ue716', true: '\ue715'},
      };
      const iconStyle = {
        fontFamily:'iconfont', 
        fontSize:26, 
        color:tintColor
      };
      const iconName = tabIcons[routeName][focused];
      return <Text style={iconStyle}>{iconName}</Text>
    },
  }),
  tabBarOptions: {
    activeTintColor: Theme.themeColor,
    style: {
      height: Theme.tabBarHeight,
      backgroundColor: '#FFFFFF',
      borderTopWidth: .5,
      borderTopColor: '#d6d6d6',
    },
    labelStyle: {
      marginBottom: 5,
      fontSize: 12,
      marginTop: -4,
    }
  },
});

MainTabs.navigationOptions = {
  header: <View style={{height: Theme.statusBarHeight, backgroundColor: Theme.themeColor}}/>,
}

const RootStack = createStackNavigator({
  MainTabs,
  KebiaoPage,
  WechatArticlePage,
  Common_LoginPage,
  Common_RegisterPage,
  Common_ImageViewerPage,
  Common_SettingPage,
  Common_SearchPage,
  Status_StatusPage,
  Status_TopicPage,
  Status_NewStatusPage,
  User_ChatPage,
  User_MessagePage,
  User_ProfilePage,
  User_EditProfilePage,
  User_EditUsernamePage,
  User_EditSelfIntroPage,
  User_RelationshipsPage,
  Group_GroupPage,
  Sale_SquarePage,
  Sale_SalePage,
  Sale_PersonalPage,
  Sale_EditSalePage,
  MediumTransPage,
}, {
  headerMode: 'screen',
  navigationOptions: ({navigation}) => ({
    headerStyle: {
      paddingTop: Theme.statusBarHeight,
      height: Theme.headerHeight + Theme.statusBarHeight,
      elevation: 0,
      shadowOpacity: 0,
      backgroundColor: Theme.themeColor,
    },
    headerTitleStyle: {
      fontWeight: 'normal',
      fontSize: 18,
    },
    headerTintColor: '#ffffff',
    gesturesEnabled: true,
    headerLeft: ({tintColor}) => (
      <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
        <View style={{width:60, alignItems:'center', padding:12, paddingTop:13}}>
          <Text style={{fontFamily:'iconfont', fontSize:24, color:tintColor,}}>&#xe622;</Text>
        </View>
      </TouchableWithoutFeedback>
    ),
  }),
//   transitionConfig: ()=> {
//     return {
//       screenInterpolator: (sceneProps) => {
//         const { scenes } = sceneProps;
//         const topRouteName = scenes[scenes.length-1].route.routeName;
//         if (topRouteName.slice(0,4) === 'Sale' || topRouteName === 'Status_StatusPage') {
//           StatusBar.setBarStyle('dark-content');
//         } else {
//           StatusBar.setBarStyle('light-content');
//         }
//     }
//   }
// },
});

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}


class App extends React.Component {

  handleNavigationStateChange = (prevState, currentState) => {
    // For StatusBar background color
    const currentRouteName = getActiveRouteName(currentState);
    const prevRouteName = getActiveRouteName(prevState);
    if (currentRouteName != prevRouteName) {
      if (currentRouteName.slice(0,4) === 'Sale' || currentRouteName === 'Status_StatusPage') {
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('light-content');
      }
    }
  }

  screenProps = new Object();

  render() {
    return (
      <View style={{flex:1}}>
        <StatusBar translucent={true} backgroundColor='rgba(0,0,0,0)' barStyle="light-content"/>
        <RootStack
          screenProps={this.screenProps}
          onNavigationStateChange={this.handleNavigationStateChange}
        />
        <MyToast ref={(ref)=>{MyToast.setInstance(ref);}} />
        <ContextMenu ref={(ref)=>{ContextMenu.setInstance(ref);}} />
        <SlideInMenu ref={(ref)=>{SlideInMenu.setInstance(ref);}} />
        <ModalMenu ref={(ref)=>{ModalMenu.setInstance(ref);}} />
      </View>
    )
  }

}


AppRegistry.registerComponent('Social_BUAA', () => App);
