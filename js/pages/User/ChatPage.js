'use strict';
import React from 'react';
import { 
  Text,
  View,
  Image,
  FlatList,
  Keyboard,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { getGMTTimeDiff, calcGMTTimeDiff } from '../../utils/Util';
import { MyToast, Loading, UserAvatar, BottomInputBar } from '../../components';
//import Emoticons from 'react-native-emoticons';

class TouchableMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onPressing: false,
    }
  }
  render() {
    const item = this.props.message;
    const isMe = item.ufrom_id==Storage.user.id;
    return (
      <TouchableWithoutFeedback
          onPress={()=>{}}
          onPressIn={()=>this.setState({onPressing:true})}
          onPressOut={()=>this.setState({onPressing:false})}>
        <View style={{flexDirection:'row'}}>
        {isMe?null: <View style={[styles.leftTriangle, this.state.onPressing?{borderRightColor:'#d4d4d4'}:null]} />}
        <Text style={[isMe?styles.me_msg:styles.msg, this.state.onPressing?{backgroundColor:isMe?'#629edf':'#d4d4d4'}:null]}>{item.text}</Text>
        {isMe?<View style={[styles.rightTriangle, this.state.onPressing?{borderLeftColor:'#629edf'}:null]} />: null}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default class ChatPage extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.user.username,
  });

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      scrollViewHeight: 0,
      keyboardHeight: 0,
      keyboardStatus: 0,
      load_ing: true,
      load_err: false,
    }
  }

  componentDidMount() {
    const user = this.props.navigation.state.params.user;
    this.setState({load_ing: true, load_err: false});
    API.Message.get({with_id:user.id, limit: 100}, (responseJson) => {
      this.setState({messages: responseJson, load_ing: false});
      setTimeout(() => {
        this.scrollView.scrollToEnd();
      }, 200);
    }, (err) => {
      this.setState({load_ing: false});
    });
  }


  renderItem({item, index}) {
    item.with = this.props.navigation.state.params.user;
    const isMe = item.ufrom_id==Storage.user.id;
    const pre_time = index>=1?this.state.messages[index-1].timestamp: null;
    const showTime = pre_time==null || calcGMTTimeDiff(item.timestamp, pre_time) >= 5;
    return (
      <View style={{paddingTop:0, paddingBottom:12}}>
        { showTime ?
        <View style={{flex:1, alignItems:'center', margin:8,}}>
          <Text style={{fontSize:10, color:'#fff', backgroundColor:'#d9dbdc', 
                borderRadius:9, paddingLeft:8, paddingRight:8, padding:2}}>
            {getGMTTimeDiff(item.timestamp)}
          </Text>
        </View>:null
        }
        <View style={{flexDirection:'row', paddingLeft:8, paddingRight:8}}>
          {isMe?null:<UserAvatar style={{marginRight:4}} {...this.props} size={40} user={item.with} />}
          <View style={[styles.container, isMe?{justifyContent:'flex-end'}:null]}>
          <TouchableMessage message={item}/>
          </View>
          {isMe?<UserAvatar style={{marginLeft:4}} {...this.props} size={40} user={Storage.user} />:null}
        </View>
      </View>
    )
  }


  onSendPress(text, callback) {
    const user = this.props.navigation.state.params.user;
    API.Message.create({with_id:user.id, text: text}, (responseJson) => {
      this.state.messages.push(responseJson);
      this.setState({messages: this.state.messages});
      setTimeout(() => {
        this.scrollView.scrollToEnd();
      }, 100);
      callback(true);
    }, (err) => {MyToast.show('发送失败, 稍后再试'); callback(false)});
  }

  _onLayoutChange = (e) => {
    setTimeout(() => {
      this.scrollView.scrollToEnd();
    }, 100);
  }

  render() {
    if (this.state.load_ing || this.state.load_err) {
      return (
        <Loading 
          style={{backgroundColor:'#f2f4f5'}} 
          fullScreen={true} 
          err={this.state.load_err} 
          onRetry={this.componentDidMount}
        />
      )
    }
    return (
      <View style={{flex:1, backgroundColor:'#f2f4f5'}} onLayout={this._onLayoutChange}>
        <FlatList
          data={this.state.messages}
          keyExtractor={((item, index) => `${item.id}`)}
          renderItem={this.renderItem.bind(this)}
          showsVerticalScrollIndicator={false}
          ref={ref => this.scrollView  = ref}
          extraData={this.state}
        />
        <BottomInputBar {...this.props} onSendPress={this.onSendPress.bind(this)}/>
      </View>
    )
  };
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    msg: {
        fontSize: 15,
        color: '#222',
        padding: 10,
        backgroundColor: '#e6e8e9',
        borderRadius: 8,
        maxWidth: 230,
    },
    me_msg: {
        fontSize: 15,
        color: '#fff',
        padding: 10,
        backgroundColor: '#76afec',
        borderRadius: 8,
        maxWidth: 230,
    },
    rightTriangle: {
        width: 0,
        height: 0,
        marginTop:12,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 0,
        borderBottomWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: '#76afec',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    leftTriangle: {
        width: 0,
        height: 0,
        marginTop:12,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 6,
        borderLeftWidth: 0,
        borderBottomWidth: 6,
        borderTopWidth: 6,
        borderRightColor: '#e6e8e9',
        borderLeftColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
});
