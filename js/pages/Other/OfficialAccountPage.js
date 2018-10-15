'use strict';
import React from 'react';
import { 
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from '../../utils/Theme';
import API from '../../utils/API_v1';
import Storage from '../../utils/Storage';
import { Loading, OfficialAccountAvatar, DividingLine } from '../../components';
import MyToast from '../../components/MyToast';


export default class OfficialAccountPage extends React.Component {

  static navigationOptions = {
      title: "订阅号",
  };
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      load_ing: true,
      load_err: false,
    }
  }
  makeRemoteRequest = () => {
    this.setState({load_ing: true, load_err: false});
    API.OfficialAccount.get({type: 'all'}, (responseJson) => {
      this.setState({load_ing: false, load_err: false, items: responseJson});
    }, error => {
      this.setState({load_ing: true, load_err: true});
    });
  }
  componentDidMount() {
    this.makeRemoteRequest();
  }

  goToDetailPage(item) {    
    let injectedJavaScript = null;
    if (item.page_url.includes('weixin.sogou.com')) {
      injectedJavaScript = `window.location.replace(document.getElementsByClassName('wx-news-list2')[0].getElementsByTagName('a')[0].href)`;
    }
    this.props.navigation.navigate('Common_WebviewPage', {
      url: item.page_url,
      injectedJavaScript: injectedJavaScript,
    });
  }

  renderAccountItem({item, index}) {
    const display_name = item.accountname;
    return (
      <TouchableHighlight onPress={()=>this.goToDetailPage(item)}>
      <View style={{backgroundColor: '#fff'}}>
        <View style={{flexDirection:'row', padding: 12, alignItems:'center'}}>
            <OfficialAccountAvatar account={item} size={44} />
            <View style={{paddingLeft:12, flex: 1}}>
                <Text style={{fontSize:15, color:'#000'}}>
                    {display_name}
                </Text>
                <Text style={{fontSize:12, color:'#666'}} >
                    { item.description }
                </Text>
            </View>
            <FollowButton id={item.id} followed_by_me={item.followed_by_me} />
        </View>
        <DividingLine color="#eee" paddingLeft={12} paddingRight={12}/>
      </View>
      </TouchableHighlight>
    )
  }

  render() {    
    if (this.state.load_ing || this.state.load_err) {
        return (
          <Loading
            style={{ backgroundColor: '#eee' }}
            fullScreen={true}
            error={this.state.load_err}
            error_msg="加载失败, 点击重试..."
            onRetry={this.makeRemoteRequest.bind(this)}
          />
        );
    }
    return (
      <FlatList
        style={{backgroundColor: '#fff'}}
        data={this.state.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={this.renderAccountItem.bind(this)}
      />
    )
  }
}

class FollowButton extends React.Component {
    /* followed, onFollow(successCallback, errorCallback), onUnfollow() */
    constructor(props) {
        super(props);
        this.state = {
            following: false,
            unfollowing: false,
            followed_by_me: props.followed_by_me,
        }
    }
    onUnfollowPress = ()=>{
        this.setState({unfollowing: true});
        API.OfficialAccountSubscription.delete({id: this.props.id}, (responseJson) => {
            this.setState({unfollowing: false, followed_by_me: false});
        }, (error) => {
            this.setState({unfollowing: false});
            MyToast.show("操作失败");
        });
    }
    onFollowPress = ()=>{
        this.setState({following: true});
        API.OfficialAccountSubscription.create({id: this.props.id}, (responseJson) => {
            this.setState({following: false, followed_by_me: true});
        }, (error) => {
            this.setState({following: false});
            MyToast.show("操作失败");
        });
    }
    renderUnfollowButton = () => {
      return (
        <TouchableWithoutFeedback onPress={this.onUnfollowPress} >
          <View style={{width: 60, height:30, backgroundColor: '#ddd', flexDirection: 'row',
              justifyContent:'center', alignItems:'center', borderRadius:3, borderWidth:1, borderColor:'#ddd'}}>
            { this.state.unfollowing ? <ActivityIndicator style={{marginRight:12,}} size='small' color="#666" />:
              <Text style={{color:'#666', fontSize:14}}>已关注</Text>}
          </View>
        </TouchableWithoutFeedback>
      )
    }
    renderFollowButton = () => {
      return (
        <TouchableWithoutFeedback onPress={this.onFollowPress} >        
          <View style={{ width: 60, height:30, flexDirection: 'row',
              justifyContent:'center', alignItems:'center', borderRadius:3, borderWidth:1, borderColor:Theme.themeColor}}>
            { this.state.following ? <ActivityIndicator style={{marginRight:12,}} size='small' color={Theme.themeColor} /> :
              <Text style={{color:Theme.themeColor, fontSize:14}}>关注</Text> }
          </View>
        </TouchableWithoutFeedback>
      )
    };
    render() {
        return (this.state.followed_by_me ? 
            this.renderUnfollowButton():
            this.renderFollowButton() 
        );
    }
}
