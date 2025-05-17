import { AnimationAction, Object3D, Object3DEventMap, Scene } from "three";
import { ActionItem, ActionItemMap } from "../app/type";

import { createGroupIfNotExist } from "../three/utils";
import { GLOBAL_CONSTANT } from "../three/GLOBAL_CONSTANT";
import { getScene, getAll } from "../three/init3dViewer";
import {
  getScene as editorScene,
  getAll as editorGetAll,
} from "../three/init3dEditor";
import { userData } from "../three/config3d";

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
      showName: "全部",
      NAME_ID: "全景",
      handler: () => {
        showModelByName(_rootGroupName);
      },
    },
  ];
  const targetGroup = createGroupIfNotExist(scene, _rootGroupName, false);
  if (targetGroup) {
    const { children } = targetGroup;
    const envMesh = children.find((item) =>
      item.name.toUpperCase().includes("_ENV_")
    );
    children.forEach((item) => {
      const itemName = item.name;
      if (!itemName.toUpperCase().includes("_ENV_")) {
        const { children } = item;
        for (let i = 0; i < children.length; i++) {
          const { name } = children[i];
          actionList.push({
            showName: name,
            NAME_ID: name,
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
export function getActionListByButtonMap(): ActionItemMap[] {
  const data = getScene().userData as typeof userData;
  const { listGroup, type } = data.customButtonList.toggleButtonGroup;
  return listGroup.map((item: ActionItemMap) => {
    const { showName, NAME_ID, data } = item;
    return {
      showName: showName,
      NAME_ID: NAME_ID,
      handler: () => {
        if (type === "TOGGLE") {
          if (NAME_ID === "全景") {
            showModelByName(GLOBAL_CONSTANT.MODEL_GROUP);
            return;
          }
          showModelByName(NAME_ID);
        }
        if (type === "DRAWER") {
          console.log("DRAWER");
        }
      },
      data,
    };
  });
}

// 生成切换按钮组 ActionItem[]
export function generateToggleButtonGroup(
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
    actionList.push({
      showName: "全景",
      NAME_ID: "全景",
    });

    //二层
    children.forEach((item) => {
      const level2 = item.children;
      level2.forEach((item) => {
        if (!item.name.toUpperCase().includes("_ENV_")) {
          const { name } = item;
          actionList.push({
            showName: name,
            NAME_ID: name,
          });
        }
      });
    });
    //三层
    children.forEach((item) => {
      const level2 = item.children;
      level2.forEach((item) => {
        const level3 = item.children;

        if (!item.name.toUpperCase().includes("_ENV_")) {
          level3.forEach((item) => {
            const { name } = item;
            actionList.push({
              showName: name,
              NAME_ID: name,
            });
          });
        }
      });
    });
  }

  const _code = [...actionList, ...originalCodeArr];

  //  _code去除重复项
  const uniqueActionList = Array.from(
    new Map(_code.map((item) => [item.NAME_ID, item])).values()
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

//生成漫游动画按钮组
export function generateRoamButtonGroup() {
  const { actionMixerList } = editorGetAll().parameters3d;
  const roamButtonGroup: ActionItemMap[] = [];

  actionMixerList.forEach((item) => {
    const { name } = item.getClip();

    if (name.includes("AN_")) {
      roamButtonGroup.push({
        showName: name + "_开始",
        NAME_ID: name + "_START",
      });
      roamButtonGroup.push({
        showName: name + "_停止",
        NAME_ID: name + "_STOP",
      });
    }
  });

  return roamButtonGroup;
}
//获取漫游动画按钮组
export function getRoamListByRoamButtonMap(): ActionItemMap[] {
  let data = import.meta.env.PROD
    ? getScene().userData
    : editorScene().userData;

  const { listGroup } = data.customButtonList.roamButtonGroup;

  const { actionMixerList } = import.meta.env.PROD
    ? getAll().parameters3d
    : editorGetAll().parameters3d;

  const newListGroup = actionMixerList.map((item: AnimationAction) => {
    const { name } = item.getClip();
    return {
      name,
      item,
    };
  });

  return listGroup.map((item: ActionItemMap) => {
    const { NAME_ID, showName } = item;
    const actionItem = newListGroup.find((item) => NAME_ID.includes(item.name));
    return {
      showName: showName,
      NAME_ID: NAME_ID,
      handler: () => {
        if (NAME_ID.includes("START")) {
          actionItem?.item.play();
        }
        if (NAME_ID.includes("STOP")) {
          actionItem?.item.stop();
        }
      },
    };
  });

  // const { actionMixerList } = getAll().parameters3d;
  // if (actionMixerList.length === 0) {
  //   Toast3d("没有动画");
  //   return;
  // }
  // for (let index = 0; index < actionMixerList.length; index++) {
  //   const element = actionMixerList[index];
  //   if (name.includes(element.getClip().name)) {
  //     if (name.includes("开始")) {
  //       element.play();
  //     }
  //     if (name.includes("停止")) {
  //       element.stop();
  //     }
  //   }
  // }
}
