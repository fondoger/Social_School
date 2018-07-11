'use strict';
import React from 'react';
import {
  View, 
  Text, 
  Button, 
  Image, 
  TouchableOpacity, 
  StatusBar, 
  Platform, 
  TouchableHighlight,
  Dimensions,
  StyleSheet,
} from 'react-native';

import Theme from '../utils/Theme';
import TimelinePage from './TimelinePage';
import TrendingPage from './TrendingPage';
import API from '../utils/API_v1';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { IconFont, MyToast } from '../components';


export default class HomeScreenTab extends React.Component {
  
  static navigationOptions = {
    title: '首页',
  }

  state = {
    index: 0,
    routes: [
      { key: 'first', title: '关注' },
      { key: 'second', title: '推荐' },
    ],
  };

  renderTabBar = (props) => {
    return (
      <View style={{flexDirection: 'row', height: Theme.headerHeight, backgroundColor: Theme.themeColor, elevation: 1, shadowOpacity: 0}}>
        <View style={{flex: 4, alignItems: 'flex-start'}} >
          <TouchableHighlight onPress={()=>{this.props.navigation.navigate('SearchPage')}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', height: 43, alignItems:'flex-end', width:48, padding: 8, backgroundColor:Theme.themeColor}}>
              <IconFont color='#fff' size={20} icon={'\ue623'} />
            </View>
          </TouchableHighlight>
        </View>
        <TabBar 
          {...props}
          layout={{width: 160, height: Theme.headerHeight, measured: true}}
          style={styles.tabBar} 
          labelStyle={styles.tabLabel}
          indicatorStyle={styles.tabIndicator}
        />
        <View style={{flex: 4, alignItems: 'flex-end'}} >
          <TouchableHighlight onPress={()=>{this.props.navigation.navigate('Status_NewStatusPage', {type:API.Status.USERSTATUS})}} >
            <View style={{flexDirection: 'row', justifyContent: 'center', height: 43, alignItems:'flex-end', padding: 8, backgroundColor:Theme.themeColor}}>
              <Text style={{fontSize: 15, color: '#fff', lineHeight: 22}}>发表</Text>
              <Text style={{fontFamily:'iconfont', fontSize:24, color:'#fff'}}>&#xe66c;</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>  
    );
  }

  render() {
    const _this = this;
    return (
      <TabView 
        navigationState={this.state}
        renderScene={SceneMap({
          first: () => <TimelinePage navigation={_this.props.navigation} screenProps={_this.props.screenProps}/>,
          second: () => <TrendingPage navigation={_this.props.navigation} screenProps={_this.props.screenProps}/>,
        })}
        onIndexChange={()=>{}}
        renderTabBar={this.renderTabBar}
        initialLayout={Dimensions.get('window')}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    width: 160, 
    elevation: 0, 
    shadowOpacity: 0,
  },
  tabIndicator: {
    backgroundColor: '#fff', 
    width: 30,
    marginLeft: 25, 
    borderRadius: 1.5, 
    height: 3, 
    marginBottom: 3
  },
  tabLabel: {
    fontSize: 18, 
    lineHeight: 18, 
    paddingTop: 2,
  },
});