'use strict';
import React from 'react';
import { 
  View,
  Text, 
  Image,  
  Easing,
  Animated,
  FlatList, 
  Platform,
  TextInput,
  StatusBar,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers, } from 'react-native-popup-menu';
import { getPassedTime } from '../../utils/Util';
import Storage from '../../utils/Storage';
import { MyToast, ImageSelector } from '../../components';

const _window = require('Dimensions').get('window');
const ScreenWidth = _window.width;
const ScreenHeight = _window.height;
const StatusBarHeight = (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight);
const headerHeight = Theme.headerHeight + StatusBarHeight;

const locations = ['学院路校区', '沙河校区'];
const categories = ['学习&书籍', '数码&电器', '生活&日用', '户外&文体', '票券&其他'];
const CATEGORY = ['study', 'digital', 'life', 'outdoors', 'other'];
const LOCATION = ['xueyuanlu', 'shahe'];

class PriceEditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceValue: props.price,
      priceValueValid: true,
    }
  }
  onPriceChange = (text) => {
    const valid = (/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/).test(text);
    this.props.onPriceChange(valid?text:'')
    this.setState({priceValue: text, priceValueValid: valid});  
  } 
  render() {
    return (
      <TouchableWithoutFeedback>
        <View style={{padding:20, backgroundColor:'#fff', borderRadius:3, width:300}}>
          <Text style={{color:'#222', fontSize:18}}>输入价格</Text>
          <View style={{flexDirection:'row', alignItems:'center', paddingTop:24, paddingBottom:2, borderBottomWidth:0.5, borderColor:'#ddd'}}>
            <Text style={{color:'#aaa', fontSize:18}}>￥</Text>
            <TextInput
              style={{padding:0, height:26, color:'#333', flex:1, fontSize:18, marginLeft:4}}
              underlineColorAndroid="transparent"
              placeholderColor="#aaa"
              multiline={false}
              placeholder="0.00"
              autoGrow={false}
              autoFocus={false}
              value={this.state.priceValue}
              onChangeText={this.onPriceChange}
            />
            { this.state.priceValueValid ? null : <Text style={{color:'#ff9800'}}>价格不合法</Text>}
          </View>
          <View>
            <TouchableHighlight style={{marginTop:24, height:40}} onPress={()=>{this.props.hide()}}>
              <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#f44'}}>
                <Text style={{color:'#fff'}}>确定</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default class PersonalPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      send_ing: false,
      textValue: '',
      titleValue: '',
      priceValue: '',
      selectedLocationIndex: -1,
      selectedCategoryIndex: -1,
    }
  }

  render() {
    const { user, selectedCategoryIndex, selectedLocationIndex }= this.state;
    return (
      <View style={{flex:1,}}>
        <View style={{backgroundColor:'#fafbfd', paddingTop:StatusBarHeight, flexDirection:'row',
              borderColor:'#ddd', borderBottomWidth:0.5, height:headerHeight, alignItems:'center'}} >
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
              <View style={{width:64, alignItems:'center'}}>
                <Text style={{fontFamily:'iconfont', fontSize:18, color:'#444',}}>&#xe60a;</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{flex:1}}><Text style={{color:'#444', fontSize:18}}>发布宝贝</Text></View>       
            <TouchableHighlight style={{width:52, marginRight:12, height:28}} onPress={this.onSendPress}>
              <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#f44'}}>
                <Text style={{color:'#fff'}}>发布</Text>
              </View>
            </TouchableHighlight>
        </View>
        <ScrollView 
          style={{flex:1, backgroundColor:'#eee'}} 
          showsVerticalScrollIndicator={false}
        >
          <View style={{backgroundColor:'#fff', paddingLeft:20, paddingRight:20, paddingBottom:20}}>
            <View style={{borderColor:'#ddd', borderBottomWidth:0.5, paddingTop:12, paddingBottom:12}}>
              <KeyboardAvoidingView behavior="height">
              <TextInput
                style={{padding:0, height:26, color:'#333'}}
                underlineColorAndroid="transparent"
                multiline={false}
                value={this.state.titleValue}
                placeholder="标题 简短的宝贝名称"
                autoGrow={false}
                autoFocus={false}
                onChangeText={(text)=>this.setState({titleValue:text})}
              />
              </KeyboardAvoidingView>
            </View>
            <View style={{paddingTop:12}}>
              <TextInput
                style={{padding:0, height:120, color:'#333'}}
                underlineColorAndroid="transparent"
                multiline={true}
                textAlignVertical="top"
                value={this.state.textValue}
                placeholder="描述一下宝贝的细节或故事"
                autoGrow={false}
                autoFocus={false}
                onChangeText={(text)=>this.setState({textValue:text})}
              />
            </View>
            <ImageSelector ref={(ref)=>this.imageSelector=ref} {...this.props}/>
          </View>
          <View style={{marginTop:12, backgroundColor:'#fff'}}>
            <TouchableWithoutFeedback onPress={this.onPriceFieldPress}>
            <View style={{paddingLeft:20, paddingTop:16, paddingBottom:12, flexDirection:'row'}}>
              <Text style={{color:'#222', fontSize:16, flex:1}}>{this.state.priceValue!=''?'￥'+this.state.priceValue:'价格'}</Text>
              <Text style={{fontFamily:'iconfont', fontSize:18, color:'#ccc', paddingRight:20}}>&#xe621;</Text>
            </View>
            </TouchableWithoutFeedback>
            <View style={{height:0.5, backgroundColor:'#eee'}}></View>
            <TouchableWithoutFeedback onPress={this.onCategoryFieldPress}>
            <View style={{paddingLeft:20, paddingTop:16, paddingBottom:12, flexDirection:'row'}}>
              <Text style={{color:'#222', fontSize:16, flex:1}}>{selectedCategoryIndex!=-1?categories[selectedCategoryIndex]:'分类'}</Text>
              <Text style={{fontFamily:'iconfont', fontSize:18, color:'#ccc', paddingRight:20}}>&#xe621;</Text>
            </View>
            </TouchableWithoutFeedback>
            <View style={{height:0.5, backgroundColor:'#eee'}}></View>
            <TouchableWithoutFeedback onPress={this.onLocationFieldPress}>
            <View style={{paddingLeft:20, paddingTop:16, paddingBottom:12, flexDirection:'row'}}>
              <Text style={{color:'#222', fontSize:16, flex:1}}>{selectedLocationIndex!=-1?locations[selectedLocationIndex]:'校区'}</Text>
              <Text style={{fontFamily:'iconfont', fontSize:18, color:'#ccc', paddingRight:20}}>&#xe621;</Text>
            </View>
            </TouchableWithoutFeedback>
          </View>

        </ScrollView>
      </View>
    )
  }

  onPriceChange = (text) => {
    this.setState({priceValue:text});
  }

  onPriceFieldPress = () => {
    this.props.screenProps.showModalComponent((props) => 
      <PriceEditDialog  {...props} 
        price={this.state.priceValue} 
        onPriceChange={this.onPriceChange} />
    );
  }

  onCategoryFieldPress = () => {
    this.props.screenProps.showSlideInMenu(categories, (selectedIndex) => {
      this.setState({selectedCategoryIndex: selectedIndex});
    });
  }

  onLocationFieldPress = () => {
    this.props.screenProps.showSlideInMenu(locations, (selectedIndex) => {
      this.setState({selectedLocationIndex: selectedIndex});
    });
  }

  onSendPress = () => {
    const {
      textValue, 
      titleValue, 
      priceValue,
      selectedCategoryIndex, 
      selectedLocationIndex, 
    } = this.state;
    if (titleValue == '') {
      MyToast.show('宝贝标题不能为空');
    } else if (textValue == '') {
      MyToast.show('宝贝介绍不能为空');
    } else if (this.imageSelector.state.images.length == 0) {
      MyToast.show('需要提供宝贝的图片哦');
    } else if (priceValue == '') {
      MyToast.show('需要指定宝贝价格哦');
    } else if (selectedCategoryIndex == -1) {
      MyToast.show('需要选择宝贝分类哦');
    } else if (selectedLocationIndex == -1) {
      MyToast.show('需要选择所在校区哦');
    } else {
      this.setState({send_ing: true});
      this.imageSelector.uploadImages('sale', (images)=>{
        const imageUrls = images.map((image, index) => image.uploaded_url);
        API.Sale.create({
          title:titleValue, 
          text:textValue, 
          price:parseFloat(priceValue), 
          location:LOCATION[selectedLocationIndex],
          category:CATEGORY[selectedCategoryIndex],
          pics: imageUrls,
        }, (responseJson)=>{
          this.props.navigation.replace('Sale_SalePage', {sale:responseJson});
        }, (error) => {
          MyToast.show('发布宝贝失败'+error.message, {length:'long'});
        });
      }, (error)=>{
        MyToast.show('上传图片失败',  {type:'warning', length:'long'});
        this.props.navigation.setParams({ sending: false });
      });
    }
  }

}
