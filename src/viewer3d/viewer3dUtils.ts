import {
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  Vector3,
} from "three";
import {
  ActionItemMap,
  CustomButtonListType,
  CustomButtonType,
} from "../app/type";

import { createGroupIfNotExist } from "../three/utils";
import { GLOBAL_CONSTANT } from "../three/GLOBAL_CONSTANT";
import {
  getScene,
  getCamera,
  getControls,
  getUserData,
} from "../three/init3dViewer";

import { getScene as editorScene, createCurve } from "../three/init3dEditor";
import { cameraTween, meshTween } from "../three/animate";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function getUserSetting(customButtonList: CustomButtonListType) {
  const userSetting = customButtonList.toggleButtonGroup.userSetting;
  const position = new Vector3(0, 0, 0);
  const modelOffset = userSetting?.modelOffset ?? position;
  const cameraOffset = userSetting?.cameraOffset ?? position;
  const animationTime = userSetting?.animationTime ?? 1000;
  return { userSetting, modelOffset, animationTime, cameraOffset };
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
      // item.visible = false;
      item.layers.set(1);
    });
    // targetGroup.visible = true;
  }

  const groups = createGroupIfNotExist(getScene(), NAME_ID, false);
  if (groups) {
    groups.traverse((item) => {
      //  item.visible = true;
      item.layers.set(0);
    });
    showParentGroup(groups);
  }
  // 递归显示父级，新版本需要递归显示父级，才能显示模型
  function showParentGroup(group: Object3D<Object3DEventMap>) {
    //  group.visible = true;
    group.layers.set(0);
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

function getActionItemByMap(
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

let isMoveCamera = false;
function moveCameraSTRETCH(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  const { NAME_ID } = item;

  const MODEL_GROUP = createGroupIfNotExist(getScene(), NAME_ID, false);

  if (MODEL_GROUP) {
    // 移动相机到指定位置
    const camera = getCamera();
    const controls = getControls();
    const { animationTime } = getUserSetting(customButtonList);
    if (isMoveCamera) {
      cameraBackHome(camera, controls, animationTime);
    } else {
      const cameraPosition1 =
        item.data?.cameraPosition ?? getUserData().fixedCameraPosition;
      cameraTween(camera, cameraPosition1, animationTime).start();
      const { x, y, z } = MODEL_GROUP.position;
      controls.target.set(x, y, z);
      controls.update();
      isMoveCamera = true;
    }
  }
}

function moveCameraDRAWER(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  const { NAME_ID } = item;

  const MODEL_GROUP = createGroupIfNotExist(getScene(), NAME_ID, false);

  if (MODEL_GROUP) {
    // 移动相机到指定位置
    const camera = getCamera();
    const controls = getControls();
    const { animationTime, cameraOffset } = getUserSetting(customButtonList);

    if (isMoveCamera && MODEL_GROUP.name === GLOBAL_CONSTANT.MODEL_GROUP) {
      cameraBackHome(camera, controls, animationTime);
    } else {
      if (MODEL_GROUP.name === GLOBAL_CONSTANT.MODEL_GROUP) {
        return;
      }
      const { x, y, z } = MODEL_GROUP.position;

      const cameraPosition = new Vector3(
        x + cameraOffset.x,
        y + cameraOffset.y,
        z + cameraOffset.z
      );

      cameraTween(camera, cameraPosition, animationTime).start();
      controls.target.set(x, y, z);
      controls.update();
      isMoveCamera = true;
    }
  }
}

function cameraBackHome(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  animationTime: number
) {
  cameraTween(camera, getUserData().fixedCameraPosition, animationTime).start();

  controls.reset();
  controls.update();
  isMoveCamera = false;
}
// 得到物体的世界坐标
export function getObjectWorldPosition(model: Object3D) {
  const worldPosition = new Vector3();
  model.getWorldPosition(worldPosition);
  return worldPosition;
}

// 生成切换按钮组
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
      getActionItemByMap(
        {
          showName: "全景",
          NAME_ID: MODEL_GROUP.name,
          showButton: true,
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
            getActionItemByMap(
              {
                showName: name,
                NAME_ID: name,
                showButton: true,
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
              getActionItemByMap(
                {
                  showName: name,
                  NAME_ID: name,
                  showButton: true,
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
// 获取切换按钮组
export function getToggleButtonGroup1(): ActionItemMap[] {
  const customButtonList = getScene().userData
    .customButtonList as CustomButtonListType;

  if (!customButtonList.toggleButtonGroup) {
    return [];
  }
  const { listGroup, type, userSetting } = customButtonList.toggleButtonGroup;

  let list: ActionItemMap[] = [];
  if (type === "TOGGLE") {
    list = listGroup
      .map((item: ActionItemMap) => {
        const { showName, NAME_ID, data, showButton } = item;
        if (!showButton) {
          // 当 showButton 为 false 时，返回 undefined
          return undefined;
        }
        return {
          showName,
          NAME_ID,
          showButton,
          handler: () => {
            const { cameraOffset, animationTime } =
              getUserSetting(customButtonList);
            if (NAME_ID === GLOBAL_CONSTANT.MODEL_GROUP) {
              showModelByNameId(GLOBAL_CONSTANT.MODEL_GROUP);
              cameraBackHome(getCamera(), getControls(), animationTime);
              return;
            }
            showModelByNameId(NAME_ID);
            const model = createGroupIfNotExist(getScene(), NAME_ID, false);
            if (model) {
              const { x, y, z } = getObjectWorldPosition(model);
              const camera = getCamera();
              cameraTween(
                camera,
                new Vector3(
                  x + cameraOffset.x,
                  y + cameraOffset.y,
                  z + cameraOffset.z
                ),
                animationTime
              )
                .start()
                .onComplete(() => {
                  const controls = getControls();
                  controls.target.set(x, y, z);
                  controls.update();
                });
            }
          },
          data,
        };
      })
      .filter((item) => item !== undefined);
  }

  if (type === "DRAWER") {
    list = listGroup.map((item: ActionItemMap) => {
      const { showName, NAME_ID, data } = item;
      return {
        showName: showName,
        NAME_ID: NAME_ID,
        showButton: true,
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
            moveCameraDRAWER(item, customButtonList);
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
        showButton: true,
        handler: () => {
          stretchModelByNameId(NAME_ID, customButtonList);
          moveCameraSTRETCH(item, customButtonList);
        },
      };
    });
  }
  return list;
}

// 获取切换按钮组
export function getToggleButtonGroup(): ActionItemMap[] {
  const customButtonList = getScene().userData
    .customButtonList as CustomButtonListType;

  if (!customButtonList.toggleButtonGroup) {
    return [];
  }
  const { listGroup, type, userSetting } = customButtonList.toggleButtonGroup;

  return listGroup
    .map((item: ActionItemMap) => {
      const { showName, NAME_ID, data, showButton } = item;

      if (!showButton) {
        return undefined; // 当 showButton 为 false 时，返回 undefined
      }
      if (type === "TOGGLE") {
        return {
          showName,
          NAME_ID,
          showButton,
          handler: () => {
            const { cameraOffset, animationTime } =
              getUserSetting(customButtonList);
            if (NAME_ID === GLOBAL_CONSTANT.MODEL_GROUP) {
              showModelByNameId(GLOBAL_CONSTANT.MODEL_GROUP);
              cameraBackHome(getCamera(), getControls(), animationTime);
              return;
            }
            showModelByNameId(NAME_ID);
            const model = createGroupIfNotExist(getScene(), NAME_ID, false);
            if (model) {
              const { x, y, z } = getObjectWorldPosition(model);
              const camera = getCamera();
              cameraTween(
                camera,
                new Vector3(
                  x + cameraOffset.x,
                  y + cameraOffset.y,
                  z + cameraOffset.z
                ),
                animationTime
              )
                .start()
                .onComplete(() => {
                  const controls = getControls();
                  controls.target.set(x, y, z);
                  controls.update();
                });
            }
          },
          data,
        };
      }

      if (type === "STRETCH") {
        return {
          showName: showName,
          NAME_ID: NAME_ID,
          showButton: true,
          handler: () => {
            stretchModelByNameId(NAME_ID, customButtonList);
            moveCameraSTRETCH(item, customButtonList);
          },
        };
      }
      if (type === "DRAWER") {
        return {
          showName: showName,
          NAME_ID: NAME_ID,
          showButton: true,
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
              moveCameraDRAWER(item, customButtonList);
            }
          },
          data,
        };
      }
    })
    .filter((item) => item !== undefined);
}

//生成漫游动画按钮组
export function generateRoamButtonGroup() {
  // const { actionMixerList } = editorGetAll().parameters3d;
  const roamButtonGroup: ActionItemMap[] = [];
  const roam = createGroupIfNotExist(editorScene(), "_ROAM_", false);
  if (roam) {
    roam.children.forEach((item) => {
      const { name } = item;
      roamButtonGroup.push({
        showName: [name + "_开始", name + "_停止"],
        NAME_ID: name + "_AN_START",
        showButton: true,
      });
      // roamButtonGroup.push({
      //   showName: name + "_停止",
      //   NAME_ID: name + "_AN_STOP",
      // });
    });
  }

  // actionMixerList.forEach((item) => {
  //   const { name } = item.getClip();

  //   if (name.includes("AN_")) {
  //     roamButtonGroup.push({
  //       showName: name + "_开始",
  //       NAME_ID: name + "_START",
  //     });
  //     roamButtonGroup.push({
  //       showName: name + "_停止",
  //       NAME_ID: name + "_STOP",
  //     });
  //   }
  // });

  return roamButtonGroup;
}
//获取漫游动画按钮组
export function getRoamListByRoamButtonMap(): ActionItemMap[] {
  let data = getScene().userData;
  const { roamButtonGroup } = data.customButtonList;
  if (!roamButtonGroup) {
    return [];
  }
  const { listGroup } = roamButtonGroup;

  // const { actionMixerList } = import.meta.env.PROD
  //   ? getAll().parameters3d
  //   : editorGetAll().parameters3d;

  // const newListGroup = actionMixerList.map((item: AnimationAction) => {
  //   const { name } = item.getClip();
  //   return {
  //     name,
  //     item,
  //   };
  // });

  return listGroup
    .map((item: ActionItemMap) => {
      const { NAME_ID, showName, showButton } = item;
      if (!showButton) {
        // 当 showButton 为 false 时，返回 undefined
        return undefined;
      }

      return {
        showName: showName,
        NAME_ID: NAME_ID,
        handler: (state: string) => {
          const NAME = NAME_ID.split("_AN_")[0];
          const scene = getScene();
          const camera = getCamera();
          const controls = getControls();

          if (state.includes("_START")) {
            createCurve(scene, camera, controls, NAME, roamButtonGroup, true);
            controls.enabled = false;
          }
          if (state.includes("_STOP")) {
            createCurve(scene, camera, controls, NAME, roamButtonGroup, false);
            cameraBackHome(getCamera(), getControls(), 1000);
            controls.enabled = true;
          }
        },
      };
    })
    .filter((item: ActionItemMap) => item !== undefined); // 过滤掉 undefined 值
}
