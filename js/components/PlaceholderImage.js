'use strict';
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default class PlaceholderImage extends React.Component {
  render() {
    return (
      <View {...this.props}>
        <Image style={StyleSheet.absoluteFill} resizeMode='contain' source={require('../../img/placeholder.jpg')} />
        <Image {...this.props} />
      </View>
    )
  }
}