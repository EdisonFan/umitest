/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import { message } from 'antd';
import { history } from 'umi';
import { extend } from 'umi-request';

message.config({
  duration: 2,
  maxCount: 1,
});

/**
 * 异常处理程序
 */
let flag = false;

const errorHandler = async (error) => {
  const { response } = error;
  if (error && error.type && error.type === 'Timeout') {
    message.error(`请求超时`);
    return { data: null, code: '', msg: '请求超时', message: '请求超时' };
  }
  const { status, url } = response;
  if (response.status === 401 && !flag) {
    if (window.location.pathname !== '/user/login' && !flag) {
      if (window.__POWERED_BY_QIANKUN__) {
        flag = true;
        const str = window.location.href;
        const arr = str.split('#')?.[0]?.split('/');
        const indexHome = arr.indexOf('home');
        const path = arr.splice(indexHome, 2).join('/');
        window.location.href = `/${path}/#/user/login`;
      } else {
        await history.replace({
          pathname: '/user/login',
        });
      }
      message.error('登录失效，请重新登录');
      return response;
    }
  } else if (response.status === 403) {
    message.error(`请求错误 ${status}: ${url}`);
    return { data: null, code: '', msg: '请求 403 错误', message: '请求 403 错误' };
  } else if (response.status === 404) {
    message.error('请求地址不存在');
    return { data: null, code: '', msg: '请求地址不存在', message: '请求地址不存在' };
  } else if (response.status === 504) {
    message.error(`网关超时 ${status}: ${url}`);
    return { data: null, code: '', msg: '网关超时', message: '网关超时' };
  }
  if (!response || response.status === 502) {
    message.error('服务端错误');
    return { data: {}, code: '', msg: '服务端错误', message: '服务端错误' };
  }
  return error?.data ?? response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler,
  // 默认错误处理
  // credentials: 'include', // 默认请求是否带上 cookie
  timeout: 120000,
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('x-okapi-token') ;
  const headers = {
    'Content-Type': 'application/json',
    Accept: '*/*',
    'referer-x':location.href,
    host: 'http://106.119.167.29:90',
  };

  if (options.headers['Content-Type'] === 'multipart/form-data') {
    delete headers['Content-Type'];
  }
  return {
    url: `${url}`, // api基础配置，暂时写死
    options: {
      ...options,
      headers,
    
    },
  };
});

const folioErrorTranslate = [
  { msg: 'Password does not match', chinese: '登录名或密码错误' }, // 密码不匹配
  { msg: 'User must be flagged as active', chinese: '用户未激活' },
  { msg: 'Error verifying user existence: No user found by username', chinese: '此用户不存在' },
  { msg: 'You must provide a username or userId', chinese: '用户名不能为空' },
  { msg: 'No credentials match that login', chinese: '没有凭据与该登录名匹配' },
  { msg: 'Error verifying user existence', chinese: '登录名或密码错误' }, // Error verifying user existence, 验证用户存在错误
  { msg: 'User could not be verified as active', chinese: '用户无法被核实为活跃用户' },
  { msg: 'Error retrieving stored hash and salt from credentials', chinese: '凭证验证错误' },
];

// response 拦截器, 处理 response
request.interceptors.response.use(async (response) => {
  // 200/201/400/422/500状态码在拦截器处理。其他状态码在errorHandler处理
  if (
    response &&
    response.status &&
    response.status !== 200 &&
    response.status !== 201 &&
    response.status !== 400 &&
    response.status !== 422 && // folio接口返回错误在此处理
    response.status !== 500
  ) {
    
    return response;
  }

  // 设置响应头中的token
  const token = response.headers.get('x-okapi-token')
  if (token) {
    localStorage.setItem('x-okapi-token', token);
  }

  let data, resURL;

  if (response.url.indexOf('?') !== -1) {
    resURL = response.url?.split('api')[1]?.split('?')[0];
  } else {
    resURL = response.url?.split('api')[1];
  }

  
  data = await response.clone().json();

  // 非 folio 接口
  const hasCode = Object.keys(data).findIndex((k) => k === 'code');
  if (data.code) {
    if (data.code === 'COMMON_200' || data.code === 200) {
      // 返回全部信息的接口
      return data;
    }
   
 
    return data;
  }
  if (hasCode !== -1) {
    // code 存在，但是可能为 null，请求失败
    message.error('请求失败');
    return { data: null, code: '', msg: '请求失败', message: '请求失败' };
  }


  if (data && data.errorMessage) {
    let msg = '';
    folioErrorTranslate.forEach((trans) => {
      if (data.errorMessage.indexOf(trans.msg) !== -1) {
        msg = `${trans.chinese} `;
      }
    });
    message.error(msg);
    return { data: null, code: '', msg: data.errorMessage, message: data.errorMessage };
  }

  // 过滤掉 folio 接口的返回 422 或者 500
  if (data.statusCode === 422 || data.statusCode === 500) {
    message.error(`服务器错误 ${data.statusCode}`);
    return { data: null, code: '', msg: '服务端错误', message: '服务端错误' };
  }
  return data;
});

export default request;
