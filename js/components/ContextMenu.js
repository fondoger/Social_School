'use strict';
import React from 'react';
import {
  Text,
  View,
  Modal,
  Easing,
  Animated,
  Platform,
  Vibration,
  BackHandler,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import { IconFont } from './Utils';
import Theme from '../utils/Theme';

const _window = require('Dimensions').get('window');
const ScreenWidth = _window.width;
const ScreenHeight = _window.height;

const MenuWidth = 200;
const MenuHeight = 48;

export default class ContextMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      options: [],
      scaleAnim: new Animated.Value(0),
      opaciAnim: new Animated.Value(0),
      posX: 0,
      posY: 0,
      withIcon: false,
    }
  }

  renderOption = (option) => {
    return (
      <View style={{ backgroundColor: '#fff', justifyContent: 'center', height: MenuHeight, width: MenuWidth }} >
        <Text style={{ color: '#333', fontSize: 16, paddingLeft: 16, }}>{option[0]}</Text>
      </View>
    )
  };

  renderOptionWithIcon = (option) => {
    return (
      <View style={{
        backgroundColor: '#fff', alignItems: 'center',
        height: MenuHeight, width: MenuWidth, flexDirection: 'row',
      }} >
        <IconFont icon={option[1]} color='#333' size={20} style={{ paddingLeft: 15, paddingRight: 15 }} />
        <Text style={{ flex: 1, color: '#333', fontSize: 16, lineHeight: 20 }}>{option[0]}</Text>
      </View>
    )
  };

  render() {
    const { visible, withIcon, options } = this.state;
    if (!visible)
      return null;
    return (
      <TouchableWithoutFeedback onPress={this._hide}>
        <View style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'absolute' }}>
          <Animated.View style={{
            position: 'absolute', left: this.state.posX, top: this.state.posY,
            transform: [{ scale: this.state.scaleAnim }], elevation: 8,
            borderRadius: 3, opacity: this.state.opaciAnim, overflow: 'hidden'
          }}>
            {
              options.map((option, index) => (
                <TouchableHighlight
                  key={index.toString()} onPress={() => {
                    const callback = withIcon ? option[2]: option[1];
                    callback();
                    setTimeout(this._hide, 150);
                  }}
                  underlayColor="#a0a0a0"
                >
                  {withIcon ? this.renderOptionWithIcon(option) : this.renderOption(option)}
                </TouchableHighlight>
              ))
            }
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  static instance = null;

  static setInstance(instance) {
    if (instance != null) {
      if (instance instanceof ContextMenu)
        ContextMenu.instance = instance;
      else
        console.error('instance is not ContextMenu');
    }
  }

  static getInstance() {
    if (this.instance === null) {
      console.error('Please call setInstance() first!');
    }
    return this.instance;
  }

  static showIconMenu(...args) {
    const instance = ContextMenu.getInstance();
    instance.setState({ withIcon: true });
    instance._show(...args);
  }

  static showMenu(...args) {
    const instance = ContextMenu.getInstance();
    instance.setState({ withIcon: false });
    instance._show(...args);
  }

  _show(options, event, vibrate = false) {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    if (vibrate)
      Vibration.vibrate(Platform.OS === 'ios' ? [0] : [0, 15]);
    let { pageX, pageY } = event.pageX ? event : event.nativeEvent;
    if (pageX > ScreenWidth / 2)
      pageX -= MenuWidth;
    if (pageY > ScreenHeight / 2)
      pageY -= options.length * MenuHeight;
    this.setState({ visible: true, options: options, posX: pageX, posY: pageY });
    Animated.timing(this.state.scaleAnim, {
      duration: 120,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
    Animated.timing(this.state.opaciAnim, {
      duration: 120,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  _hide = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    Animated.timing(this.state.opaciAnim, {
      duration: 300,
      toValue: 0,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      this.setState({ visible: false });
      this.state.scaleAnim.setValue(0);
    }, 150);
  };

  onBackButtonPressAndroid = () => {
    this._hide();
    return true;
  };

}


