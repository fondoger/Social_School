'use strict';
import React from 'react';
import {
  StyleSheet, 
  Text,
  View,
  Button,
  FlatList,
  Image,
  TouchableHighlight
} from 'react-native';
import Theme from '../utils/Theme';


export default class DiscoverScreen extends React.Component {
  static navigationOptions = {
    title: '发现',
  }
  constructor(props) {
    super(props);
    this.state = {
      tools: {
        'Kebiao': 0,
        'Xiaoche': 1,
        'Bykt': 2,
        'Other': 3,
      }
    };
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:'#eee'}}>
        <TouchableHighlight style={{marginTop:20}} underlayColor='#222' onPress={()=>console.log('点击了item')}>
          <View style={styles.item} >
            <Image style={styles.item_icon} source={require('../../img/voice.png')}/>
            <Text style={styles.item_text}>北航之声</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{marginTop:20}} underlayColor='#222' onPress={()=>this.props.navigation.navigate('Sale_SquarePage')}>
          <View style={styles.item} >
            <Image style={styles.item_icon} source={require('../../img/sale.png')}/>
            <Text style={styles.item_text}>跳蚤市场</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{marginTop:20}} underlayColor='#222' onPress={()=>console.log('点击了item')}>
          <View style={styles.item} >
            <Image style={styles.item_icon} source={require('../../img/paper_plane.png')}/>
            <Text style={styles.item_text}>纸飞机</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{marginTop:20}} underlayColor='#222' onPress={()=>console.log('点击了item')}>
          <View style={styles.item} >
            <Image style={styles.item_icon} source={require('../../img/box.png')}/>
            <Text style={styles.item_text}>Lost & Found</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{marginTop:20}} underlayColor='#222' onPress={()=>console.log('点击了item')}>
          <View style={styles.item} >
            <Image style={styles.item_icon} source={require('../../img/more.png')}/>
            <Text style={styles.item_text}>更多功能，等你来定！</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  item_icon: {
    width: 26,
    height: 26,
    marginTop: 12,
    marginBottom: 10,
    marginLeft: 16,
    marginRight: 16,
  },
  item_text: {
    color: '#000',
    fontSize: 17,
  }
});

