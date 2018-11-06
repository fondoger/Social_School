'use strict';
import React from 'react';
import {
  View, 
  Text, 
  Animated,
  StatusBar,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Theme from '../../utils/Theme';
import TimelinePage from './TimelinePage';
import TrendingPage from './TrendingPage';
import API from '../../utils/API_v1';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { IconFont, MyToast } from '../../components';
import SplashScreen from 'react-native-splash-screen'

/* Do this out of render method to avoid re-render when switching tabs */
const _TrendingPage = withNavigation(TrendingPage);
const _TimelinePage = withNavigation(TimelinePage);

/**
 * Note: Source code of "react-native-tab-view" was changed a little:
 * 1. Comment `tabStyle.opacity = opacity;` in `TabBar.js` 
 */

export default class HomeScreenTab extends React.Component {


  static navigationOptions = ({ navigation }) => ({
    header: null,
    title: '首页',
  });

  state = {
    index: 0,
    routes: [
      { key: 'first', title: '关注', index: 0 },
      { key: 'second', title: '推荐', index: 1 },
    ],
  };

  componentDidMount() {
    SplashScreen.hide();
  }

  renderTabBar = (props) => {
    return (
      <View 
        ref={ref=>this.ref1=ref}
        style={{flexDirection: 'row', paddingTop: Theme.statusBarHeight, 
            height: Theme.statusBarHeight + Theme.headerHeight,
            backgroundColor: Theme.themeColor, elevation: 1, shadowOpacity: 0}}>
        <View style={{flex: 4, alignItems: 'flex-start', justifyContent:'center'}} >
          <TouchableWithoutFeedback onPress={()=>{this.props.navigation.navigate('Common_SearchPage')}}>
            <View style={{flexDirection:'row', marginLeft: 8, backgroundColor:'rgba(255,255,255,.25)', borderRadius: 20, paddingVertical: 3, paddingLeft: 6, paddingRight: 10}}>
              <IconFont color='#fff' size={18} icon='&#xe623;' />
              <Text style={{color:'#fff', fontSize:15, marginLeft: 4}}>搜索</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TabBar 
          {...props}
          layout={{width: 160, height: Theme.headerHeight, measured: true}}
          style={styles.tabBar} 
          labelStyle={styles.tabLabel}
          indicatorStyle={styles.tabIndicator}
          useNativeDriver={true}
        />
        <View style={{flex: 4, alignItems: 'flex-end', justifyContent:'center'}} >
          <TouchableHighlight onPress={()=>{this.props.navigation.navigate('Status_NewStatusPage', {type:API.Status.USERSTATUS})}} >
            <View style={{flexDirection: 'row', justifyContent: 'center', height: Theme.headerHeight, alignItems:'center', padding: 8, backgroundColor: Theme.themeColor}}>
              <Text style={{fontSize: 15, color: '#fff', lineHeight: 24}}>发表</Text>
              <IconFont color='#fff' size={24} icon='&#xe66c;' />
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
          first: _TimelinePage,
          second: _TrendingPage,
        })}
        onIndexChange={(idx)=>this.setState({index: idx})}
        renderTabBar={this.renderTabBar}
        initialLayout={Dimensions.get('window')}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    width: 140 + 30 + 30, 
    elevation: 0, 
    shadowOpacity: 0,
    paddingLeft: 20,
    paddingRight: 20,
  },
  tabIndicator: {
    backgroundColor: '#fff', 
    width: 30,
    marginLeft: 25 + 20, 
    borderRadius: 1, 
    height: 1.5, 
    marginBottom: 5.5
  },
  tabLabel: {
    fontSize: 17, 
    lineHeight: 17, 
    paddingTop: 1.5,
  },
});
