'use strict';
import { Platform } from 'react-native';
import Storage from './Storage';

const prodServer = 'http://47.93.240.135/api/v1';
const debugServer = 'http://10.137.154.170:5000/api/v1';
const base64 = require('base-64');


const loginManager = new Object();

function send_request(url, successCallback, errorCallback, args) {
  const { method, loginRequired, username, password, params } = args;
  var _method = method ? method: 'GET';
  const headers = new Headers();
  /* check debug mode */
  const domain =  Storage.useDebugServer ? debugServer: prodServer;
  //const domain = prodServer;
  /* Check login, get login info */
  url = `${domain}${url}`;
  if (username && password)
    headers.append('Authorization', 'Basic '+base64.encode(`${username}:${password}`));
  // Get Token here
  else if (Storage.token)
    headers.append('Authorization', 'Basic '+base64.encode(`${Storage.token}:`));
  else if (loginRequired) {
    errorCallback({'error': 'login requied', message: '该操作需要登陆'});
    if (loginManager.callback)
      loginManager.callback();
    return;
  }
  const makeJsonRequest = _method==='POST' || _method==='PUT' || _method==='PATCH';
  if (makeJsonRequest) {
    headers.append('Content-Type', 'application/json');
  } else if (params) {
      var query = Object.keys(params)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&');
      url = `${url}?${query}`;
  }
  fetch(url, {
    method: _method,
    headers: headers,
    body: makeJsonRequest&&params ? JSON.stringify(params): null,
  })
  .then((response) => response.json())
  .then((responseJson) => {
    if (responseJson.error)
      errorCallback(responseJson);
    else
      successCallback(responseJson);
  })
  .catch((error) => {
    errorCallback(error);
  });
}

const User = {
  get: (params, successCallback, errorCallback) => {
    send_request('/user', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  },
  waiting: (params, successCallback, errorCallback) => {
    // params = { email, password }
    send_request('/user/waiting', successCallback, errorCallback, {
      method: 'POST',
      params: params,
    });
  },
  create: (params, successCallback, errorCallback) => {
    // user email must be added to waiting users to get a verification code
    // params = { email, verification_code }
    send_request('/user', successCallback, errorCallback, {
      method: 'POST',
      params: params,
    });
  },
  put: (params, successCallback, errorCallback) => {
    send_request('/user', successCallback, errorCallback, {
      method: 'PUT',
      params: params,
      loginRequired: true,
    });
  },
}

const UserFollowed = {
  get: (params, successCallback, errorCallback) => {
    send_request('/user/followed', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  },
  create: (params, successCallback, errorCallback) => {
    send_request('/user/followed', successCallback, errorCallback, {
      method: 'POST',
      params: params,
      loginRequired: true,
    });
  },
  delete: (params, successCallback, errorCallback) => {
    send_request('/user/followed', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    });
  },
}

const UserGroup = {
  get: (params, successCallback, errorCallback) => {
    // params={id:user_id, limit, count}
    send_request('/user/group', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  },
}

const UserFollower = {
  get: (params, successCallback, errorCallback) => {
    send_request('/user/follower', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  }
}

const Status = {
  create: (params, successCallback, errorCallback) => {
    // Paarms = {text: 微博正文}
    send_request('/status', successCallback, errorCallback, {
      method:'POST',
      params: params, 
      loginRequired: true,
    });
  },
  get: (params, successCallback, errorCallback) => {
    // Params = {id: 要获取的id}
    send_request('/status', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  },
  delete: (params, successCallback, errorCallback) => {
    // params = {id: 要删除的id}
    send_request('/status', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    });
  },
  USERSTATUS: 0,
  GROUPSTATUS: 1,
  GROUPPOST: 2,
}

const StatusReply = {
  create: (params, successCallback, errorCallback) => {
    // params = {id: 某个动态的id}
    send_request('/status/reply', successCallback, errorCallback, {
      method: 'POST',
      params: params,
      loginRequired: true,
    });
  },
  get: (params, successCallback, errorCallback) => {
    // 通用参数: {limit: 可选, 默认为10, }
    // 顺序浏览params = {min_timestamp: 可选, }
    // 逆序浏览params = {reverse:true, max_timestamp: 可选, }
    send_request('/status/reply', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  },
  delete: (params, successCallback, errorCallback) => {
    // params = {id: 动态的某个回复的id}
    send_request('/status/reply', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    })
  },
}

const StatusLike = {
  create: (params, successCallback, errorCallback) => {
    // Paarms = {id: 欲点赞的动态的id}
    send_request('/status/like', successCallback, errorCallback, {
      method:'POST',
      params: params, 
      loginRequired: true,
    });
  },
  delete: (params, successCallback, errorCallback) => {
    // params = {id: 欲取消点赞的动态的id}
    send_request('/status/like', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    });
  },
}

const StatusReplyLike = {
  create: (params, successCallback, errorCallback) => {
    // Paarms = {id: 欲点赞的回复的id}
    send_request('/status/reply/like', successCallback, errorCallback, {
      method:'POST',
      params: params, 
      loginRequired: true,
    });
  },
  delete: (params, successCallback, errorCallback) => {
    // params = {id: 欲取消点赞的回复的id}
    send_request('/status/reply/like', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    });
  },
}

const Group = {
  create: (params, successCallback, errorCallback) => {
    // params = { groupname: , avatar: 可选 }
    send_request('/group', successCallback, errorCallback, {
      method: 'POST',
      params: params,
      loginRequired: true,
    });
  },
  get: (params, successCallback, errorCallback) => {
    // params = { id: , type:[hot, public, new] }
    send_request('/group', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  },
  delete: (params, successCallback, errorCallback)=>{
    // params = { id: }
    send_request('/group', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    });
  }
}

const Activity = {
  create: (params, successCallback, errorCallback) => {
    /* Params = {
          group_id: 团体id,
          title: 活动标题,
          keyword: 活动关键字,
          description: '活动描述', 可选, 
          picture: 活动图片, 可选,
      }
    */
    send_request('/activity', successCallback, errorCallback, {
      method:'POST',
      params: params, 
      loginRequired: true,
    });
  },
  get: (params, successCallback, errorCallback) => {
    /*
      1. 获取特定的某个活动
          params = {id} 
      2. 获取最新活动
          params = {type: new, last_id: 可选}
      3. 获取热门活动
          params = {type: hot}
    */
    send_request('/activity', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  },
  delete: (params, successCallback, errorCallback) => {
    // params = {id: 欲删除的活动id}
    send_request('/activity', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    });
  },
}

const Other = {
  token: (email, password, successCallback, errorCallback) => {
    send_request('/token', successCallback, errorCallback, {
      method: 'GET',
      username: email,
      password: password,
    });
  },
  update: (successCallback, errorCallback) => {
    send_request('/update', successCallback, errorCallback, {
      method: 'GET',
      params: {platform: Platform.OS },
    });
  }
}

const Sale = {
  create: (params, successCallback, errorCallback) => {
    send_request('/sale', successCallback, errorCallback, {
      method: 'POST',
      params: params,
      loginRequired: true,
    });
  },
  get: (params, successCallback, errorCallback) => {
    send_request('/sale', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  },
  put: (params, successCallback, errorCallback) => {
    send_request('/sale', successCallback, errorCallback, {
      method: 'PUT',
      params: params,
    });
  },
  delete: (params, successCallback, errorCallback) => {
    send_request('/sale', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    });
  },
}

const SaleComment = {
  create: (params, successCallback, errorCallback) => {
    send_request('/sale/comment', successCallback, errorCallback, {
      method: 'POST',
      params: params,
      loginRequired: true,
    });
  },
  delete: (params, successCallback, errorCallback) => {
    send_request('/sale/comment', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    });
  }
}

const SaleLike = {
  create: (params, successCallback, errorCallback) => {
    send_request('/sale/like', successCallback, errorCallback, {
      method: 'POST',
      params: params,
      loginRequired: true,
    });
  },
  get: (params, successCallback, errorCallback) => {
    send_request('/sale/like', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  },
  delete: (params, successCallback, errorCallback) => {
    send_request('/sale/like', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    });
  },
}

const Topic = {
  get: (params, successCallback, errorCallback) => {
    send_request('/topic', successCallback, errorCallback, {
      method: 'GET',
      params: params,
    });
  },
}

const Message = {
  create: (params, successCallback, errorCallback) => {
    send_request('/message', successCallback, errorCallback, {
      method: 'POST',
      params: params,
      loginRequired: true,
    });
  },
  get: (params, successCallback, errorCallback) => {
    send_request('/message', successCallback, errorCallback, {
      method: 'GET',
      params: params,
      loginRequired: true,
    });
  },
  update: (params, successCallback, errorCallback) => {
    send_request('/message', successCallback, errorCallback, {
      method: 'PUT',
      params: params,
      loginRequired: true,
    });
  },
  delete: (params, successCallback, errorCallback) => {
    send_request('/message', successCallback, errorCallback, {
      method: 'DELETE',
      params: params,
      loginRequired: true,
    });
  },
}

function registerLoginRequired(func) {
  loginManager.callback = func;
}

const API = {
  Other,
  User,
  UserFollowed,
  UserFollower,
  UserGroup,
  Status,
  StatusReply,
  StatusLike,
  StatusReplyLike,
  Group,
  Activity,
  registerLoginRequired,
  Sale,
  SaleLike,
  SaleComment,
  Topic,
  Message,
}

export default API;
