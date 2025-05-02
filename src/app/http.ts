// 修改导入名称为 _axios，避免与局部变量冲突
import _axios from "axios";
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

const header = {
  Accept: "application/json, text/plain, */*",
  Authorization: "TOKEN",
  "Content-type": "application/json;charset=UTF-8",
  // catch: "no-catch",
  //"accept-encoding": "gzip, deflate, br, zstd",
};

(function getStorage(key = "TOKEN") {
  if (header.Authorization !== "TOKEN") {
    return;
  }
  if (import.meta.env.MODE === "development") {
    localStorage.setItem(
      "TOKEN",
      "73dd13c066eca2273e4622959ecfcc0bef55c9e0ff1d76f203c6680c0a57189de08b8c52d56e5b988e13b7c34da1faf161668949e052c14fab158489cad268c374fb4d43a649d461119eb44973f57a6c61da716ed2ff6f9fbef518e33a290c4bf72b3c50b1b5d8fd3241ee8f3f42dd47a74a3dc4488f407a03e1340a74b10f6753fb110f18b0a983748756e0295641fd6143f6a4dc9414e7dc1bfa75efce25322de43db3111f1dbd089d70e1c65b5a770c92aeb45e86221860f646087a946fd4313a04267be9e7cffef71a27a3ba3b7b9de61b7dcff8befbb34d6d89436b8ab9f75b8646d69e6c1c584acbd62e4033ad449f1ee26b4f0eb6dc2db45f0d9b11b0"
    );
  }
  interface StoreConfig {
    type: "localStorage" | "sessionStorage";
    expire: number;
    isEncrypt: boolean;
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
})();

export function loadAssets(url: string) {
  return url?.replace("/static/covers/", "");
}

const axios = _axios.create({
  baseURL: "/api",
  timeout: 10 * 1000,
  headers: header,
});
export default axios;
