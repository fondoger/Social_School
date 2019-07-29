'use strict';
import React from 'react';
import { 
  View,
  Text, 
  Image, 
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
import { getPassedTime } from '../../utils/Util';
import Storage from '../../utils/Storage';
import { MyToast, SaleItem, IconFont } from '../../components';

const _window = require('Dimensions').get('window');
const ScreenWidth = _window.width;
const ScreenHeight = _window.height;
const StatusBarHeight = (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight);
const headerHeight = Theme.headerHeight + StatusBarHeight;

export default class PersonalPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      user: props.navigation.state.params.user,
      simpleHeader: true,
      sales: [],
    }
  }

  componentDidMount() {
    const {user, sales} = this.state;
    API.Sale.get({user_id:user.id}, (responseJson)=>{
      this.setState({sales:responseJson});
    }, (error) => {
      //
    });
  }

  render() {
    const { user, simpleHeader }= this.state;
    const title = Storage.user && Storage.user.id == user.id ? '我': user.username;
    return (
    <View style={{flex:1}}>
      <View style={{backgroundColor:'#fafbfd', paddingTop:StatusBarHeight, flexDirection:'row',
        borderColor:'#ddd', borderBottomWidth:0.5, height:headerHeight, alignItems:'center'}} >
        <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
          <IconFont size={20} color="#888" style={{paddingHorizontal: 20}} icon="&#xe60a;" />
        </TouchableWithoutFeedback>
        <View style={{flex:1}}><Text style={{color:'#444', fontSize:18}}>{title}的宝贝</Text></View>       
        {Storage.user&&Storage.user.id==user.id?
          <TouchableHighlight style={{width: 54,}} 
                              onPress={()=>this.props.navigation.navigate("Sale_EditSalePage")}>
            <View style={{flex:1, backgroundColor:'#fafbfd', justifyContent:'center', alignItems:'center'}}>
              <Text style={{fontFamily:'iconfont', fontSize:22, color:'#555'}}>&#xe633;</Text>
            </View>
          </TouchableHighlight>: null
        }
      </View>
      <FlatList
        data={this.state.sales}
        keyExtractor={((item, index) => `${item.id}+${item.likes}+${item.replies}`)}
        renderItem={this.renderByType.bind(this)}
        onEndReached={this.handleLoadMore}
        ItemSeparatorComponent={()=><View style={{height:8}}></View>}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.01}
        onScroll={this.handleScroll}
        ListFooterComponent={this.renderFooter}
        ListHeaderComponent={()=><View style={{height:4}}></View>}
        />
    </View>
    )
  }


  renderFooter = () => {
    return (
      <View style={{height:60, justifyContent:'center', alignItems:'center'}} >
        <Text>没有更多内容</Text>
      </View>
    )
  }

  renderByType(_item) {
    const { index, item } = _item;
    return <SaleItem {...this.props} sale={item} />
  }
}