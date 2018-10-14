'use strict';
import React from 'react';
import { View, Text, Image, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import ImageCard from './ImageCard';
import Theme from '../utils/Theme';

export default class SaleItem extends React.Component {
  onProfilePress = () => {
    const user = this.props.sale.user;
    this.props.navigation.navigate('User_ProfilePage', {user:user});
  }
  render() {
    const sale = this.props.sale;
    const user = sale.user;
    const images = sale.pics.map(url => ({uri: url + '!mini5', bigUri: url}));
    return (
      <View style={{backgroundColor:'#eee'}}>
        <TouchableHighlight 
          underlayColor='#444'
          onLongPress={this.handleLongPress}
          onPress={()=>this.props.navigation.navigate('Sale_SalePage', {sale:sale})}
        >
          <View style={{backgroundColor: '#fff'}}>
            <View style={{flexDirection:'row', paddingLeft:12, paddingTop:14}}>
              <TouchableWithoutFeedback onPress={this.onProfilePress}>
                <View style={{height:42, width:42}}>
                  <Image
                    style={{width:42, height:42, borderRadius:21}} 
                    source={{uri: user.avatar+'!thumbnail'}} />
                </View>
              </TouchableWithoutFeedback>
              <View style={{paddingLeft:12}}>
                <Text style={{fontSize:15, color:'#222'}}
                      onPress={this.onProfilePress}>{user.username}</Text>
                <Text style={{fontSize:12, color:'#888'}}
                      onPress={this.jumpToUserProfilePage}>{user.self_intro}</Text>
              </View>
            </View>
            <View style={{marginLeft:12, marginRight:14, paddingTop:6, marginBottom:16}}>
              <ImageCard {...this.props} style={{marginBottom: 12}} images={images} oneRow={true}/>
              <Text style={{fontSize:15, color:'#000'}}>{sale.title + ' ' + sale.text}</Text>
            </View>
            <View style={{marginLeft:12, marginRight:12, flexDirection:'row', 
                  paddingTop:12, paddingBottom:12, borderTopWidth:0.5, borderColor:'#eee'}}>
              <Text style={{flex:1, fontSize:12, color:Theme.themeColor}}>{sale.location=='shahe'?'沙河校区':'学院路校区'}</Text>
              {sale.likes != 0 ? <Text style={{fontSize:12}}>超赞{sale.likes}</Text>:null}
              {sale.likes != 0 && sale.comments.length != 0 ? <Text style={{fontSize:12}}> · </Text>:null}
              {sale.comments.length != 0 ? <Text style={{fontSize:12}}>留言{sale.comments.length}</Text>:null}
            </View>
            <Text style={{fontSize:17, fontWeight:'bold', position:'absolute', right:24, top:16, color:'#f44'}}><Text style={{fontSize:12}}>￥</Text>{sale.price}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}