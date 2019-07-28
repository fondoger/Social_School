import React from 'react';

import {
  AppRegistry,
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import { IconFont } from './Utils';



export default class ExplodingHearts extends React.Component {

  state = {
    // purpleCircleScale: new Animated.Value(0.01),
    // purpleCircleMaskScale: new Animated.Value(0.01),
    // //purpleCircleOpacity: new Animated.Value(1),
    // contentScale: new Animated.Value(0.01),
    animation: new Animated.Value(0),
  };

  setInitialState() {
    //this.state.purpleCircleScale.setValue(0.01);
    //this.state.purpleCircleMaskScale.setValue(0.01);
    //this.state.purpleCircleOpacity.setValue(1);
    //this.state.contentScale.setValue(0.01);
    this.state.animation.setValue(0);
  }

  startAnimate() {
    this.setInitialState();
    // const purpleCircleExpand = Animated.timing(this.state.purpleCircleScale, {
    //   duration: 200,
    //   toValue: 1,
    //   isInteraction: false,
    //   useNativeDriver: true,
    //   easing: Easing.in(Easing.linear),      
    // });
    // const purpleCircleMaskExpand = Animated.timing(this.state.purpleCircleMaskScale, {
    //   duration: 200,
    //   toValue: 1,
    //   isInteraction: false,
    //   useNativeDriver: true,
    //   easing: Easing.in(Easing.linear),     
    // });
    // // const contentExpand = Animated.timing(this.state.contentScale, {
    // //   duration: 200,
    // //   toValue: 1,
    // //   isInteraction: false,
    // //   useNativeDriver: true,
    // //   easing: Easing.linear,
    // //   delay: 40,
    // // });
    // Animated.sequence([
    //   purpleCircleExpand,
    //   purpleCircleMaskExpand,
    // ]).start();
    Animated.timing(this.state.animation, {
      duration: 1000,
      toValue: 28,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableWithoutFeedback onPress={this.startAnimate.bind(this)}>
          <View hint='container' style={{height: 80, width: 80, backgroundColor: '#eee'}} >
            <Animated.View hint='purpleCircle' style={{ 
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: '#e38dec',
                transform: [{
                  scale: this.state.animation.interpolate({
                    inputRange: [0, 0.99,      1,     2,    3,   4,    5,   6,  7,   8,  12.49, 12.5,  28],
                    outputRange: [0,  0,     .05,    .1,   .2,  .3,   .4,  .5, .7,  .8,     .8,  .01,  .01],
                    extrapolate: 'clamp',
                  }),
                }], 
              }} />
            <Animated.View hint='purpleCircle' style={{ 
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: '#eee', position: 'absolute',
                transform: [{
                  scale: this.state.animation.interpolate({
                    inputRange: [0, 8.99,  9,    10,  11,    12.49, 12.5,    28],
                    outputRange: [0,   0,  .2, .42,  .65,        .8,  .01,     .01],
                    extrapolate: 'clamp',
                  }),
                }], 
              }} />
            <Animated.View hint='spark' style={{
                width: 10, height: 10, borderRadius: 5,
                backgroundColor: '#ef589b', position: 'absolute',
                transform: [{
                  translateX: 40,
                }]
              }} />
            <Animated.View hint='content' style={{
                width: 80, height: 80, borderRadius: 40,
                position: 'absolute', 
                transform: [{
                  scale: 0.00,
                }],
                alignItems: 'center',
                justifyContent: 'center',
              }} >
              <IconFont style={{flex: 1}} icon='&#xe672;' size={24} color='#f56262'/>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}