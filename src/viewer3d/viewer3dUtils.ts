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

  let _rootGroupName = "";
  const MODEL_GROUP = createGroupIfNotExist(
    scene,
    GLOBAL_CONSTANT.MODEL_GROUP,
    false
  );
  if (MODEL_GROUP?.children?.length) {
    _rootGroupName = MODEL_GROUP.children[0].name;
  }
  const actionList: ActionItem[] = [
    {
      name: "全部",
      id: 0,
      handler: () => {
        showModelByName(_rootGroupName);
      },
    },
  ];
  const targetGroup = createGroupIfNotExist(scene, _rootGroupName, false);
  if (targetGroup) {
    const { children } = targetGroup;
    const envMesh = children.find((item) => item.name.includes("_ENV"));
    children.forEach((item) => {
      const itemName = item.name;
      if (!itemName.includes("_ENV")) {
        const { children } = item;
        for (let i = 0; i < children.length; i++) {
          const { name, id } = children[i];
          actionList.push({
            id,
            name,
            handler: () => {
              showModelByName(name);
              if (envMesh) {
                envMesh.visible = true;
              }
            },
          });
        }
      }
    });
  }

  return actionList;
}
