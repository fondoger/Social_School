'use strict';
import React from 'react';
import {
  Text,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import API from '../../utils/API_v1';
import Theme from '../../utils/Theme';

const StatusBarHeight = (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight);

export default class MediumTransPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,    
    headerStyle: {
      backgroundColor:'rgba(0,0,0,0)', 
      paddingTop: StatusBarHeight,
      height: Theme.headerHeight + StatusBarHeight,
    }
  });
  componentDidMount() {
    const { username, topic } = this.props.navigation.state.params;
    if (username) {
      API.User.get({username:username}, (responseJson)=>{
        this.props.navigation.replace('User_ProfilePage', {user:responseJson});
      }, (error)=>{});
    }
    if (topic) {
      API.Topic.get({topic:topic}, (responseJson)=>{
        this.props.navigation.replace('STatus_TopicPage', {topic:responseJson});
      }, (error)=>{});
    }
  }
  render() {
    return <View style={{flex:1, backgroundColor:'#eee'}} />
  }
}