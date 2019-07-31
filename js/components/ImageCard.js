'use strict';
import React from 'react';
import { View, StyleSheet, Image, Text, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import Theme from '../utils/Theme';
import { PlaceholderImage } from './Utils';
import FastImage from 'react-native-fast-image'

const IMAGE_MARGIN = 2;

/**
 * props: 
 *
 *     oneRow: boolean, show only one row even more than 3 images,
 *     images: [
 *        { require('../some/local/image.jpg') },
 *        { 
 *          uri: 'http://example.com/small_image.jpg',
 *          bigUri(optional): 'http://example.com/big_image.jpg',
 *        },
 *        ...
 *     ]
 * 
 */

export default class ImageCard extends React.Component {

  render() {
    const { images, oneRow, ...props } = this.props;
    let imageRows = [];
    let num = (images.length == 4) ? 2 : 3;
    let t = [];
    for (let i = 0; i < images.length; i++) {
      t.push({ index: i, source: images[i] });
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
    if (oneRow) imageRows = imageRows.slice(0, 1);
    return (
      <View {...props}>
        <View style={{ margin: -IMAGE_MARGIN }}>{imageRows}</View>
      </View>
    )
  }
  _renderImageRow(items, i) {
    return (
      <View key={i.toString()} style={{ flexDirection: 'row' }}>
        {this._renderImage(items[0])}{this._renderImage(items[1])}{this._renderImage(items[2])}
      </View>
    )
  }
  _renderImage(item) {
    if (item) {
      item.source.priority = FastImage.priority.low;
      return (
        <TouchableWithoutFeedback onPress={() => { this._onImagePress(item.index); }}>
          <View style={{ flex: 1, aspectRatio: 1, margin: IMAGE_MARGIN, backgroundColor: '#efefef', borderRadius: 2 }} >
            <FastImage style={{ flex: 1, borderRadius: 2, borderWidth: .2, borderColor: 'rgba(0,0,0,.15)' }} source={item.source} />
          </View>
        </TouchableWithoutFeedback>
      )
    }
    return (<View style={{ flex: 1, aspectRatio: 1, margin: IMAGE_MARGIN }}></View>)
  }
  _onImagePress = (index) => {
    const images = this.props.images.map(source => ({
      source: source,
      dimensions: null,
    }))
    this.props.navigation.navigate('PhotoViewPage', { initialImage: index, images: images });
  }
}
