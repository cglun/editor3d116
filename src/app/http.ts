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
  catch: "no-catch",
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
      "73dd13c066eca2273e4622959ecfcc0bef55c9e0ff1d76f203c6680c0a57189de08b8c52d56e5b988e13b7c34da1faf161668949e052c14fab158489cad268c35d704501132b83defbf0fe3c7c81222fb6f7fee36cec9994fcdd0df53a856bd0d3bbfee9869d23481b9cb38838bf33b8ea83d9a999507b285464520a222f8dbb4de68d293bbde55537bd64f201d26160ed7810ddda70210516fc78d75dad6a356f55d54c12b1cb05d41a717eece8e0b25681935e7b4dfcd931bc1864e3050541a7e25a89111c2f79354e75baad0e5b0335da54cfeccc14f6d14305f9361c6f374f47864839cd5579e6a00c2ad44ac467a1acefde30689ded6f564629307cc5c2"
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

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 1000,
  headers: header,
});
export default axiosInstance;
