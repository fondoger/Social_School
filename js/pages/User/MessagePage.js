'use strict';
import React from 'react';
import { 
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { getGMTTimeDiff } from '../../utils/Util';
import { Loading, UserAvatar } from '../../components';

export default class MessagePage extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: '我的消息',
  });

  constructor(props) {
    super(props);
    this.state = {
        messages: [],
        load_ing: true,
        load_err: false,
    }
  }

  componentDidMount() {
    this.setState({load_ing: true, load_err: false});
    API.Message.get({}, (responseJson) => {
      this.setState({messages: responseJson, load_ing: false});
    }, (err) => {
      this.setState({load_ing: false, load_err: true});
    });
  }

  renderItem({item, index}) {
    return (
      <View>
        <TouchableHighlight onPress={()=>this.props.navigation.navigate('User_ChatPage', {user:item.with})} >
          <View style={{flexDirection:'row', backgroundColor:'#f2f4f5'}}>
            <UserAvatar style={{margin:10}} {...this.props} size={50} user={item.with} />
            <View style={{height:68, flex:1, justifyContent:'center'}}>
              <View style={{paddingTop:4, paddingBottom:4, paddingRight:8, flexDirection:'row', alignItems:'center'}}>
                <Text style={{flex:1, fontSize:16, color:'#333'}}>{item.with.username}</Text>
                <Text style={{fontSize:10, color:'#aaa'}}>{getGMTTimeDiff(item.timestamp)}</Text>
              </View>
              <Text style={{fontSize:12, color:'#666'}} numberOfLines={1}>{item.text}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <View style={{flexDirection:'row'}} >
          <View style={{width: 70}} />
          <View style={{flex: 1, height: 0.5, backgroundColor: '#ddd'}} />
        </View>
      </View>
    )
  }

  render() {
    if (this.state.load_ing || this.state.load_err) {
      return (
        <Loading 
          style={{backgroundColor:'#f2f4f5'}} 
          fullScreen={true} 
          err={this.state.load_err} 
          onRetry={this.componentDidMount.bind(this)}
        />
      )
    }
    return (
      <View style={{flex:1, backgroundColor:'#f2f4f5'}}>
        <FlatList
          data={this.state.messages}
          keyExtractor={((item, index) => `${item.id}`)}
          renderItem={this.renderItem.bind(this)}
          showsVerticalScrollIndicator={false}
          />
      </View>
    )
  };

}
