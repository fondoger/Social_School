'use strict';
import React from 'react';
import {
  View,
  BackHandler,
  ActivityIndicator,
  TouchableHighlight
 } from 'react-native';
import { MyToast, IconFont } from '../../components';
import { Theme } from '../../utils';
import { WebView } from 'react-native-webview';

export default class WebviewPage extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      url: navigation.state.params.url,
      title: navigation.state.params.title || '',
      headerTintColor: '#222',
      headerLeft: ({ tintColor }) => (
        <TouchableHighlight onPress={()=>navigation.goBack()} underlayColor='#888'>
          <IconFont icon='&#xe624;'
            style={{ width: 40, height: Theme.headerHeight - 1, paddingTop: 1.5,
                     alignItems: 'center', backgroundColor: '#fafafa'}}
            size={20} color='#111' />
        </TouchableHighlight>
      ),
      headerStyle: {
        paddingTop: Theme.statusBarHeight,
        height: Theme.headerHeight + Theme.statusBarHeight,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: '#fafafa',
      },
      headerTitleStyle: { color: '#222', fontSize:17, marginRight: 12, marginLeft: 0, fontWeight:'normal' },
      headerTitleContainerStyle: { left: 40 },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  onBackButtonPressAndroid = () => {
    if (this.state.canGoBack && this.webview) {
      this.webview.goBack();
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{uri: this.props.navigation.state.params.url}}
          onNavigationStateChange={this._onNavigationStateChange}
          onLoadEnd={() =>  this.progressIndicator.setNativeProps({opacity: 0})}
          onLoadStart={() =>  this.progressIndicator.setNativeProps({opacity: 1})}
          injectedJavaScript={ this.props.navigation.state.params.injectedJavaScript }
          ref={ref=>this.webview=ref}
        />
        <ActivityIndicator
          style={{ position: "absolute", top: 16, left: 15 }}
          size="large"
          ref={ref=>this.progressIndicator=ref}
        />
      </View>
    )
  }

  _onNavigationStateChange = (navState) => {
    this.state.canGoBack = navState.canGoBack;
    this.props.navigation.setParams({title: navState.title || 'Loading...'});
  }

}

