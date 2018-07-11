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
  StyleSheet,
  Vibration, 
  Dimensions, 
  BackHandler,
  ActivityIndicator,
  TouchableHighlight, 
  TouchableWithoutFeedback, 
} from 'react-native';
import Theme from '../utils/Theme';


const _window = require('Dimensions').get('window');
const ScreenWidth = _window.width;
const ScreenHeight = _window.height;

const MenuWidth = 160;
const MenuHeight = 48;

export default class SlideInMenu extends React.Component {

  static instance = null;

  static setInstance(instance) {
    if (instance instanceof SlideInMenu)
      ContextMenu.instance = instance;
    else
      console.error('instance is not SlideInMenu');
  }

  static getInstance() {
    if (this.instance === null) {
      console.error('Please call setInstance() first!');
    }
    return this.instance;
  }

  constructor(props) {
    super (props);
    this.state = {
      visible: false,
      options: [],
      renderSlideInComponent: null,
      componentHeight: 0,
      componentBounceValue: new Animated.Value(100),
    }
  }

  render() {
    if (!this.state.visible)
      return null
    return (
        <TouchableWithoutFeedback onPress={this.hideSlideInComponent}>
          <View style={{position:'absolute', top:0, right:0, left:0, bottom:0}}>
              <View style={{flex:1, backgroundColor:'#000', opacity:this.state.componentOverlayOpacity}} />
              <Animated.View
                style={{transform: [{translateY: this.state.componentBounceValue}], 
                        height:this.state.componentHeight, position:'absolute',
                        left:0, right:0, bottom:0}}
              >
                {this.state.renderSlideInComponent()}
              </Animated.View>
          </View>
        </TouchableWithoutFeedback>
    )
  }

  static showMenu(...args)  {
    const instance = getInstance();
    instance._showMenu(...args);
  }

  static showSlideInComponent(...args) {
    const instance = getInstance();
    instance._showSlideInComponent(...args);
  }

  static hideSlideInComponent(...args) {
    const instance = getInstance();
    instance.hideSlideInComponent(...args);
  }


  _showSlideInComponent(component, height, opacity=0.3) {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    this.setState({
      visible:true, 
      renderSlideInComponent:component, 
      componentHeight:height, 
      componentOverlayOpacity: opacity,
      type:3
    });
    Animated.spring(
      this.state.componentBounceValue,
      {
        toValue: 0,
        speed: 50,
        bounciness: 0,
        useNativeDriver: true
      }
    ).start();
  }

  _hideSlideInComponent() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    this.setState({componentOverlayOpacity: 0});
    Animated.spring(
      this.state.componentBounceValue,
      {
        toValue: this.state.componentHeight,
        speed: 50,
        bounciness: 0,
        useNativeDriver: true
      }
    ).start();
    setTimeout(()=>{
      this.setState({visible:false});
    }, 200);
  }

  _showMenu(items, selectedIndexCallback) {
    this.showSlideInComponent(()=>{
      return (
        <View style={{backgroundColor:'#fff', paddingTop:4, paddingBottom:4}}>
          {
            items.map((text, index)=>(
              <TouchableWithoutFeedback key={index.toString()} 
                  onPress={()=>{selectedIndexCallback(index); this.hideSlideInComponent();}}>
                <View style={{height:40, backgroundColor:'#fff', paddingLeft:16, justifyContent:'center'}}>
                  <Text style={{fontSize:16, color:'#222'}}>{text}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))
          }
        </View>
      )
    }, 40*items.length+8);
  }

  onBackButtonPressAndroid = () => {
    this.hideSlideInComponent();
    return true;
  }


}


