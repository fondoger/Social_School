'use strict';
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Theme from '../utils/Theme';
import API from '../utils/API_v1';
import { getGMTTimeDiff } from '../utils/Util';
import { withNavigation } from 'react-navigation';
import { IconFont, GroupAvatar, UserAvatar } from '../components/Utils';

function renderSource(status) {
  return (
    <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
      <View style={{flexDirection:'row', alignItems:'center', paddingTop:10, }}>
        <Text style={{borderRadius:10, paddingHorizontal: 5,
              backgroundColor:Theme.themeColor, color:'#fff', fontSize:10, }}>讨论</Text>
        <Text style={{fontSize:12, color:'#aaa'}}>  来自 <Text style={{color: Theme.themeColor}}>{status.group.groupname}</Text> 小组</Text>
      </View>
      <View style={{flex: 1}}/>
    </View>
  )
}

function _GroupPostItem2(props) {
  const item = props.status;
  const onPress = ()=>props.navigation.navigate('Status_StatusPage', {status: item});
  const onPress2 = ()=>props.navigation.navigate('Group_GroupPage', {group: item.group});
  const onPress3 = ()=>props.navigation.navigate('User_UserPage', {user: item.user});
  const textColor = item.replies == 0 ? '#f56262' : '#aaa';
  const iconColor = item.replies == 0 ? "#DEDEDE" :
                item.replies <= 5 ? "#FAD389" :
                item.replies <= 10 ? "#F7B26D" : "#F58A5F";
  return (
    <TouchableHighlight onPress={onPress} underlayColor={Theme.activeUnderlayColor}>
      <View style={{backgroundColor: '#fff'}}>
        { renderSource(item) }
        <View style={{flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 12}}>
          {/* <View style={{width: 64, alignItems: 'center'}}>
            <IconFont icon='&#xe605;' size={16} color={iconColor} />
            <Text style={{fontSize: 12, color: textColor, margin: 4}}>
              { item.replies == 0 ? 'new': item.replies }
            </Text>
          </View> */}
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={{color: '#555', fontWeight: 'bold', fontSize: 15, marginBottom: 8, numberOfLines: 2, lineHeight: 22}}>{item.title}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 4}}>
                  <UserAvatar size={18} user={item.user} hideLogo borderRadius={2}/>
                { props.groupMode ? 
                  <Text style={{fontSize: 12, color: '#777', marginLeft: 4, marginRight: 4}}
                        onPress={onPress2}>{item.group.groupname}</Text>:
                  <Text style={{fontSize: 12, color: '#777', marginLeft: 4, marginRight: 4}}
                        onPress={onPress3}>{item.user.username}</Text>
                }
                <Text style={{fontSize: 11, color:'#bbb'}}>{getGMTTimeDiff(item.timestamp)}</Text>
              </View>
            </View>
            {item.pics.length > 0 ? 
                <Image style={{height: 48, width: 48, borderRadius: 4, marginTop: 2, marginLeft: 8, 
                    borderWidth: .5, borderColor: "rgba(200,200,200,.5)"}} source={{uri:item.pics[0]}} />: 
                null
            }
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}
const GroupPostItem2 = withNavigation(_GroupPostItem2);
export default GroupPostItem2;

// class __GroupPostItem extends React.Component {

//   constructor (props) {
//     super(props);
//     this.state = {
//       status: props.status,
//     }
//   }

//   render() {
//     const status = this.state.status;
//     return (
//       <View style={{backgroundColor:'#fff'}}>
//         { this.props.showSource ? this.renderSource():null}
//         <TouchableHighlight 
//           underlayColor='#aaacad'
//           onPress={()=>this.props.navigation.navigate('Status_StatusPage', {status:status})}
//         >
//           <View style={{padding:12, backgroundColor:'#fff'}}>
//             <Text style={{fontSize:15, fontWeight:'bold', color:'#333'}}>{status.title}</Text>
//             <Text style={{fontSize:14, color:'#444', paddingTop:8, paddingBottom:10}} numberOfLines={3}>{status.text}</Text>
//             {this.renderFooter()}
//           </View>
//         </TouchableHighlight>
//       </View>
//     )
//   };

//   renderFooter() {
//     const status = this.state.status;
//     return (
//       <View style={{flexDirection:'row', alignItems:'center'}} >
//         <UserAvatar {...this.props} size={16} hideLogo={true} user={status.user}/>
//         <Text style={{fontSize:13, color:'#888', marginLeft:4}}>
//           <Text style={{color:'#555'}} onPress={this.jumpToUserPage.bind(this)}>{status.user.username}</Text>
//           <Text style={{color:'#aaa'}}>, {getGMTTimeDiff(status.timestamp,'POSTTIME')}</Text>
//         </Text>
//       </View>
//     )
//   }

//   jumpToUserPage() {
//     this.props.navigation.navigate('User_UserPage', {user: this.state.status.user});
//   };

//   renderSource() {
//     const status = this.state.status;
//     return (
//       <View style={{flexDirection:'row', alignItems:'center', padding:10, borderBottomWidth:0.5, borderColor:'#ddd'}}>
//         <Text style={{paddingLeft:5, paddingRight:5, borderRadius:10,
//               backgroundColor:Theme.themeColor, color:'#fff', fontSize:10}}>讨论</Text>
//         <Text style={{fontSize:12, color:'#aaa'}}>来自<Text style={{color: Theme.themeColor}}>{status.group.groupname}</Text></Text>
//       </View>
//     )
//   }

// }

