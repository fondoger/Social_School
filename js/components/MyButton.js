'use strict';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../utils/Theme';

export class NormalButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      onPressing: false,
    };
  }

  render() {
    const { onPressing } = this.state;
    return (
      <View {...this.props}>
        <TouchableWithoutFeedback 
              onPressIn={()=>this.setState({onPressing:true})}
              onPressOut={()=>setTimeout(()=>this.setState({onPressing:false}), 100)}
              onPress={this.props.onPress} >       
          <View style={[styles.normal, onPressing ? styles.normalActive: styles.normalInactive, this.props.wrapperStyle]}>
            <Text style={[styles.normalText, onPressing ? styles.normalActiveText: styles.normalInactiveText, this.props.textStyle]}>{this.props.text||'按钮'}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

export class SelectButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      onPressing: false,
      act_ing: false,
      selected: this.props.selected ? true: false,
    };
  }

  onPress() {
    if (this.props.onPress && !this.state.act_ing) {
      this.setState({act_ing: true}); 
      this.props.onPress((result) => {
        if (result) 
          this.setState({selected: !this.state.selected});
        this.setState({act_ing: false});
      });
    }
  }

  render() {
    const { onPressing, act_ing, selected } = this.state;
    return (
        <TouchableWithoutFeedback 
              onPressIn={()=>this.setState({onPressing:true})}
              onPressOut={()=>setTimeout(()=>this.setState({onPressing:false}), 100)}
              onPress={this.onPress.bind(this)} >       
          <View style={[styles.selectContainer, selected ? styles.selectSelected:
                onPressing ? styles.selectActive: styles.selectInactive, 
                this.props.style]}>
              { act_ing ? 
                <ActivityIndicator size='small'
                    color={selected ? '#888': '#fff'} /> : 
                <Text style={[styles.selectText, selected ? styles.selectSelectedText: 
                  onPressing ? styles.selectActiveText: styles.selectInactiveText, 
                  this.props.textStyle]}>{(selected ? this.props.selectText : this.props.text )||'按钮'}
                </Text>
              }
          </View>
        </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  normal: {
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#fff',
  },
  normalText: {
    fontSize: 12,
  },
  normalInactive: {
    borderColor: Theme.themeColor,
  },
  normalInactiveText: {
    color: Theme.themeColor,
  },
  normalActive: {
    borderColor: Theme.themeColorDeep,
  },
  normalActiveText: {
    color: Theme.themeColorDeep,
  },
  selectContainer: {
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  selectText: {
    fontSize: 12,
  },
  selectInactive: {
    backgroundColor: Theme.themeColor,
  },
  selectInactiveText: {
    color: '#fff',
  },
  selectActive: {
    backgroundColor: Theme.themeColorDeep,
  },
  selectActiveText: {
    color: '#eee',
  }, 
  selectSelected: {
    backgroundColor: '#ddd',
  },
  selectSelectedText: {
    color: '#888',
  },
});