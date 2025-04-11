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
      "73dd13c066eca2273e4622959ecfcc0bef55c9e0ff1d76f203c6680c0a57189de08b8c52d56e5b988e13b7c34da1faf161668949e052c14fab158489cad268c345feccdc13cae5a6c985e0a9af18e62516dc048e9768d36c8ce00819fcf9acdd222206c2aceec05a5e038aea58b9a97158fb54781afabdea366ac67203be27d95b61ea082d2184352ae06562930672348227fed3b0e1884de6a0459764f778184dc608b78d7a426d4afb5718c0c5a2f0dfc3c84f14ea8ea41091e4c0e267fc6bc2f2aa217bdba4d6deb52615c98616e2f27d8f6e1e1e41b263af3f7d13899f25bd9027a9be100ba93128500d4ab484866aa99f93567bc027b318d7babca7cedf"
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
