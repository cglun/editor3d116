/**
 * request 网络请求工具，创建_axios实例对象
 * send cookies when cross-domain requests
 */
import axios from "axios";
import { decrypt } from "./crypto";

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
  type: "localStorage" | "sessionStorage";
  expire: number;
  isEncrypt: boolean;
}

const header = {
  Accept: "application/json, text/plain, */*",
  // catch: "no-catch",
  Authorization: "TOKEN",
  //"accept-encoding": "gzip, deflate, br, zstd",
  "Content-type": "application/json;charset=UTF-8",
};

(function getStorage(key = "TOKEN") {
  if (header.Authorization !== "TOKEN") {
    return;
  }
  if (import.meta.env.MODE === "development") {
    localStorage.setItem(
      "TOKEN",
      "73dd13c066eca2273e4622959ecfcc0bef55c9e0ff1d76f203c6680c0a57189de08b8c52d56e5b988e13b7c34da1faf161668949e052c14fab158489cad268c3a163a85a0047243dfdb7a79d87ef84e79e4f4d0639cb193bcdc68844f627d9421dfc248a88f3e3f4b9cc6dc8610674f433060b3a3af3ec2d3995da08144380811424d120bc994fa9d596abfd3b21ce6720e158de71ba90e5352028f412de4968d2f25978249da35acb380decf2757dd93c380a4bf22aebded76ee7333e3fa4b936b61416311fbd0a3728f0c79d770a9170b5c4a1697cf756d4b15b0576c9c12f376ff1b7543f6103663407f2331062ab5f9dc910be2bd8da3449c0a4fe06bd2c"
    );
  }
  const config: StoreConfig = {
    type: "localStorage",
    expire: 1 * 60 * 60 * 24, //过期时间 单位：秒
    isEncrypt: true,
  };
  const __localStorage = window[config.type].getItem(key);
  if (!__localStorage || JSON.stringify(__localStorage) === "null") {
    return null;
  }
  const storage = config.isEncrypt
    ? JSON.parse(decrypt(__localStorage!))
    : JSON.parse(__localStorage!);

  header.Authorization = storage.value;

  // return storage;
})();

const _axios = axios.create({
  baseURL: "/api",
  timeout: 1000,
  headers: header,
});
export default _axios;

export function loadAssets(url: string) {
  return url?.replace("/static/covers/", "");
  //   if (import.meta.env.DEV) {
  //   } else {
  //     return url?.replace("/^\\/file/", "/file");
  //   }
  //
}
