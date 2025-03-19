import {
  AmbientLight,
  BoxHelper,
  Camera,
  DirectionalLight,
  Group,
  Light,
  Mesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { UserDataType } from "../app/type";
import { getScene } from "./init3dEditor";
import TWEEN from "three/addons/libs/tween.module.js";
import { Extra3d, parameters } from "./config3d";

export function enableShadow(group: Scene | Group) {
  const { useShadow } = getScene().userData.config3d;
  group.traverse((child: Object3D) => {
    if (child.type !== "AmbientLight") {
      if (child.hasOwnProperty("castShadow")) {
        child.castShadow = useShadow;
      }
      if (child.hasOwnProperty("receiveShadow")) {
        child.receiveShadow = useShadow;
      }
    }
  });
}

//射线 拾取物体
export function raycasterSelect(
  event: MouseEvent,
  camera: Camera,
  scene: Scene,
  divElement: HTMLElement
) {
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  pointer.x = (event.offsetX / divElement.offsetWidth) * 2 - 1;
  pointer.y = -(event.offsetY / divElement.offsetHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    // 你可以根据intersects数组中的信息来处理相交事件，比如改变相交物体的颜色等
    return intersects;
  }
  return [];
}

export function setBoxHelper(selectedMesh: Object3D, scene: Scene) {
  const BOX_HELPER = scene.getObjectByName("BOX_HELPER") as BoxHelper;
  if (!BOX_HELPER) {
    const boxHelper = new BoxHelper(selectedMesh, 0xffff00);
    boxHelper.name = "BOX_HELPER";
    boxHelper.userData = {
      type: UserDataType.BoxHelper,
      isHelper: true,
      isSelected: false,
    };
    scene.add(boxHelper);
  } else {
    BOX_HELPER.visible = true;
    BOX_HELPER.setFromObject(selectedMesh);
    BOX_HELPER.update();
  }
}
// 显示或隐藏BOX_HELPER
export function hideBoxHelper(scene: Scene) {
  const boxHelper = scene.getObjectByName("BOX_HELPER");
  if (boxHelper) {
    boxHelper.visible = false;
  }
}
export interface AnimateProps {
  scene: Scene;
  camera: PerspectiveCamera | OrthographicCamera;
  controls: any;
  renderer: WebGLRenderer;
  extra3d: Extra3d;
  parameters3d: typeof parameters;
}
export function commonAnimate({
  scene,
  camera,
  controls,
  renderer,
  extra3d,
  parameters3d,
}: AnimateProps) {
  const { css2d, css3d, useTween, FPS } = scene.userData.config3d;
  const { clock } = parameters3d;
  if (extra3d.labelRenderer2d && css2d) {
    extra3d.labelRenderer2d.render(scene, camera);
  }
  if (extra3d.labelRenderer3d && css3d) {
    extra3d.labelRenderer3d.render(scene, camera);
  }
  if (useTween) {
    TWEEN.update();
  }
  const T = clock.getDelta();
  parameters3d.timeS = parameters3d.timeS + T;
  const renderT = 1 / FPS;
  if (parameters3d.timeS > renderT) {
    renderer.render(scene, camera); //执行渲染操作
    controls.update();
    //renderer.render每执行一次，timeS置0
    parameters3d.timeS = 0;
  }
}
