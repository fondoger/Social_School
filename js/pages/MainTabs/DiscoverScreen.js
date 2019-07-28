'use strict';
import React from 'react';
import {
  StyleSheet, 
  Alert,
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
        <RowItem icon="&#xe60c;" color="#dd5145" title="跳蚤市场" onPress={()=>this.navigateTo("Sale_SquarePage")} />
        <RowItem icon="&#xe736;" color="#f5ab16" title="校园订阅号" onPress={()=>this.navigateTo("Other_OfficialAccountPage")} />
        <RowItem icon="&#xe626;" color="#7586db" title="失物招领" onPress={this.handleLostFoundOnPress} />
        <RowItem icon="&#xea22;" color="#10aeff" title="扫一扫" onPress={()=>MyToast.show("修理ing...")} />
      </View>
    );
  }

  handleLostFoundOnPress = () => {
    MyToast.show("由信息北航提供服务");
    const lostFound = "https://app.buaa.edu.cn/lost/wap/default";
    this.props.navigation.navigate("Common_WebviewPage", {url: lostFound});
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

const RowItem = ({icon, color, title, onPress}) => (
  <TouchableHighlight style={{marginTop:20}} underlayColor='#222' onPress={onPress}>
    <View style={styles.item} >
      <IconFont icon={icon} color={color} size={23} style={{marginHorizontal: 20}} />
      <Text style={styles.item_text}>{title}</Text>
    </View>
  </TouchableHighlight>
);