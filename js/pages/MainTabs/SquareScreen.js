'use strict';
import React from 'react';
import {
  StyleSheet, 
  Text,
  View,
  Button,
  FlatList,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Swiper from 'react-native-swiper';
import { TabNavigator, TabBarTop } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Storage from '../../utils/Storage';
import { Loading, MyToast } from '../../components';

function SearchHeader(props) {
  return (
    <View style={{backgroundColor: Theme.themeColor,
                  height: Theme.headerHeight + Theme.statusBarHeight, justifyContent: 'center', 
                  paddingLeft: 16, paddingTop: Theme.statusBarHeight}}>
      <Text style={{fontSize: 18, color: '#fff'}}>{props.title}</Text>
    </View>
  )
}

export default class SquareScreen extends React.Component {

  render() {
    return (
      <View style={{flex: 1}} >
        <SearchHeader />
      </View>
    )
  }
}