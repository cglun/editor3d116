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
      "73dd13c066eca2273e4622959ecfcc0bef55c9e0ff1d76f203c6680c0a57189de08b8c52d56e5b988e13b7c34da1faf161668949e052c14fab158489cad268c36d1e7c0a207604c58e6abbfcdfd0ea38ee727285ef0dd4ba54c0e59cf2f1312f224fe03de0e416869234a52c674c93fcad164d3ae2b80ee23086e505e81ef5b29c8f39699dad4088a12c1f51adcbbc2f42cf663e0720086e7e675eed85a5251646d9684c9e372dec2a2e03d5135b8f880a5322dbda2a6020d1abb9de7bf80a9af7094060b603cc373fd5e4d3646e90837dad0597fecf47b93b24a63fc00b4001c492d250aa274656b8cf1ee597f5c0f841fcd4c5584d2de81079bace3c840683"
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
  timeout: 100000000,
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
