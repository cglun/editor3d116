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
      "73dd13c066eca2273e4622959ecfcc0bef55c9e0ff1d76f203c6680c0a57189de08b8c52d56e5b988e13b7c34da1faf161668949e052c14fab158489cad268c31a86dc7cc75f2cc5cc773a83ade92b99a3772cbeaa286c77d5aa7b8296f47dd490a54cb67ee36174ae3d6b7ca41d877f146840ec8aca66397145722a3b8fe22f5c078f7a12cc86f28c57e815d0a45df58d04f7616ecad3e7fc5784bc062cc77a3a31b166248c9cfa873907c508d454a89f743dffb1ddbdaf3ef19eda69453df742809eb3c3b6bc1cf7a0142f3a298b661a4a77b6c64d34645687b4d4f76196ac466aee98f38336176026f3e1d6cd81539d0b8e77263869cb761096ec2d4fb9e6"
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
