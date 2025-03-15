import { Vector3 } from "three";

const config3d = {
  css2d: true, //是否开启2d标签
  css3d: true, //是否开启3d标签
  useTween: true, //是否开启动画
};
export const userData = {
  isSelected: false,
  perspectiveCameraPosition: new Vector3(-5, 5, 8),
  fiexedCameraPosition: new Vector3(-5, 5, 8),
  config3d,
  javascript: "",
};
