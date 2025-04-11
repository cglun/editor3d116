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
      "73dd13c066eca2273e4622959ecfcc0bef55c9e0ff1d76f203c6680c0a57189de08b8c52d56e5b988e13b7c34da1faf161668949e052c14fab158489cad268c371450762a8a0258176b0c550e86d3c3f57ddec80194f6621483f422f32cda7078c47d0f6e581df492d54cfda520b7d5ef01071508dedef3795f10f586e2db830b57803bc50b1f0d8e20db56f2aee56be6498282da37d6e2bb23213eeb9459df949ca2a78ce18aa1c564543ef3cbc0b79e24cc5794e2c453ee29d8649829d1b9253a3b909a73f5ee4a4f9c8d98b0689e4ebb4132dbee68306434b58dccb42c9de0346f6dcb6c1f3bb6fa7e6f3dc8aca14efb16600316051148f0837f095eb641b"
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
  timeout: 100000000,
  headers: header,
});
export default axios;
