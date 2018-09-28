'use strict';
import React from 'react';
import { View, StyleSheet, Image, Text, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import Theme from '../utils/Theme';
import { PlaceholderImage } from './Utils';

const IMAGE_MARGIN = 2;

export default class ImageCard extends React.Component {
  render() {
    const {images, oneRow, ...props} = this.props;
    let imageRows = [];
    let num = (images.length == 4) ? 2 : 3;
    let t = [];
    for (let i = 0; i < images.length; i++) {
      t.push({index: i, image: images[i]});
      if (t.length == num) {
        if (t.length != 3)
          t.push(null);
        imageRows.push(this._renderImageRow(t, imageRows.length));
        t = [];
      }
    }
    if (t.length != 0) {
      while (t.length != 3)
        t.push(null)
      imageRows.push(this._renderImageRow(t, imageRows.length));
    }
    if (oneRow) imageRows = imageRows.slice(0,1);
    return (
      <View {...props}>
        <View  style={{margin: -IMAGE_MARGIN}}>{imageRows}</View>
      </View>
    )
  }
  _renderImageRow(items, i) {
    return (
      <View key={i} style={{flexDirection: 'row'}}>
        {this._renderImage(items[0])}{this._renderImage(items[1])}{this._renderImage(items[2])}
      </View>
    )
  }
  _renderImage(item) {
    if (item) {
      return (
        <TouchableWithoutFeedback onPress={()=>{this._onImagePress(item.index);}}>
          <View style={{flex: 1, aspectRatio: 1, margin: IMAGE_MARGIN, backgroundColor:'#efefef'}} ><Image style={{flex: 1}} source={{uri: item.image+'!mini5'}} /></View>
        </TouchableWithoutFeedback>
      )
    }
    return (<View style={{flex: 1, aspectRatio: 1, margin: IMAGE_MARGIN}}></View>)
  }
  _onImagePress = (index)=> {
    this.props.navigation.navigate('Common_ImageViewerPage', {initialImage: index, images: this.props.images.map((url)=>{return {source: {uri: url+'!mini5'}}})});
  }
}
