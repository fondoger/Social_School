'use strict';
import React from 'react';
import { WebView } from 'react-native';

var jsCode = 'var a=document.getElementById("meta_content"); var b=a.getElementsByTagName("a")[0]; b.style.display="inline-block"; a.getElementsByTagName("span")[0].style.display="none"; b.href="https://no_such_options.com"; b.id=""; b.onclick=function(){location.href="https://no_such_options.com"}';
    
export default class WebviewPage extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      url: navigation.state.params.url,
      title: navigation.state.params.title | '',
    };
  };

  render() {
    return (
      <WebView
        injectedJavaScript={jsCode}
        source={{uri: this.props.navigation.state.params.url}}
        onNavigationStateChange={this._onNavigationStateChange}
      />
    )
  }

  _onNavigationStateChange = (navState) => {
    console.log(navState);
    if (navState.canGoBack) {
      this.props.navigation.setParams({title: navState.title});
    }
  }
}

