'use strict';
import React from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import Emoticons from './EmojiKeyboard';
import spliddit from 'spliddit';
import Theme from '../utils/Theme';

export default class BottomInputBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      textValue: '',
      send_ing: false,
      height: 35,
      showEmojiInput: false,
      selection: {
        start: 0,
        end: 0,
      },
    }
  }

  _onSendPress() {
    if (this.state.text === '' || !this.props.onSendPress)
      return;
    this.setState({send_ing: true});
    this.props.onSendPress(this.state.textValue, (shouldClean)=>{
      this.setState({send_ing: false});
      shouldClean ? this.setState({textValue: ''}): null;
    });
  }

  _onChangeText(text) {
    this.setState({textValue:text});
  }

  _onEmojiSwitchPress() {
    if (this.state.showEmojiInput) {
      this.setState({showEmojiInput: false});
      this.textInput.focus();
    } else {
      this.setState({showEmojiInput: true});
    }
  }

  _onFocus() {
    if (this.state.showEmojiInput)
      this.setState({showEmojiInput: false});
  }

  _onEmoticonPress(emoji) {
    const { selection, textValue} = this.state;
    const {start, end} = selection;
    let str = textValue.split('');
    str.splice(selection.end, 0, emoji);
    this.setState({
      textValue: str.join(''), 
      selection: {start:end+emoji.length, end:end+emoji.length },
    });
    setTimeout(()=>{
      // force update selection
      this.textInput.setNativeProps({
        selection: {start: end + emoji.length, end: end + emoji.length},
      });
    }, 30);
  }

  _onBackspacePress() {
    const { selection, textValue } = this.state;
    const {start, end} = selection;
    const pres = spliddit(textValue.slice(0, selection.end));
    const charlength = pres.length > 0 ? pres[pres.length - 1].length: 0;
    let str = textValue.split('');
    str.splice(selection.end-charlength, charlength);
    this.setState({
      textValue: str.join(''), 
      selection: {start: end-charlength, end: end-charlength}
    });
    setTimeout(()=>{
      // force update selection
      this.textInput.setNativeProps({
        selection: {start: end-charlength, end: end-charlength},
      });
    }, 30);
  }

  _onSelectionChange(e) {
    this.setState({selection: e.nativeEvent.selection});
  }

  render() {
    const icon = this.state.showEmojiInput?'\ue605':"\ue60b";
    return (
      <View {...this.props}>
        <View  behavior="height"
            style={styles.container}>
          <View style={styles.textInputWrap} >
            <TextInput
              multiline={true}
              onChangeText={this._onChangeText.bind(this)}
              onContentSizeChange={(event) => { 
                this.setState({height: Math.min(80, event.nativeEvent.contentSize.height)})
              }}
              placeholder={this.props.placeholder||"写点什么"}
              style={[styles.textInput, {height: Math.max(16, this.state.height)}]}
              underlineColorAndroid="transparent"
              value={this.state.textValue}
              onSelectionChange={this._onSelectionChange.bind(this)}
              ref={ref=>this.textInput=ref}
              selectionColor={Theme.themeColor}
              onFocus={this._onFocus.bind(this)}
            />
            <Text onPress={this._onEmojiSwitchPress.bind(this)} 
            style={styles.emojiButton}>{icon}</Text>
          </View>
          <View style={styles.sendButtonWrap}>
          {
            this.state.send_ing ?
            <ActivityIndicator size='small' color={Theme.themeColor} /> :
            <Text onPress={this._onSendPress.bind(this)} style={{fontSize:15,
              color: this.state.textValue!=''?'#222':'#888'}}>发送</Text>
          }
          </View>
        </View>
        <Emoticons
          onEmoticonPress={this._onEmoticonPress.bind(this)}
          onBackspacePress={this._onBackspacePress.bind(this)}
          show={this.state.showEmojiInput}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.5, 
    borderColor:'#eee', 
    backgroundColor:'#fff', 
    flexDirection:'row',
    alignItems:'flex-end', 
    padding: 8, 
    paddingTop:0, 
    paddingBottom:4, 
    minHeight:48,
  },
  textInputWrap: {
    flex:1, 
    flexDirection:'row', 
    alignItems:'flex-end', 
    margin:4, marginTop:2, 
    paddingBottom:2, 
    borderBottomWidth:1, 
    borderColor:'#d4d4d4',
  },
  textInput: {
    padding:0, 
    flex:1, 
    fontSize:15,
  },
  sendButtonWrap: {
    width:40, 
    paddingLeft:4, 
    paddingBottom:8, 
    justifyContent:'center',
  },
  emojiButton: {
    fontFamily:'iconfont', 
    fontSize:21, 
    color:'#888', 
    paddingLeft:6, 
    paddingTop:8, 
    paddingRight:6,
  },
});