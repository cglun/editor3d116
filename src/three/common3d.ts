import {
  DirectionalLight,
  GridHelper,
  Group,
  Light,
  Mesh,
  PerspectiveCamera,
  Scene,
  Vector2,
} from "three";
import { UserDataType } from "../app/type";
import { getScene } from "./init3dEditor";

export function createPerspectiveCamera(
  node: HTMLElement,
  cameraName = "透视相机"
) {
  const camera = new PerspectiveCamera(
    75,
    node.offsetWidth / node.offsetHeight,
    0.1,
    1000
  );
  camera.name = cameraName;
  return camera;
}

export function createDirectionalLight(name = "平行光") {
  // 添加正交光源
  const light = new DirectionalLight(0xffffff, 2.16);
  light.name = name;
  // 设置阴影参数
  light.shadow.mapSize.width = 2048; // 阴影图的宽度
  light.shadow.mapSize.height = 2048; // 阴影图的高度
  light.shadow.camera.near = 0.5; // 阴影摄像机的近剪裁面
  light.shadow.camera.far = 5000; // 阴影摄像机的远剪裁面
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  light.shadow.camera.bottom = -10;

  light.position.set(3, 3, 3);
  //   light.castShadow = true; // 开启投射阴影
  light.lookAt(0, 0, 0);
  return light;
}

export function createGridHelper(name = "网格辅助", wh = new Vector2(10, 10)) {
  const gridHelper = new GridHelper(wh.x, wh.y);
  gridHelper.userData = {
    type: UserDataType.GridHelper,
    isHelper: true,
    isSelected: false,
  };
  gridHelper.name = name;
  return gridHelper;
}

export function enableShadow(group: Scene | Group) {
  const { useShadow } = getScene().userData.config3d;
  group.traverse((child) => {
    if (child instanceof Mesh) {
      if (child.userData.type !== UserDataType.TransformHelper) {
        child.castShadow = useShadow;
        child.receiveShadow = useShadow;
      }
    }
    if (child instanceof Light) {
      child.castShadow = useShadow;
    }
  });
}
