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
import { TabView, renderScene, TabBar } from 'react-native-tab-view';

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


class EmojiKeyboard extends React.Component {

  state = {
    index: 0,
    routes: [],
  };

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
    this.state.routes = this.groupView.map((item, index)=>({key: index.toString()}));
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
      <View style={styles.container}>
        <TabView
          navigationState={this.state}
          onIndexChange={(index)=>{this.setState({index})}}
          tabBarPosition='bottom'
          renderScene={(args)=> {
            console.log(args);
            return this.groupView[args.route.key]
          }}
          renderTabBar={(props)=>{
            console.log(props);
            const { position } = props;
            const translateX = Animated.multiply(Animated.add(position, -1), 20);
            return (
              <View style={styles.tabBar}> 
                {
                  this.groupView.map((item, index)=>(
                    <View key={index.toString()} style={styles.dot} />
                  ))
                }
                <View hint='indicator container' style={styles.indicatorContainer}>
                  <Animated.View style={[styles.indicatorCover, {transform:[{translateX}]}]} />
                </View>
              </View>   
            )         
          }}
        />
      </View>
    )
  }
}


const {height, width} = require('Dimensions').get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ededed',
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
  groupView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15
  },
  tabBar: {
    height: 40, 
    flexDirection:'row', 
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#ededed',
  },
  dot: {
    backgroundColor: '#ddd',
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 7,
  },
  backspaceButton: {
    fontFamily: 'iconfont',
    fontSize: 24, 
    color:'#666',
  },
  indicatorCover: {
    backgroundColor:'#999', 
    width:8,
    height: 8, 
    borderRadius: 4, 
  },
  indicatorContainer: {position: 
    'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    top: 0, 
    justifyContent:'center', 
    alignItems:'center',
  },
});

export default EmojiKeyboard;