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
      "73dd13c066eca2273e4622959ecfcc0bef55c9e0ff1d76f203c6680c0a57189de08b8c52d56e5b988e13b7c34da1faf161668949e052c14fab158489cad268c3bf438ef11ff5a4392bc117f2e36970a30ed9a33d04c5172cd490867ab24ac1b38be0d57c7865dd86939084dd309384f26ebaa844bb0c8403a65504888e5705da27396f418b972337a2c67e6819a1beb6b86d0c310f51b981effa5559598c7b1eb0591a77fb80877ed1f70f69d52125ec597abcf946d53d1f4b72d7723ca3a82f462bd8948e013fe217ae4676b27e1b69c1112a39c3c126119dec30f3384372603628f77e2f8994743dd9953c260031ea1abaa5683a7d0b38afb8ac4b66228b38"
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
