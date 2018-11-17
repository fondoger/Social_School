import React from 'react';
import { 
  Text, 
  View, 
  Easing,
  Animated, 
  StatusBar, 
  AppRegistry, 
} from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import MyScreen from './js/pages/MainTabs/MyScreen';
import HomeScreen from './js/pages/MainTabs/HomeScreen';
import GroupScreen from './js/pages/MainTabs/SquareScreen';
//import GroupScreen from './js/pages/GroupScreen';
import DiscoverScreen from './js/pages/MainTabs/DiscoverScreen';
import Theme from './js/utils/Theme';
import KebiaoPage from './js/pages/KebiaoPage';
import WechatArticlePage from './js/pages/WechatArticlePage';
import {
  MyToast,
  ModalMenu,
  ContextMenu,
  SlideInMenu,
  HeaderLeft,
} from './js/components';

import Common_LoginPage from './js/pages/Common/LoginPage';
import Common_RegisterPage from './js/pages/Common/RegisterPage';
import Common_SettingPage from './js/pages/Common/SettingPage';
import Common_SearchPage from './js/pages/Common/SearchPage';
import Common_WebviewPage from './js/pages/Common/WebviewPage';
import Common_PhotoViewPage from './js/pages/Common/PhotoViewPage';
import Common_MediumTransPage from './js/pages/Common/MediumTransPage';

import Status_StatusPage from './js/pages/Status/StatusPage';
import Status_TopicPage from './js/pages/Status/TopicPage';
import Status_NewStatusPage from './js/pages/Status/NewStatusPage';

import User_ChatPage from './js/pages/User/ChatPage';
import User_QRCodePage from './js/pages/User/QRCodePage';
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

import Other_OfficialAccountPage from './js/pages/Other/OfficialAccountPage';

// Remove react-navigation Bug warning, temporarily solution
// import { YellowBox } from 'react-native'; 
// YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


const MainTabs = createBottomTabNavigator({
  Home: HomeScreen,
  Group: GroupScreen,
  Discover: DiscoverScreen,
  My: MyScreen,
}, {  
  backBehavior: 'none',
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      const tabIcons = {
        Home: {false: '\ue7c6', true: '\ue7c3'},
        Group: {false: '\ue753', true: '\ue7f4'},
        Discover: {false: '\ue699', true: '\ue620'},
        My: {false: '\ue78b', true: '\ue78c'},
      };
      const iconStyle = {
        fontFamily:'iconfont', 
        fontSize:27, 
        color:tintColor,
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
  //header: <View style={{height: Theme.statusBarHeight, backgroundColor: Theme.themeColor}}/>, 
  header: null,
}

const RootStack = createStackNavigator({
  MainTabs,
  KebiaoPage,
  WechatArticlePage,
  Common_LoginPage,
  Common_RegisterPage,
  Common_SettingPage,
  Common_SearchPage,
  Common_WebviewPage,
  Common_PhotoViewPage,
  Common_MediumTransPage,
  Status_StatusPage,
  Status_TopicPage,
  Status_NewStatusPage,
  User_ChatPage,
  User_QRCodePage,
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
  Other_OfficialAccountPage,
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
    headerLeft: HeaderLeft,
  }),
  transitionConfig : () => ({
  	transitionSpec: {
  		duration: 0,
  		timing: Animated.timing,
  		easing: Easing.step0,
  	},
  }),
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
      if (currentRouteName.slice(0,4) === 'Sale' || 
          currentRouteName === 'Status_StatusPage' ||
          currentRouteName === 'Common_WebviewPage') {
        StatusBar.setBarStyle('dark-content');
      } else if (['KebiaoPage'].includes(currentRouteName)) {
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('light-content');
      }
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        <StatusBar translucent={true} backgroundColor='rgba(0,0,0,0)' barStyle="light-content"/>
        <RootStack
          onNavigationStateChange={this.handleNavigationStateChange}
        />
        <MyToast ref={(ref)=>{MyToast.setInstance(ref);}} />
        <ContextMenu ref={(ref)=>{ContextMenu.setInstance(ref);}} />
        <SlideInMenu ref={(ref)=>{SlideInMenu.setInstance(ref);}} />
        <ModalMenu ref={(ref)=>{ModalMenu.setInstance(ref);}} />
      </View>
    )
  }

  componentDidCatch() {
    MyToast.show("Caught a error in App");
  }

}

//import ExploadingHeats from './js/components/ExplosionHeart';
AppRegistry.registerComponent('Social_BUAA', () => App);
