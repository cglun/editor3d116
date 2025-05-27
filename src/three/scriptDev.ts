/** ============脚本开发调试=============== */
/** ============调试完成后，把【开始】到【结束】之间的代码复制到脚本中保存，刷新！*/

import { ActionItemMap, Context116 } from "../app/type";

//@ts-expect-error 忽略类型错误,  脚本开发调试   【开始】到【结束】之间的代码复制到脚本中保存，刷新！
export function runScript(context: Context116) {
  //===============开始==================//
  document.getCurrentActionItemMap = function (item: ActionItemMap) {
    console.log("当前按钮组：", item);
  };

  //===============结束==================//
}
