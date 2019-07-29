/**
 * @format
 */
'use strict';
import React from 'react'
import {
  View,
  StatusBar,
  AppRegistry,
} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import MainTabs from './js/pages/MainTabs'
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
import User_UserPage from './js/pages/User/UserPage';
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

const RootStackNavigator = createStackNavigator({
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
  User_UserPage,
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
    defaultNavigationOptions: ({ navigation }) => ({
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
  }
);

const AppContainer = createAppContainer(RootStackNavigator);
class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent={true} backgroundColor='rgba(0,0,0,0)' barStyle="light-content" />
        <AppContainer
          onNavigationStateChange={this.handleNavigationStateChange}
        />
        <MyToast ref={(ref) => { MyToast.setInstance(ref); }} />
        <ContextMenu ref={(ref) => { ContextMenu.setInstance(ref); }} />
        <SlideInMenu ref={(ref) => { SlideInMenu.setInstance(ref); }} />
        <ModalMenu ref={(ref) => { ModalMenu.setInstance(ref); }} />
      </View>
    );
  }
}


import { name as appName } from './app.json';
AppRegistry.registerComponent(appName, () => App);
