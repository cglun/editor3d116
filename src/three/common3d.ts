import {
  BoxHelper,
  Camera,
  Group,
  Light,
  Mesh,
  Object3D,
  Raycaster,
  Scene,
  Vector2,
} from "three";
import { UserDataType } from "../app/type";
import { getScene } from "./init3dEditor";

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
