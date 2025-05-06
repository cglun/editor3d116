import { Object3D, Object3DEventMap, Scene } from "three";
import { ActionItem, ActionItemMap } from "../app/type";

import { createGroupIfNotExist } from "../three/utils";
import { GLOBAL_CONSTANT } from "../three/GLOBAL_CONSTANT";
import { getScene } from "../three/init3dEditor";

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
      handler: () => {
        showModelByName(_rootGroupName);
      },
    },
  ];
  const targetGroup = createGroupIfNotExist(scene, _rootGroupName, false);
  if (targetGroup) {
    const { children } = targetGroup;
    const envMesh = children.find((item) =>
      item.name.toUpperCase().includes("_ENV")
    );
    children.forEach((item) => {
      const itemName = item.name;
      if (!itemName.toUpperCase().includes("_ENV")) {
        const { children } = item;
        for (let i = 0; i < children.length; i++) {
          const { name } = children[i];
          actionList.push({
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

// 修改返回类型为 ActionItem[]
export function generateButtonGroup(
  originalCodeArr: ActionItemMap[],
  sceneContext: Scene
): ActionItemMap[] {
  const actionList: ActionItemMap[] = [];

  const MODEL_GROUP = createGroupIfNotExist(
    sceneContext,
    GLOBAL_CONSTANT.MODEL_GROUP,
    false
  );
  if (MODEL_GROUP) {
    const { children } = MODEL_GROUP;

    //二层
    children.forEach((item) => {
      const level2 = item.children;
      level2.forEach((item) => {
        if (!item.name.toUpperCase().includes("_ENV")) {
          const { name } = item;
          actionList.push({
            name,
            data: {
              cameraView: undefined,
            },
          });
        }
      });
    });
    //三层
    children.forEach((item) => {
      const level2 = item.children;
      level2.forEach((item) => {
        const level3 = item.children;
        level3.forEach((item) => {
          const { name } = item;
          actionList.push({
            name,
            data: {
              cameraView: undefined,
            },
          });
        });
      });
    });
  }

  const _code = [...actionList, ...originalCodeArr];

  //  _code去除重复项
  const uniqueActionList = Array.from(
    new Map(_code.map((item) => [item.name, item])).values()
  );
  return uniqueActionList;
  // 把actionList和originalCode两个数组拼接成一个新的数组
  // 修改：将 originalCode 替换为 originalCodeArr

  // navigator.clipboard
  //   .writeText(_code)
  //   .then(() => {
  //     Toast3d("复制成功");
  //   })
  //   .catch((error) => {
  //     // 处理复制过程中出现的错误
  //     console.error("复制时发生错误:", error);
  //     Toast3d("复制失败", "失败", APP_COLOR.Danger);
  //   });
  // 原选中代码，无需修改
}
