'use strict';
import React from 'react';
import { 
  Text, 
  View, 
  Image, 
  TouchableWithoutFeedback, 
  TouchableHighlight,
} from 'react-native';

export default class CustomHeader extends React.Component {
  render(props) {
    return (
      <View style={{backgroundColor:'#fafbfd', paddingTop:StatusBarHeight, flexDirection:'row',
        borderColor:'#ddd', borderBottomWidth:0.5, height:headerHeight, alignItems:'center'}} >
        <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
          <View style={{width:64, alignItems:'center'}}>
            <Text style={{fontFamily:'iconfont', fontSize:18, color:'#444',}}>&#xe60a;</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex:1}}><Text style={{color:'#444', fontSize:18}}>{title}的宝贝</Text></View>       
        {Storage.user&&Storage.user.id==user.id?
          <TouchableHighlight style={{width:64,}} 
                              onPress={()=>this.props.navigation.navigate("Sale_EditSalePage")}>
            <View style={{flex:1, backgroundColor:'#fafbfd', justifyContent:'center', alignItems:'center'}}>
              <Text style={{fontFamily:'iconfont', fontSize:22, color:'#444'}}>&#xe633;</Text>
            </View>
          </TouchableHighlight>: null
        }
      </View>
    )
  }
}