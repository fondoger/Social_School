'use strict';
import React from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import Emoticons from './EmojiKeyboard';
import spliddit from 'spliddit';
import Theme from '../utils/Theme';
import { IconFont } from './Utils';

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
    this.setState({ send_ing: true });
    this.props.onSendPress(this.state.textValue, (shouldClean) => {
      this.setState({ send_ing: false });
      shouldClean ? this.setState({ textValue: '' }) : null;
    });
  }

  _onChangeText(text) {
    this.setState({ textValue: text });
  }

  _onEmojiSwitchPress() {
    if (this.state.showEmojiInput) {
      this.setState({ showEmojiInput: false });
      this.textInput.focus();
    } else {
      Keyboard.dismiss();
      this.setState({ showEmojiInput: true });
    }
  }

  _onFocus() {
    if (this.state.showEmojiInput)
      this.setState({ showEmojiInput: false });
  }

  _onEmoticonPress(emoji) {
    const { selection, textValue } = this.state;
    const { start, end } = selection;
    let str = textValue.split('');
    str.splice(selection.end, 0, emoji);
    this.setState({
      textValue: str.join(''),
      selection: { start: end + emoji.length, end: end + emoji.length },
    });
    setTimeout(() => {
      // force update selection
      this.textInput.setNativeProps({
        selection: { start: end + emoji.length, end: end + emoji.length },
      });
    }, 30);
  }

  _onBackspacePress() {
    const { selection, textValue } = this.state;
    const { start, end } = selection;
    const pres = spliddit(textValue.slice(0, selection.end));
    const charlength = pres.length > 0 ? pres[pres.length - 1].length : 0;
    let str = textValue.split('');
    str.splice(selection.end - charlength, charlength);
    this.setState({
      textValue: str.join(''),
      selection: { start: end - charlength, end: end - charlength }
    });
    setTimeout(() => {
      // force update selection
      this.textInput.setNativeProps({
        selection: { start: end - charlength, end: end - charlength },
      });
    }, 30);
  }

  _onSelectionChange(e) {
    this.setState({ selection: e.nativeEvent.selection });
  }

  render() {
    const icon = this.state.showEmojiInput ? '\ue608' : "\ue892";
    const color = this.state.showEmojiInput ? Theme.themeColor : '#888';
    const style = this.props.float ? { position: 'absolute', left: 0, bottom: 0, right: 0 } : null;
    return (
      <View style={style}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={this._onEmojiSwitchPress.bind(this)} >
            <IconFont style={{ padding: 6 }} icon={icon} color={color} size={22} />
          </TouchableWithoutFeedback>
          <View style={styles.textInputWrap} >
            <TextInput
              multiline={true}
              onChangeText={this._onChangeText.bind(this)}
              onContentSizeChange={(event) => {
                this.setState({ height: Math.min(80, event.nativeEvent.contentSize.height) })
              }}
              placeholder={this.props.placeholder || "说点什么..."}
              style={[styles.textInput, { height: Math.max(16, this.state.height) }]}
              underlineColorAndroid="transparent"
              value={this.state.textValue}
              onSelectionChange={this._onSelectionChange.bind(this)}
              ref={ref => this.textInput = ref}
              selectionColor={Theme.themeColor}
              onFocus={this._onFocus.bind(this)}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.sendButtonWrap}>
            {
              this.state.send_ing ?
                <ActivityIndicator size='small' color={Theme.themeColor} /> :
                <Text onPress={this._onSendPress.bind(this)} style={{
                  fontSize: 15,
                  color: this.state.textValue != '' ? '#111' : '#888'
                }}>发送</Text>
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
    elevation: 3,
    borderColor: '#ddd',
    backgroundColor: 'rgba(255,255,255,.95)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    paddingTop: 0,
    paddingBottom: 6,
    minHeight: 48,
  },
  textInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 4, marginTop: 2,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderColor: '#d4d4d4',
  },
  textInput: {
    padding: 0,
    flex: 1,
    fontSize: 15,
  },
  sendButtonWrap: {
    width: 40,
    paddingLeft: 4,
    paddingBottom: 8,
    justifyContent: 'center',
  },
});