/**
 * request 网络请求工具，创建_axios实例对象
 * send cookies when cross-domain requests
 */
import axios from 'axios';
import { decrypt } from './crypto';

// const codeMessage = {
//   200: "服务器成功返回请求的数据。",
//   201: "新建或修改数据成功。",
//   202: "一个请求已经进入后台排队（异步任务）。",
//   204: "删除数据成功。",
//   400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
//   401: "用户没有权限（令牌、用户名、密码错误）。",
//   403: "用户登录会话过期，访问是被禁止，请重新登录。",
//   404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
//   406: "请求的格式不可得。",
//   410: "请求的资源被永久删除，且不会再得到的。",
//   422: "当创建一个对象时，发生一个验证错误。",
//   500: "服务器发生错误，请检查服务器。",
//   502: "网关错误。",
//   503: "服务不可用，服务器暂时过载或维护。",
//   504: "网关超时。",
// };

interface StoreConfig {
  type: 'localStorage' | 'sessionStorage';
  expire: number;
  isEncrypt: boolean;
}

const header = {
  Accept: 'application/json, text/plain, */*',
  // catch: "no-catch",
  Authorization: 'TOKEN',
  //"accept-encoding": "gzip, deflate, br, zstd",
  'Content-type': 'application/json;charset=UTF-8',
};

(function getStorage(key = 'TOKEN') {
  if (header.Authorization !== 'TOKEN') {
    return;
  }
  if (import.meta.env.MODE === 'development') {
    localStorage.setItem(
      'TOKEN',
      '73dd13c066eca2273e4622959ecfcc0bef55c9e0ff1d76f203c6680c0a57189de08b8c52d56e5b988e13b7c34da1faf161668949e052c14fab158489cad268c3aa2ae294724554d948f11e101b34e1ef651bdf8424042f3b0bef201c32036edc8f18bdf42b2d9bf7513a4b1d86fe1b35285246ba0a3c76d8a3194827456022ef4a596371e9d9396a1d90c7ddb5e011c4c171a4c07f074c69a87dba3a0011c76f227e0b65c8b7e74cf845d6e0d41fc644fdb21ffed8d011781ba41d2745dc4a92c60c3afe965e1b8f374ff9b80db81d632a1d0c50642d839495c862d3421b3323708bb04d4119e2f92b3d7f4e83019fd32b467c476243bfb01f2e57401d063771'
    );
  }
  const config: StoreConfig = {
    type: 'localStorage',
    expire: 1 * 60 * 60 * 24, //过期时间 单位：秒
    isEncrypt: true,
  };
  const __localStorage = window[config.type].getItem(key);
  if (!__localStorage || JSON.stringify(__localStorage) === 'null') {
    return null;
  }
  const storage = config.isEncrypt ? JSON.parse(decrypt(__localStorage!)) : JSON.parse(__localStorage!);

  header.Authorization = storage.value;

  // return storage;
})();

const _axios = axios.create({
  baseURL: '/api',
  timeout: 100000000,
  headers: header,
});
export default _axios;

export function loadAssets(url: string) {
  return url?.replace('/static/covers/', '');
  //   if (import.meta.env.DEV) {
  //   } else {
  //     return url?.replace("/^\\/file/", "/file");
  //   }
  //
}
