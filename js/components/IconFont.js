import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

export default class IconFont extends React.Component {
  render() {
    const size = this.props.size || 24;
    const color = this.props.color || '#000';
    return (
      <View style={[{alignItems:'center', justifyContent:'center'}, this.props.style]}>
        <Text {...this.props} style={{fontFamily:'iconfont', fontSize:size, color: color}}>{this.props.icon}</Text>
      </View>
    );
  }
}

IconFont.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};