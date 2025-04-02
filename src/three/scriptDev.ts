/** ============脚本开发调试=============== */
/** ============调试完成后，把【开始】到【结束】之间的代码复制到脚本中保存，刷新！*/

import { Context116 } from "../app/type";

export function runScript(context: Context116) {
  //@ts-expect-error
  const { getScene } = context;
  //===============开始==================//
  // const Icosphere = getScene().getObjectByName("Icosphere");
  // setInterval(() => {
  //   if (Icosphere) {
  //     Icosphere.rotation.y += 13;
  //   }
  // }, 200);
  // const blender = scene.getObjectByName("blender");
  // if (blender !== undefined) {
  //   setInterval(() => {
  //     blender.rotation.y += 0.5;
  //   }, 50);
  // }
  // const Icosphere = getScene().getObjectByName("Icosphere");
  // setInterval(() => {
  //   if (Icosphere) {
  //     Icosphere.rotation.y += 0.5;
  //   }
  // }, 200);
  //===============结束==================//
}
