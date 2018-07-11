'use strict';
import React from 'react';
import { View, StyleSheet, Image, Text, TouchableHighlight } from 'react-native';
import Theme from '../utils/Theme';

export default class WechatArticleCard extends React.Component {

  render() {
    const { article, ...props } = this.props;
    return (
      <TouchableHighlight {...props} underlayColor='#666666' onPress={this._onPress} >
        <View style={{flexDirection: 'row', backgroundColor: Theme.lightBackgroundColor}}>
          <View style={{flex: 2, aspectRatio: 1.35}}><Image style={{flex: 1, aspectRatio: 1.35}} source={{uri: article.img_url}} /></View>
          <View style={{flex: 3, padding: 10}}>
          <Text style={{color: '#000', fontSize: 16}} numberOfLines={3}>{article.title}</Text>
          <Text style={{color: '#aaa', paddingTop: 4}} >@{article.author}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  _render() {
    const { article, ...props} = this.props;
    return (
      <TouchableHighlight {...props} underlayColor={'#666666'} onPress={this._onPress}>
        <View style={styles.container}>
          <Image style={styles.image} source={{uri: article.img_url}} />
          <View style={styles.rightColumn}>
              <View style={{flex: 3, justifyContent: 'center'}}>
              <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
              </View>
              <View style={{flex: 4, marginTop: -2}}>
              <Text style={styles.desc} numberOfLines={3}>{article.desc}</Text>
              </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _onPress = () => {
    this.props.navigation.navigate('WechatArticlePage', {url: this.props.article.url, title: this.props.article.author});
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Theme.lightBackgroundColor,
  },
  title: {
    color: '#000', 
    fontSize: 15, 
  },
  desc: {
    color: '#444',
    fontSize: 12,
  },
  image: {
    width: 85,
    height: 85,
  },
  rightColumn: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    flex: 1,
    height: 85,
    justifyContent: 'center',
  },
  author: {
    color: '#222',
    fontSize: 12,
    lineHeight: 14,
  },
});