'use strict';
import React from 'react';
import {
  Text, 
  View,
  Modal,
  Easing, 
  Animated, 
  Keyboard,
  Platform,
  Component,
  StatusBar, 
  Vibration, 
  Dimensions, 
  BackHandler,
  ActivityIndicator,
  TouchableHighlight, 
  TouchableWithoutFeedback, 
} from 'react-native';
import Theme from '../utils/Theme';

export default class ModalMenu extends React.Component {

  constructor(props) {
    super (props);
    this.state = {
      visible: false,
      options: [],
      modalOpacity: new Animated.Value(0),
      contentOpacity: new Animated.Value(0),
      text: null,
      renderComponent: null,
    }
  }

  render() {
    if (!this.state.visible)
      return null
    return (
        <TouchableWithoutFeedback onPress={this.hide}>
          <View style={{top:0, left:0, right:0, bottom:0, position:'absolute',}}>
              <Animated.View style={{flex:1, backgroundColor:'#000', opacity:this.state.modalOpacity}} >
              </Animated.View>
              <Animated.View style={{top:0, left:0, right:0, bottom:0, opacity: this.state.contentOpacity,
                position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
                  <this.state.renderComponent hide={this.hide}/>
              </Animated.View>
          </View>
        </TouchableWithoutFeedback>
    )     
  }

  hide = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    Animated.timing(this.state.contentOpacity, {
      duration: 100,
      toValue: 0,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
    Animated.timing(this.state.modalOpacity, {
      duration: 100,
      toValue: 0,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
    setTimeout(()=>{
      this.setState({visible:false,})
    }, 50);
  }

  _show = (opacity=0.6) => {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
      Animated.timing(this.state.modalOpacity, {
        duration: 150,
        toValue: opacity,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }).start();
    setTimeout(()=>{
      // Animated.timing(this.state.contentOpacity, {
      //   duration: 50,
      //   toValue: 1,
      //   easing: Easing.out(Easing.cubic),
      //   useNativeDriver: true
      // }).start();
      this.state.contentOpacity.setValue(1);
    }, 80);
  }

  showLoading(text, modalOpacity=0.3) {
    this.setState({visible:true, renderComponent: this.renderLoading, text: text});
    this._show();
    return this.hide;
  }

  showMenu(options, modalOpacity=0.6) {
    this.setState({visible:true, renderComponent: this.renderOptions, options:options});
    this._show();
  }

  showComponent(component, modalOpacity=0.6) {
    this.setState({visible:true, renderComponent: component});
    this._show();
  }

  renderOptions = () => {
    return (
      <View style={{
          backgroundColor: '#fff',
          paddingTop:6, paddingBottom:6, borderRadius:3,}}>
        {
          this.state.options.map((item, i) => (
            <TouchableHighlight key={i} onPress={()=>{this.hide(); item.callback();}}>
              <View style={{backgroundColor: '#fff', justifyContent: 'center', height: 50, width: 250}} >
                <Text style={{color: '#222', fontSize: 16, paddingLeft:20,}}>{item.name}</Text>
              </View>
            </TouchableHighlight>
          ))
        }
      </View>
    );
  }

  renderLoading = () => {
    return (
      <View style={{backgroundColor:'#333', padding:16, borderRadius:5, 
                    width:200, alignItems:'center', flexDirection:'row'}}>
        <ActivityIndicator style={{marginRight:12,}} size='large' color="#999" />
        <Text style={{fontSize:16, color:'#bbb', flex:1}}>{this.state.text}</Text>
      </View>
    )
  }

  onBackButtonPressAndroid = () => {
    this.hide();
    return true;
  }

}