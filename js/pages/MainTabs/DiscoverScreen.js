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
import Theme from '../../utils/Theme';
import { IconFont } from '../../components';
import MyToast from '../../components/MyToast';

function Header(props) {
  return (
    <View style={{backgroundColor: Theme.themeColor,
                  height: Theme.headerHeight + Theme.statusBarHeight, justifyContent: 'center', 
                  paddingLeft: 16, paddingTop: Theme.statusBarHeight}}>
      <Text style={{fontSize: 18, color: '#fff'}}>{props.title}</Text>
    </View>
  )
}

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

  navigateTo = (route_name)=>{
    this.props.navigation.navigate(route_name);
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:'#eee'}}>
        <Header title="发现"/>
        <TouchableHighlight style={{marginTop:20}} underlayColor='#222' onPress={()=>this.navigateTo("Sale_SquarePage")}>
          <View style={styles.item} >
            <IconFont icon='&#xe60c;' color='#dd5145' size={23} style={{marginHorizontal: 20}} />
            <Text style={styles.item_text}>跳蚤市场</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{marginTop:20}} underlayColor='#222' onPress={()=>this.navigateTo("Other_OfficialAccountPage")}>
          <View style={styles.item} >
            <IconFont icon='&#xe736;' color='#f5ab16' size={23} style={{marginHorizontal: 20}} />
            <Text style={styles.item_text}>订阅号</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{marginTop:20}} underlayColor='#222' onPress={()=>MyToast.show("修理ing...")}>
          <View style={styles.item} >
            <IconFont icon='&#xea22;' color='#10aeff' size={23} style={{marginHorizontal: 20}} />
            <Text style={styles.item_text}>扫一扫</Text>
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
    paddingVertical: 12.5,
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
    color: '#111',
    fontSize: 16,
    lineHeight: 19,
  }
});

