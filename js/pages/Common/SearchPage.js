'use strict';
import React from 'react';
import { View, Text, Image } from 'react-native';
import Loading from '../../components/Loading';

export default class SearchPage extends React.Component {
  static navigationOptions = {
    title: '搜索页',
  };
  render() {
    return (
      <Loading fullScreen={true} size='large'/>
    )
  }

}
