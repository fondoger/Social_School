'use strict';

/* 
* Origin from 'https://github.com/xiewang/react-native-emoticons';
*/

import React from 'react';
import {
  Text,
  View,
  Image,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Navigator,
  InteractionManager,
  Platform,
  DeviceEventEmitter,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

const emoji = [
"😀", "😁", "😂", "😅", "😆", 
"😉", "😊", "😋", "😍", "😘", 
"😙", "😛", "😜", "😎", "😏", "😒", 
"🤔", "😳", "😲", "😡", "😤", "😭", 
"😷", "😴", "💤", "🌚", "🌝", "😈", "💩", "👻", 
"👍", "👎", "👊", "✌", "👌",
"💪", "🙏", "👆", "👇", "👉", "👈", "👄", "💋", "❤", "💔", "👒",
"💰", "👑", "🐶", "🐼", "🐷",
"🌸", "☀", "⛈", "⚡",
"❄", "🎉", "👏", "🎂", "🍭", "🍻", "🍿",
"📖", "⚽", "✈", "📱", "🌏",];

const emoji_desc = [
"grinning", "grin", "joy", "sweet_smile", "laughing",
"wink", "blush", "yum", "heart_eyes", "kissing_heart",
"kissing_smiling_eyes", "stuck_out_tongue", "stuck_out_tongue_winking_eye", "sunglasses", "smirk", "unamused",
"thinking_face", "flushed", "astonished", "rage", "triumph", "sob",
"mask", "sleeping", "zzz", "new_moon_with_face", "full_moon_with_face", "smiling_imp", "hankey", "ghost",
"+1", "-1", "facepunch", "v", "ok_hand",
"muscle", "pray", "point_up", "point_down", "point_right", "point_left", "lips", "kiss", "heart", "broken_heart", "womans_hat",
"moneybag", "crown", "dog", "panda_face", "pig",
"cherry_blossom", "sunny", "thunder_cloud_and_rain", "zap",
"snowflake", "tada", "clap", "birthday", "lollipop", "beers", "popcorn",
"book", "soccer", "airplane", "iphone", "earth_asia",
];

const emojiKeyboardHeight = 250;
const blockIconNum = 23;
const blocks = Math.ceil(emoji.length / blockIconNum);

class TabBarDot extends React.Component {

  render() {
    return (
      <View style={[styles.tabsDot, this.props.style, ]}>
      { 
        this.props.tabs.map((tab, i) => (
          <TouchableOpacity key={i.toString()}
              style={[styles.tabDot,{backgroundColor: (this.props.activeTab === i? '#ccc': '#fff')}]}>
            <View style={styles.dot}></View>
          </TouchableOpacity>
        ))
      }
      </View>
    );
  }
}

class EmojiKeyboard extends React.Component {

  constructor(props) {
      super(props);
  }

  componentDidMount() {
    this.groupView = [];
    for (let i = 0; i < blocks; i++) {
        let emoji_block = [];
        for (let j = 0; j < blockIconNum; j++) {
          emoji_block.push(this.renderEmojiIcon(i*blockIconNum+j));
        }
        this.groupView.push(
          <View style={styles.groupView} key={'block'+i}
                tabLabel={'block'+i}>
              {
                emoji_block
              }
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={this._onBackspacePress.bind(this)}
                style={[styles.emojiTouch, styles.delete]}
                >
                <Text style={styles.backspaceButton}>&#xe69f;</Text>
              </TouchableOpacity>
          </View>
        );
    }    
  }

  _onBackspacePress() {
    if (this.props.onBackspacePress)
      this.props.onBackspacePress();
  }

  _onEmoticonPress(emojiValue) {
    if (this.props.onEmoticonPress)
      this.props.onEmoticonPress(emojiValue);
  }

  renderEmojiIcon(index) {
    const value = emoji[index];
    const desc = emoji_desc[index];
    return (
      <TouchableHighlight
        underlayColor={'#f1f1f1'}
        onPress={()=>this._onEmoticonPress.bind(this)(value)}
        style={styles.emojiTouch}
        key={index.toString()}
        >
        <Text style={styles.emoji} >
          {value}
        </Text>
      </TouchableHighlight>
    )
  }

  render() {
    if (!this.props.show)
      return null;
    return (
      <Animated.View style={this.props.style,styles.container}>
        <ScrollableTabView
          tabBarPosition='bottom'
          renderTabBar={() => <TabBarDot {...this.props} />}
          initialPage={0}
          tabBarActiveTextColor="#fc7d30"
          tabBarUnderlineStyle={{backgroundColor:'#fc7d30',height: 2}}
          >
          {
            this.groupView
          }
        </ScrollableTabView>
      </Animated.View>
    )
  }
}

const {height, width} = require('Dimensions').get('window');

const styles = StyleSheet.create({
  baseText: {
    fontSize: 13,
    color: '#4a4a4a',
    lineHeight: 18
  },
  dimText: {
    color: '#9b9b9b',
  },
  container: {
    backgroundColor: '#f8fafb',
    height: emojiKeyboardHeight,
    width: width,
    borderColor: '#eee',
    borderTopWidth: 0.5,
  },
  emoji: {
    textAlign: 'center',
    fontSize: 25,
    lineHeight: 30,
    color: '#rgba(0,0,0,1)'
  },
  emojiTouch:{
    width: (width-30)/6,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  delete:{
    right:0
  },
  scrollTable: {
    width: width
  },
  cateView: {
    flex: 1,
  },
  groupView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
    width: 60,
    borderRightWidth: 1,
    borderColor: 'rgba(178,178,178,.3)',
    backgroundColor: '#fff'
  },
  tabs: {
    height: 40,
    width: width,
    flexDirection: 'row',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopColor: 'rgba(178,178,178,0.3)',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  tabsDot: {
    height: 40,
    width: width,
    flexDirection: 'row',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 5
  },
  dot: {
    backgroundColor: '#f1f1f1',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  backspace:{
    width: 30,
    height: 30,
    opacity: .5
  },
  plusButton: {
    width: 20,
    height: 20,
    opacity: 0.8
  },
  backspaceButton: {
    fontFamily: 'iconfont',
    fontSize: 24, 
    color:'#666',
  },
});

export default EmojiKeyboard;