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
      "73dd13c066eca2273e4622959ecfcc0bef55c9e0ff1d76f203c6680c0a57189de08b8c52d56e5b988e13b7c34da1faf161668949e052c14fab158489cad268c3197e4e003e9c2aff2ac4fab88ff70be2f2380abc090b8cac9615c1d2b1d3d1896d308b9bf4b6f95c3edf4c929f11582ed1711b3334ea46105ab945d09eaf0c1c966e1883daaecc1d0a6b4427eafb6952c22c6cb0feb5fcbbc604a9ad410b34721b2ce3fd41936fc526c459ec70ec791c0bf43af73b7d824c9fea7c6a7a98a80b36c7d1358aafda141e6fad69fbc862f88c94aca0d5f58201d8c27639620073a76c90b93eb8ec26701e33c62d99789aacb4a26a61a2aecfda6beaf80dd120c59a"
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
