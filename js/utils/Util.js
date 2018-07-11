// import Emotion from './Emotion'
// export default function(text) {
//   console.log("text"+text);
//   var regexp = new RegExp(`((${Emotion.regexp})|#[\\s\\S]+?#|@[\\u4e00-\\u9fa5_a-zA-Z0-9\\-]+)`, 'g');
//   var contentArray = [];
//   var regArray = text.match(regexp);
//   console.log(regArray);
//   if (!regArray)
//     regArray = [];
//   var pos = 0;
//   for (let i = 0; i < regArray.length; i++) {
//     var t = text.indexOf(regArray[i], pos);
//     if (t != pos) {
//       contentArray.push({'text': text.substring(pos, t)});
//       pos = t;
//     }
//     var t2 = pos + regArray[i].length;
//     if (text[pos]=='[') { // emotion
//       contentArray.push({'emotion': text.substring(pos, t2)})
//     }
//     else if (text[pos]=='@') {
//       contentArray.push({'at': text.substring(pos+1, t2)})
//     } 
//     else if (text[pos]=='#') { // topic
//       contentArray.push({'topic': text.substring(pos+1, t2-1)});
//     }
//     else {
//       console.log('impossible');
//     }
//     pos = t2;
//   }
//   if (pos != text.length) {
//     contentArray.push({'text': text.substring(pos, text.length)});
//   }
//   return contentArray;
// }      

function isYestday(theDate, nowDate){
    var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime(); //今天凌晨 
    var yestday = new Date(today - 24*3600*1000).getTime();
    return theDate.getTime() < today && yestday <= theDate.getTime();
}

function isTheDayBeforeYestday(theDate, nowDate){
    var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime(); //今天凌晨
    var yestday = new Date(today - 24*3600*1000).getTime();
    var theDayBeforeYestday = new Date(today - 48*3600*1000).getTime();
    return theDate.getTime() < yestday && theDayBeforeYestday <= theDate.getTime();
}

export function calcGMTTimeDiff(GMTString, GMTString2) {
  var timespan = Date.parse(GMTString);
  var timespan2 = Date.parse(GMTString2);
  var minutes = Math.round(Math.abs((timespan2 - timespan)/1000/60));
  return minutes;
};

export function getGMTTimeDiff(GMTString, type) {
  var timespan = Date.parse(GMTString);
  var dateTime = new Date(timespan);
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var now = new Date();
  var now_new = Date.parse(now.toUTCString());  //typescript转换写法
  var year_new = now.getFullYear();
  var day_new = now.getDate();
  var hour_new = now.getHours();
  var timeSpanStr;
  var minutes = Math.round((now_new - timespan)/1000/60);
  if (minutes < 1)
    return '刚刚';
  if (minutes < 60)
    return minutes + '分钟前';
  var hours = Math.round(minutes / 60);
  var hour_min = hour + ':' + ('0' +minute).slice(-2);
  if (hours < 24 && day==day_new) {
    return hour_min;
  }
  if (isYestday(dateTime, now))
    return '昨天 '+hour_min;
  if (isTheDayBeforeYestday(dateTime, now))
    return '前天 '+hour_min;
  if (year == year_new)
    return type==='POSTTIME' ? 
           `${month}月${day}日` :
           `${month}-${day} ${hour_min}`;
  return type === 'POSTTIME' ?
         `${year}年${month}月${day}日`:
         `${year}-${month}-${day} ${hour_min}`;
};

export function getPassedTime(GMTString) {
  var timespan = Date.parse(GMTString);
  var dateTime = new Date(timespan);
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var now = new Date();
  var now_new = Date.parse(now.toUTCString());  //typescript转换写法
  var year_new = now.getFullYear();
  var day_new = now.getDate();
  var hour_new = now.getHours();
  var timeSpanStr;
  var minutes = Math.round((now_new - timespan)/1000/60);
  if (minutes < 1)
    return '刚刚';
  if (minutes < 60)
    return minutes + '分钟前';
  var hours = Math.round(minutes / 60);
  if (hours < 24 && day==day_new) {
    return hours + '小时前';
  }
  if (isYestday(dateTime, now))
    return '昨天';
  if (isTheDayBeforeYestday(dateTime, now))
    return '前天';
  var days = Math.round(hours / 24)
  if (days <= 30)
    return days + '天前'
  var months = Math.round(months / 30)
  if (months <= 12)
    return months + '个月前'
  var years = Math.round(months / 12)
  return years + '年前';
};

export function getSaleTime(GMTString) {
  var timespan = Date.parse(GMTString);
  var dateTime = new Date(timespan);
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var now = new Date();
  var now_new = Date.parse(now.toUTCString());  //typescript转换写法
  var year_new = now.getFullYear();
  var day_new = now.getDate();
  var hour_new = now.getHours();
  var timeSpanStr;
  var minutes = Math.round((now_new - timespan)/1000/60);
  if (minutes < 5)
    return '刚刚擦亮';
  if (minutes < 60)
    return minutes + '分钟前';
  var hours = Math.round(minutes / 60);
  if (hours < 24 && day==day_new) {
    return hours + '小时前';
  }
  if (isYestday(dateTime, now))
    return '昨天';
  if (isTheDayBeforeYestday(dateTime, now))
    return '前天';
  var days = Math.round(hours / 24)
  if (days <= 30)
    return days + '天前'
  var months = Math.round(months / 30)
  if (months <= 12)
    return months + '个月前'
  var years = Math.round(months / 12)
  return years + '年前';
};