'use strict';
import React from 'react';
import { View, StyleSheet, Image, Text, Animated, Easing, StatusBar, Platform} from 'react-native';
import Theme from '../utils/Theme';

export default class MyToast extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      fadeAnim: new Animated.Value(0),          // 透明度初始值设为0
      color: null,
      showing: false,
    };
  }

  static instance = null;

  static setInstance(instance) {
    console.log(instance);
    if (instance instanceof MyToast)
      ContextMenu.instance = instance;
    else
      console.error('instance should be MyToast!');
  }

  static getInstance() {
    if (this.instance === null) {
      console.error('Please call setInstance() first!');
    }
    return this.instance;
  }

  static show(...args) { 
    const instance = getInstance();
    this.thisObject._show(...args);
  }

  static INFO = '#288EFB';
  static WARNING = '#ffdd00';
  static ERROR = '#e23602';
  static LONG = 3000;
  static SHORT = 1000;

  _show(text, arg) {
    const type = arg && arg.type === 'warning' ? MyToast.WARNING :
                 arg && arg.type === 'error' ? MyToast.ERROR : MyToast.INFO;
    const length = arg && arg.length === 'long' ? MyToast.LONG : MyToast.SHORT;
    console.log(`showToast called! text=${text} arg=${arg} length=${length}, type=${type} `);
    this.setState({text:text, color:type, showing:true});
    setTimeout(()=>{
      this.setState({showing: false});
    }, length+400);
    Animated.sequence([
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }
      ),
      Animated.timing(                            // 随时间变化而执行的动画类型
        this.state.fadeAnim,                      // 动画中的变量值
        {
          delay:length,
          toValue: 0,                             // 透明度最终变为1，即完全不透明
          duration: 300,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }

  render() {
    if (!this.state.showing)
      return null
    return (
      <Animated.View style={{flex:1, backgroundColor:'#f0f0f0', position:'absolute', top:Theme.headerHeight + Theme.statusBarHeight,
                flexDirection:'row', left:0, padding:6, elevation:1, shadowColor: '#000',
                shadowRadius: 3, shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.5, opacity: this.state.fadeAnim,}}>
        <View style={{flex:1, justifyContent:'center', alignItems:'center',}}>
          <Text style={{color:this.state.color, fontSize:15, lineHeight: 24}}>{this.state.text}</Text>
        </View>
      </Animated.View>
    )
  }
}
