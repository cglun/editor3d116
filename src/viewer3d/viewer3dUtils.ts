import {
  AnimationAction,
  Object3D,
  Object3DEventMap,
  Scene,
  Vector3,
} from "three";
import {
  ActionItem,
  ActionItemMap,
  CustomButtonListType,
  CustomButtonType,
} from "../app/type";

import { createGroupIfNotExist } from "../three/utils";
import { GLOBAL_CONSTANT } from "../three/GLOBAL_CONSTANT";
import { getScene, getAll } from "../three/init3dViewer";
import {
  getScene as editorScene,
  getAll as editorGetAll,
} from "../three/init3dEditor";

import { meshTween } from "../three/animate";

function getUserSetting(customButtonList: CustomButtonListType) {
  const userSetting = customButtonList.toggleButtonGroup.userSetting;
  const modelOffset = userSetting?.modelOffset ?? {
    x: 0,
    y: 0,
    z: 0,
  };
  const animationTime = userSetting?.animationTime ?? 1000;
  return { userSetting, modelOffset, animationTime };
}

// 显示模型-显示和隐藏
function showModelByNameId(NAME_ID: string) {
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

  const groups = createGroupIfNotExist(getScene(), NAME_ID, false);
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
// 显示模型-抽屉
function drawerOutByNameId(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  // 使用可选链操作符和默认值确保解构安全

  const MODEL_GROUP = createGroupIfNotExist(getScene(), item.NAME_ID, false);
  item.data = {
    isSelected: true,
    isRunning: true,
  };
  if (MODEL_GROUP) {
    const { x, y, z } = MODEL_GROUP.position;
    const { modelOffset, animationTime } = getUserSetting(customButtonList);

    meshTween(
      MODEL_GROUP,
      new Vector3(x + modelOffset.x, y + modelOffset.y, z + modelOffset.z),
      animationTime
    )
      .start()
      .onComplete(() => {
        item.data = {
          isSelected: true,
          isRunning: false,
        };
      });
  }
}
// 显示模型-拉伸
function stretchModelByNameId(
  NAME_ID: string,
  customButtonList: CustomButtonListType
) {
  const MODEL_GROUP = createGroupIfNotExist(getScene(), NAME_ID, false);
  if (MODEL_GROUP) {
    const isStretch = MODEL_GROUP.userData.childrenIsStretch;
    const isStretchRunning = MODEL_GROUP.userData.childrenIsRunning;
    if (isStretchRunning) {
      return;
    }
    MODEL_GROUP.userData.childrenIsRunning = true;
    isStretch
      ? stretchListGroup(MODEL_GROUP, customButtonList, false, false)
      : stretchListGroup(MODEL_GROUP, customButtonList, true, false);
  }
}

function stretchListGroup(
  MODEL_GROUP: Object3D<Object3DEventMap>,
  customButtonList: CustomButtonListType,
  childrenIsStretch: boolean,
  childrenIsRunning: boolean
) {
  const { animationTime, modelOffset } = getUserSetting(customButtonList);
  const array = MODEL_GROUP.children;
  const xxxxxx = MODEL_GROUP.userData.childrenIsStretch ? -1 : 1;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const { x, y, z } = element.position;
    meshTween(
      element,
      new Vector3(
        x + modelOffset.x * index * xxxxxx,
        y + modelOffset.y * index * xxxxxx,
        z + modelOffset.z * index * xxxxxx
      ),
      animationTime
    )
      .start()
      .onComplete(() => {
        MODEL_GROUP.userData.childrenIsStretch = childrenIsStretch;
        MODEL_GROUP.userData.childrenIsRunning = childrenIsRunning;
      });
  }
}

function getActionItem(
  item: ActionItemMap,
  customButtonType: CustomButtonType
): ActionItemMap {
  if (customButtonType === "DRAWER") {
    item.data = {
      isSelected: false,
      isRunning: false,
    };
  }
  return item;
}

// 生成切换按钮组 ActionItem[]
export function generateToggleButtonGroup(
  originalCodeArr: ActionItemMap[],
  sceneContext: Scene,
  customButtonType: CustomButtonType
): ActionItemMap[] {
  const actionList: ActionItemMap[] = [];

  const MODEL_GROUP = createGroupIfNotExist(
    sceneContext,
    GLOBAL_CONSTANT.MODEL_GROUP,
    false
  );
  if (MODEL_GROUP) {
    const { children } = MODEL_GROUP;
    actionList.push(
      getActionItem(
        {
          showName: "全景",
          NAME_ID: MODEL_GROUP.name,
        },
        customButtonType
      )
    );
    //二层
    children.forEach((item) => {
      const level2 = item.children;
      level2.forEach((item) => {
        if (!item.name.toUpperCase().includes("_ENV_")) {
          const { name } = item;

          actionList.push(
            getActionItem(
              {
                showName: name,
                NAME_ID: name,
              },
              customButtonType
            )
          );
        }
      });
    });

    if (customButtonType === "STRETCH") {
      //移除第一项
      actionList.shift();
      return actionList;
    }

    //三层
    children.forEach((item) => {
      const level2 = item.children;
      level2.forEach((item) => {
        const level3 = item.children;

        if (!item.name.toUpperCase().includes("_ENV_")) {
          level3.forEach((item) => {
            const { name } = item;
            actionList.push(
              getActionItem(
                {
                  showName: name,
                  NAME_ID: name,
                },
                customButtonType
              )
            );
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
}
// 获取切换按钮组 ActionItem[]
export function getActionListByButtonMap(): ActionItemMap[] {
  const customButtonList = getScene().userData
    .customButtonList as CustomButtonListType;
  const { listGroup, type, userSetting } = customButtonList.toggleButtonGroup;

  let list: ActionItemMap[] = [];
  if (type === "TOGGLE") {
    list = listGroup.map((item: ActionItemMap) => {
      const { showName, NAME_ID, data } = item;
      return {
        showName: showName,
        NAME_ID: NAME_ID,
        handler: () => {
          if (NAME_ID === "全景") {
            showModelByNameId(GLOBAL_CONSTANT.MODEL_GROUP);
            return;
          }
          showModelByNameId(NAME_ID);
        },
        data,
      };
    });
  }

  if (type === "DRAWER") {
    list = listGroup.map((item: ActionItemMap) => {
      const { showName, NAME_ID, data } = item;
      return {
        showName: showName,
        NAME_ID: NAME_ID,
        handler: () => {
          listGroup.forEach((_item: ActionItemMap) => {
            const _d = _item.data;
            if (_item.data?.isSelected && !_d?.isRunning) {
              const model = createGroupIfNotExist(
                getScene(),
                _item.NAME_ID,
                false
              );
              _item.data = {
                isRunning: true,
                isSelected: true,
              };

              if (model) {
                const mp = model.position;
                const { x, y, z } = userSetting?.modelOffset || {
                  x: 0,
                  y: 0,
                  z: 0,
                };
                meshTween(
                  model,
                  new Vector3(mp.x - x, mp.y - y, mp.z - z),
                  userSetting?.animationTime ?? 1000
                )
                  .start()
                  .onComplete(() => {
                    _item.data = {
                      isRunning: false,
                      isSelected: false,
                    };
                  });
              }
            }
          });
          if (!item.data?.isSelected && !item.data?.isRunning) {
            drawerOutByNameId(item, customButtonList);
          }
        },
        data,
      };
    });
  }
  if (type === "STRETCH") {
    list = listGroup.map((item: ActionItemMap) => {
      const { showName, NAME_ID } = item;
      return {
        showName: showName,
        NAME_ID: NAME_ID,
        handler: () => {
          stretchModelByNameId(NAME_ID, customButtonList);
        },
      };
    });
  }
  return list;
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
