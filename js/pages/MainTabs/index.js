'use strict';
import React from 'react';
import {
    Text,
  } from 'react-native';
import Theme from '../../utils/Theme'
import MyScreen from './MyScreen';
import HomeScreen from './HomeScreen';
import SquareScreen from './SquareScreen';
import DiscoverScreen from './DiscoverScreen';
import { createBottomTabNavigator } from 'react-navigation';

export default createBottomTabNavigator({
    Home: HomeScreen,
    Group: SquareScreen,
    Discover: DiscoverScreen,
    My: MyScreen,
}, {
        backBehavior: 'none',
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                const tabIcons = {
                    Home: { false: '\ue7c6', true: '\ue7c3' },
                    Group: { false: '\ue753', true: '\ue7f4' },
                    Discover: { false: '\ue699', true: '\ue620' },
                    My: { false: '\ue78b', true: '\ue78c' },
                };
                const iconStyle = {
                    fontFamily: 'iconfont',
                    fontSize: 27,
                    color: tintColor,
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
    }
);
