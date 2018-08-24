'use strict';
import React from 'react';
import { WebView, View, Text, Alert, TouchableWithoutFeedback, TextInput, TouchableHighlight } from 'react-native';
import { HeaderRight, ContextMenu, ModalMenu } from '../components';
import Storage from '../utils/Storage';
import Theme from '../utils/Theme';

const ScreenWidth = require('Dimensions').get('window').width;

async function getCookie() {
	// Step 1: get csrf
	const login_url = 'https://e.buaa.edu.cn/users/sign_in';
	const response = await timeoutFetch(login_url, 10000);
	const html = await response.text();
	const regex = /csrf-token" content="(.*)"/;
	const csrf = regex.exec(html)[1];
	console.log('Csrf: ' + csrf);
	// Step 2: login to get cookie   
	const formData = new FormData();
	formData.append('utf-8', '✓');
	formData.append('authenticity_token', csrf);
	formData.append('user[login]', username);
	formData.append('user[password]', password);
	formData.append('commit', '登            录');
	const response2 = await timeoutFetch(login_url, {
		method: 'POST',
		body: formData,
	}, 10000);
	if (response2.url !== 'https://e.buaa.edu.cn/') {
		throw 'Login Failed, password error';
	}
	const cookie = response2.headers.get('set-cookie');
	console.log('Cookie: ' + cookie);
	return cookie;
}

async function getCourseTable(cookie) {
	// access welcomeUrl to create new a session
	const welcomeUrl = 'https://10-200-21-61-7001.e.buaa.edu.cn/ieas2.1/welcome';
	await timeoutFetch(welcomeUrl, { headers: { 'Cookie': cookie } }, 10000);
	console.log('Welcom Page');
	const courseUrl = 'https://10-200-21-61-7001.e.buaa.edu.cn/ieas2.1/kbcx/queryXszkb';
	const response3 = await timeoutFetch(courseUrl, { headers: { 'Cookie': cookie } }, 15000);
	const courseHtml = await response3.text();
	console.log(courseHtml);
	const regex = /<table[\s\S]*?<\/table>/;
	const courseTable = regex.exec(courseHtml)[0];
	console.log(courseTable);
	return courseTable;
}

class SsoLoginDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: Storage.sso_username || "",
			password: Storage.sso_password || "",
		}
	}
	render() {
		return (
			<TouchableWithoutFeedback>
				<View style={{ padding: 20, backgroundColor: '#fff', borderRadius: 3, width: 300 }}>
					<Text style={{ color: '#222', fontSize: 18 }}>统一认证登陆</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 24, paddingBottom: 2, borderBottomWidth: 0.5, borderColor: '#ddd' }}>
						<Text style={{ color: '#888', fontSize: 16 }}>账号：</Text>
						<TextInput
							style={{ padding: 0, height: 26, color: '#333', flex: 1, fontSize: 16, marginLeft: 4 }}
							underlineColorAndroid="transparent"
							placeholderColor="#ccc"
							multiline={false}
							placeholder="统一认证登陆账号"
							autoGrow={false}
							autoFocus={false}
							value={this.state.priceValue}
							onChangeText={this.onPriceChange}
						/>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 24, paddingBottom: 2, borderBottomWidth: 0.5, borderColor: '#ddd' }}>
						<Text style={{ color: '#888', fontSize: 16 }}>密码：</Text>
						<TextInput
							style={{ padding: 0, height: 26, color: '#333', flex: 1, fontSize: 16, marginLeft: 4 }}
							underlineColorAndroid="transparent"
							placeholderColor="#ccc"
							multiline={false}
							placeholder="统一认证登陆密码"
							autoGrow={false}
							autoFocus={false}
							value={this.state.priceValue}
							secureTextEntry={true}
							onChangeText={this.onPriceChange}
						/>
					</View>
					<View>
						<TouchableHighlight style={{ marginTop: 24, height: 40 }} onPress={ModalMenu.hide}>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f44' }}>
								<Text style={{ color: '#fff' }}>确定</Text>
							</View>
						</TouchableHighlight>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

export default class KebiaoPage extends React.Component {

	static navigationOptions = ({ navigation }) => ({
		title: '第十四周课表',
		headerTintColor: Theme.lightHeaderTintColor,
		headerStyle: Theme.lightHeaderStyle,
		headerRight: (
			<HeaderRight
				icon='&#xe633;'
				onPress={() => { navigation.state.params.onMoreButtonPress() }}
				tintColor={Theme.lightHeaderTintColor}
				backgroundColor={Theme.lightHeaderStyle.backgroundColor}
			/>
		)
	});

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		}
	}

	syncCourseTable() {
		if (Storage.sso_username == null || Storage.sss_password == null) {
			ModalMenu.showComponent(SsoLoginDialog);
		} else {

		}
	}

	onMoreButtonPress(e) {
		const options = [
			['上次同步：3天前', '\ue781', () => {
				this.syncCourseTable();
			}],
			['周次：第十四周', '\ue603', () => {
				this.props.navigation.navigate('Status_NewStatusPage', { type: API.Status.GROUPSTATUS, group: this.state.group });
			}],
		];
		ContextMenu.showIconMenu(options, { pageX: ScreenWidth - 4, pageY: Theme.statusBarHeight });
	}

	componentDidMount() {
		this.props.navigation.setParams({ onMoreButtonPress: this.onMoreButtonPress.bind(this) });
	}

	render() {
		console.log(require('./kecheng-debug.html'));
		return (
			<View style={{ flex: 1, backgroundColor: '#eee' }}>
				<Text style={{ height: this.state.loading ? null : 0 }}>加载中</Text>
				<WebView
					source={{ html: preCode + exampleCourseTable + afterCode }}
					style={{ width: this.state.loading ? 0 : null }}
					onNavigationStateChange={this._onNavigationStateChange}
					onMessage={event => {
						const obj = JSON.parse(event.nativeEvent.data);
						Alert.alert(obj.title, obj.message);
					}}
					javaScriptEnabled={true}
					domStorageEnabled={true}
				/>
			</View>
		)
	}

	_onNavigationStateChange = (navState) => {
		if (navState.loading == false)
			this.setState({ loading: false });
	}
}


const preCode = `<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=2">
<style>
	body {
	  width: 135vw;
		min-height: 100vh;
		background-color: #e8e8e8;
		margin: 0;
		padding: 0;
	}
	td {
		vertical-align: text-top;
		padding: 3px;
		height: 100px;
	}
	th, td {
		font-size: 9px !important;
	}
	table { 
		border-spacing: 3px;
		border-collapse: separate !important;
	}
</style>
</head>
<body>`
const afterCode = `<script>
document.getElementsByTagName("body")[0].style.backgroundColor = "#e8e8e8";
const trs = document.getElementsByTagName('tr');
const ths = document.getElementsByTagName("th");
const tds = document.getElementsByTagName("td");
ths[0].style.display = "none";
ths[0].style.width = '20px';
ths[0].setAttribute('colspan', '1');
for (var i=0; i<ths.length; i++) {
	ths[i].style.color = "#aaa";
	ths[i].height = 10;
}
tds[tds.length - 1].style.height = 8;
const Colors = ["#98d262", "#e395b4", "#75b7a0", "#8daae1", "#8daae1", "#ef9ea0"];
for (let i=0, j = 0, k = 0; i < tds.length; i++) {
	if (tds[i].width == 20) {
		tds[i].style.display = "none";
	}
	else if (tds[i].innerText != '\u00A0') {
		tds[i].style.backgroundColor = Colors[j++%6];
		tds[i].style.color = "#fff";
		tds[i].onclick = function() {
			const data = { title: '课程信息', message: tds[i].innerText };
			window.postMessage(JSON.stringify(data));
		}
		if (i != tds.length - 1)
			tds[i].style.borderRadius = "3px";
		else {
			tds[i].style.border = "none";
		}
	} 
}
const template = document.createElement('template');
template.innerHTML = '<tr style="color: #c4c4c4;text-align: center; height: 5;"><td style="height:0; padding:0;">午餐</td><td style="height:0; padding:0;">午餐</td><td style="height:0; padding:0;">午餐</td><td style="height:0; padding:0;">午餐</td><td style="height:0; padding:0;">午餐</td><td style="height:0; padding:0;">午餐</td><td style="height:0; padding:0;">午餐</td></tr>';
trs[3].parentNode.insertBefore(template.content.firstChild, trs[3]);
template.innerHTML = '<tr style="color: #c4c4c4;text-align: center; height: 5;"><td style="height:0; padding:0;">晚餐</td><td style="height:0; padding:0;">晚餐</td><td style="height:0; padding:0;">晚餐</td><td style="height:0; padding:0;">晚餐</td><td style="height:0; padding:0;">晚餐</td><td style="height:0; padding:0;">晚餐</td><td style="height:0; padding:0;">晚餐</td></tr>';
trs[6].parentNode.insertBefore(template.content.firstChild, trs[6]);

</script>
</body>
</html>`;
const exampleCourseTable = `<table width="100%"  cellpadding="0" cellspacing="0" style="border-collapse:collapse" class="addlist_01">
<tr>
<th width="40" height="30" colspan="2">&nbsp;</th>
<th>星期一</th>
<th>星期二</th>
<th>星期三</th>
<th>星期四</th>
<th>星期五</th>
<th>星期六</th>
<th>星期日</th>
</tr>

<tr >
<td	width="20">上午</td>
<td	width="20">第1,2节</td>
<td	width="118">&nbsp</td>
<td	width="118">概率统计A</br>张奇业[1-17周]J3-412
第1，2节</td>
<td	width="118">&nbsp</td>
<td	width="118">&nbsp</td>
<td	width="118">概率统计A</br>张奇业[1-17单周]J3-412
第1，2节</td>
<td	width="118">&nbsp</td>
<td	width="122">&nbsp</td>
</tr>

<tr class="bgcol">
<td	width="20">上午</td>
<td	width="20">第3,4节</td>
<td	width="118">&nbsp</td>
<td	width="118">体育（3）(篮球1)</br>刘	菁[1-17周]
第3节</td>
<td	width="118">计算机组成</br>牛建伟[1-17周]J3-201
第3，4节</td>
<td	width="118">&nbsp</td>
<td	width="118">计算机组成</br>牛建伟[1-17周]J3-201
第3，4节</td>
<td	width="118">&nbsp</td>
<td	width="122">&nbsp</td>
</tr>

<tr >
<td	width="20">下午</td>
<td	width="20">第5,6节</td>
<td	width="118">&nbsp</td>
<td	width="118">思想政治理论课——概论</br>刘	莹[1-17周]J3-310
第5，6节</td>
<td	width="118">&nbsp</td>
<td	width="118">算法设计与分析</br>韩	军，盛	浩，许	可[1-13周]J0-001
第5，6节</td>
<td	width="118">计算机组成课程设计</br>张	亮[6-17周]
第5，6节</br>职业规划与选择讲座</br>刘	睿[1-5周]J0-002
第5，6节</td>
<td	width="118">&nbsp</td>
<td	width="122">&nbsp</td>
</tr>

<tr class="bgcol">
<td	width="20">下午</td>
<td	width="20">第7,8节</td>
<td	width="118">音乐作品分析与欣赏</br>苏丹娜[2-17周]J3-107
第7，8节</td>
<td	width="118">思想政治理论课——概论</br>刘	莹[1-17周]J3-310
第7节</td>
<td	width="118">智能计算概论</br>巢文涵，丁	嵘，黄	迪，刘庆杰，王蕴红，张小明，张永飞[1-17周]J3-410
第7，8节</td>
<td	width="118">&nbsp</td>
<td	width="118">计算机组成课程设计</br>张	亮[6-17周]
第7，8节</td>
<td	width="118">&nbsp</td>
<td	width="122">&nbsp</td>
</tr>

<tr >
<td	width="20">晚上</td>
<td	width="20">第9,10节</td>
<td	width="118">&nbsp</td>
<td	width="118">现代大学概论</br>刘沛清[2-17周]J0-002
第9，10节</td>
<td	width="118">&nbsp</td>
<td	width="118">&nbsp</td>
<td	width="118">&nbsp</td>
<td	width="118">&nbsp</td>
<td	width="122">&nbsp</td>
</tr>

<tr class="bgcol">
<td	width="20">晚上</td>
<td	width="20">第11,12节</td>
<td	width="118">&nbsp</td>
<td	width="118">&nbsp</td>
<td	width="118">&nbsp</td>
<td	width="118">&nbsp</td>
<td	width="118">&nbsp</td>
<td	width="118">&nbsp</td>
<td	width="122">&nbsp</td>
</tr>



<tr><td colspan="9">其它课程： 基础物理实验B(1)◇李朝荣◇1-17◇合班	博雅课程（文化素质拓展）(3)◇宋立军◇1-16◇  
</td></tr>




</table>`;