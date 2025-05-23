import { Object3D, Vector3 } from "three";
import { CustomButtonListType } from "../app/type";

// 得到物体的世界坐标
export function getObjectWorldPosition(model: Object3D) {
  const worldPosition = new Vector3();
  model.getWorldPosition(worldPosition);
  return worldPosition;
}
export function getUserSetting(customButtonList: CustomButtonListType) {
  const userSetting = customButtonList.toggleButtonGroup.userSetting;
  const position = new Vector3(0, 0, 0);
  const modelOffset = userSetting?.modelOffset ?? position;
  const cameraOffset = userSetting?.cameraOffset ?? position;
  const animationTime = userSetting?.animationTime ?? 1000;
  return { userSetting, modelOffset, animationTime, cameraOffset };
}
