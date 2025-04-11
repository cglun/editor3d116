import { AnimationMixer, Clock, Vector3 } from "three";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { APP_COLOR } from "../app/type";

export const enableScreenshot = {
  enable: false,
  renderTime: 0,
};

export function setEnableScreenshot(enable: boolean) {
  enableScreenshot.enable = enable;
}
export const config3d = {
  css2d: true, //是否开启2d标签
  css3d: true, //是否开启3d标签
  useTween: true, //是否开启动画
  useShadow: true, //是否开启阴影
  useKeyframe: true, //是否开启关键帧动画
  FPS: 30, //帧率
};
export const userData = {
  isSelected: false,
  perspectiveCameraPosition: new Vector3(-5, 5, 8),
  fiexedCameraPosition: new Vector3(-5, 5, 8),
  config3d,
  backgroundHDR: {
    name: "venice_sunset_1k.hdr",
    asBackground: true,
  },
  javascript: `//const scene = getScene(); 
  console.log("116");`,
  APP_THEME: {
    themeColor: APP_COLOR.Dark,
    iconFill: "",
    sceneCanSave: false,
  },
};
export const parameters = {
  clock: new Clock(),
  timeS: 0,
};
export interface Extra3d {
  labelRenderer2d: CSS2DRenderer | undefined;
  labelRenderer3d: CSS3DRenderer | undefined;
  mixer: AnimationMixer[];
}

export const extra3d: Extra3d = {
  labelRenderer2d: undefined,
  labelRenderer3d: undefined,
  mixer: [],
};
