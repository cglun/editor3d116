import { Object3D, Object3DEventMap } from "three";
import { ActionItem } from "../app/type";
import { getScene } from "../three/init3dViewer";
import { createGroupIfNotExist } from "../three/utils";
import { GLOBAL_CONSTANT } from "../three/GLOBAL_CONSTANT";

// 显示和隐藏模型

export function showModelByName(targetGroupName: string) {
  const MODEL_GROUP = createGroupIfNotExist(
    getScene(),
    GLOBAL_CONSTANT.MODEL_GROUP,
    false
  );
  if (MODEL_GROUP) {
    MODEL_GROUP.traverse((item) => {
      item.visible = false;
    });
    // targetGroup.visible = true;
  }

  const groups = createGroupIfNotExist(getScene(), targetGroupName, false);
  if (groups) {
    groups.traverse((item) => {
      item.visible = true;
    });
    showParentGroup(groups);
  }
  // 递归显示父级，新版本需要递归显示父级，才能显示模型
  function showParentGroup(group: Object3D<Object3DEventMap>) {
    group.visible = true;
    if (group.parent) {
      showParentGroup(group.parent);
    }
  }
}

export function getActionList(): ActionItem[] {
  const scene = getScene();
  if (!scene) {
    return [];
  }

  const MODEL_GROUP = createGroupIfNotExist(scene, "test.glb", false);
  const GROUND = createGroupIfNotExist(scene, "GROUND", false);

  const actionList: ActionItem[] = [
    {
      name: "全部",
      id: "0",
      handler: () => {
        showModelByName("test.glb");
      },
    },
  ];
  if (MODEL_GROUP) {
    const { children } = MODEL_GROUP;
    children.forEach((item) => {
      actionList.push({
        name: "显示" + item.name,
        id: item.id + "",
        handler: () => {
          showModelByName(item.name);
          if (GROUND) {
            GROUND.visible = true;
          }
        },
      });
    });
  }
  actionList.pop();
  return actionList;
}
