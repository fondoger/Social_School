'use strict';
import React from 'react';
import { 
  View,
  Text, 
  Image, 
  FlatList, 
  TextInput, 
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { getSaleTime } from '../../utils/Util';
import { SlideInMenu, ModalMenu } from '../../components';

const locations = ['不限', '学院路校区', '沙河校区'];
const categories = ['不限', '学习&书籍', '数码&电器', '生活&日用', '户外&文体', '票券&其他'];
const CATEGORY = ['all', 'study', 'digital', 'life', 'outdoors', 'other'];
const LOCATION = ['all', 'xueyuanlu', 'shahe'];
const priceOrders = ['(默认) 时间序', '价格由低到高', '价格由高到低'];

export default class SquarePage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      sales: [],
      load_more_error: false,
      loading: false,
      selectedCategoryIndex: 0,
      selectedLocationIndex: 0,
      selectedPriceOrderIndex: 0,
    }
  }

  refreshSales = () => {
    const { selectedCategoryIndex, selectedPriceOrderIndex, selectedLocationIndex } = this.state;
    this.setState({loading:true});
    API.Sale.get({location:LOCATION[selectedLocationIndex], category: CATEGORY[selectedCategoryIndex]}, (responseJson)=>{
      this.setState({sales: responseJson, loading:false});
    }, (err)=>{
      this.setState({load_more_error: true, loading:false});
    });
  }

  componentDidMount() {
    this.refreshSales();
  }

  renderHeader = () => {
    const {selectedCategoryIndex, selectedLocationIndex, selectedPriceOrderIndex } = this.state;
    const inactiveStyle = {color:'#888'};
    const activeStyle = {color:'#555', fontWeight:'bold'};
    return (
      <View style={{backgroundColor:'#fafbfd', paddingTop:32,
            borderColor:'#ccc', borderBottomWidth:0.5,}} >
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
            <View style={{paddingLeft:20, paddingRight:20}}>
              <Text style={{fontFamily:'iconfont', fontSize:20, color:'#888',}}>&#xe60a;</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={{flex:1, borderColor:'#ddd', borderWidth:1, borderRadius:3,
                backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontFamily:'iconfont', fontSize:25, color:'#aaa', paddingLeft:10, paddingRight:2}}>&#xe6c8;</Text>
            <TextInput 
              style={{flex:1, padding:0, margin:0, fontSize:12, color:'#000', height:32}}
              underlineColorAndroid="transparent"
              multiline = {false}
              placeholder='搜索宝贝'
            />
          </View> 
          <Text style={{fontSize:15, color:'#222', paddingLeft:16, paddingRight:16}}
                onPress={()=>{
                  if (Storage.user)
                    this.props.navigation.navigate('Sale_PersonalPage', {user:Storage.user})
                  else
                    this.props.navigation.navigate('Common_LoginPage');
                }}>我的</Text>
        </View>
        <View style={{flexDirection:'row',}}>
          <TouchableWithoutFeedback onPress={this.onLocationFieldPress}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:10,}}>
              <Text style={selectedLocationIndex!=0?activeStyle:inactiveStyle}>{selectedLocationIndex!=0?locations[selectedLocationIndex]: '校区'}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.onCategoryFieldPress}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:10,}}>
              <Text style={selectedCategoryIndex!=0?activeStyle:inactiveStyle}>{selectedCategoryIndex!=0?categories[selectedCategoryIndex]: '分类'}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.onPriceFieldPress}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:10,}}>
              <Text style={selectedPriceOrderIndex!=0?activeStyle:inactiveStyle}>{selectedPriceOrderIndex!=0?priceOrders[selectedPriceOrderIndex]: '排序'}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }

  renderSaleItem = (sale) => {
    const {item, index} = sale;
    if (item.fill)
      return <View style={{flex:1, margin:2}}><View style={{flex:1}}></View></View>
    return (
      <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Sale_SalePage', {sale:item})} >
        <View style={{flex:1, margin:2, backgroundColor:'#fff'}}>
          <View style={{flex:1, aspectRatio:1, backgroundColor:'#f3f5f9'}}>
            <Image style={{flex:1}} source={{uri:item.pics[0]+'!mini5'}}/>
          </View>
          <View style={{padding:12, paddingTop:8, paddingBottom:8}}>
            <Text style={{fontSize:15, color:'#222'}} numberOfLines={1}>{item.title}</Text>
            <Text style={{fontSize:15, color:'#f44', paddingTop:6, paddingBottom:6, marginLeft:-2}}>￥{item.price}</Text>
            <Text style={{fontSize:12, color:'#888'}}>{item.location=='shahe'?'沙河校区':'学院路校区'}</Text>
            <Text style={{fontSize:12, position:'absolute', right:8, bottom:8}}>{getSaleTime(item.updated_at)}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  };

  renderFooter = () => {
    return (
      <View style={{height:60, justifyContent:'center', alignItems:'center'}} >
        <Text>没有更多内容</Text>
      </View>
    )
  }

  renderListEmptyComponent = () => {
    return (
      <View style={{flex:1, backgroundColor:'#eee', paddingTop:100, alignItems:'center'}}>
        { this.state.loading ? 
          <View style={{alignItems:'center'}}>
            <Image style={{width:100,height:100}} source={require('../../../img/buaa_logo_stick_tongue.png')}/>
          </View>: 
          <TouchableWithoutFeedback onPress={this.refreshSales} >
            <View style={{alignItems:'center'}}>
              <Image style={{width:100,height:100}} source={require('../../../img/buaa_logo_awkward.png')}/>
              <Text style={{fontSize:16, color:'#0173b9', marginTop:8, opacity:0.8}}>加载失败, 点击重试</Text>
            </View>
          </TouchableWithoutFeedback>
        }
      </View>
    )
  }

  render() {
    const sales = this.state.sales;
    return (
      <View style={{flex:1, backgroundColor:'#eee'}} >
        {this.renderHeader()}
        {sales.length == 0 ? this.renderListEmptyComponent():
          <FlatList
            style={{ flex:1, margin:-2, paddingTop:4}}
            numColumns={2}
            data={sales.length%2==1?[...sales, {id:-1, fill:true}]:sales}
            keyExtractor={((item, index) => item.id.toString())}
            renderItem={this.renderSaleItem}
            onEndReachedThreshold={0.05}
            ListFooterComponent={this.renderFooter}
            showsVerticalScrollIndicator={false}
          />
        }
      </View>
    )
  }

  onCategoryFieldPress = () => {
    SlideInMenu.showMenu(categories, (selectedIndex) => {
      this.setState({selectedCategoryIndex: selectedIndex}, this.refreshSales);
    });
  }

  onLocationFieldPress = () => {
    SlideInMenu.showMenu(locations, (selectedIndex) => {
      this.setState({selectedLocationIndex: selectedIndex}, this.refreshSales);
    });
  }

  onPriceFieldPress = () => {
    SlideInMenu.showMenu(priceOrders, (selectedIndex) => {
      this.setState({selectedPriceOrderIndex: selectedIndex});
    });
  }

}
