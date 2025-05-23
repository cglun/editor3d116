import { CatmullRomCurve3, PerspectiveCamera, Scene, Vector3 } from "three";
import {
  ActionItemMap,
  CustomButtonListType,
  CustomButtonType,
} from "../../app/type";

import { createGroupIfNotExist } from "../../three/utils";
import { GLOBAL_CONSTANT } from "../../three/GLOBAL_CONSTANT";
import { getScene, getCamera, getControls } from "../../three/init3dViewer";

import { getScene as editorScene } from "../../three/init3dEditor";
import {
  animateDRAWER,
  animateROAM,
  animateSTRETCH,
  animateTOGGLE,
  cameraBackHome,
} from "./animateByButton";
import { getObjectWorldPosition } from "../viewer3dUtils";

import { userData } from "../../three/config3d";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { hasValueString } from "./utils";

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
          isClick: false,
        },
        customButtonType
      )
    );
    //二层
    children.forEach((item) => {
      const level2 = item.children;
      level2.forEach((item) => {
        if (!hasValueString(item, GLOBAL_CONSTANT._ENV_)) {
          const { name } = item;
          actionList.push(
            getActionItemByMap(
              {
                showName: name,
                NAME_ID: name,
                showButton: true,
                isClick: false,
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

        if (!hasValueString(item, GLOBAL_CONSTANT._ENV_)) {
          level3.forEach((item) => {
            const { name } = item;
            actionList.push(
              getActionItemByMap(
                {
                  showName: name,
                  NAME_ID: name,
                  showButton: true,
                  isClick: false,
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

//重置按钮组的isClick为false
export function resetListGroupIsClick(listGroup: ActionItemMap[]) {
  return listGroup.map((item: ActionItemMap) => {
    return {
      ...item,
      isClick: false,
    };
  });
}

// 获取切换按钮组
export function getToggleButtonGroup(): ActionItemMap[] {
  const customButtonList = getScene().userData
    .customButtonList as CustomButtonListType;

  if (!customButtonList.toggleButtonGroup) {
    return [];
  }
  const { listGroup, type } = customButtonList.toggleButtonGroup;
  return listGroup
    .map((item: ActionItemMap) => {
      const { showButton } = item;

      if (!showButton) {
        return undefined; // 当 showButton 为 false 时，返回 undefined
      }

      if (type === "TOGGLE") {
        return animateTOGGLE(item, customButtonList);
      }

      if (type === "STRETCH") {
        return animateSTRETCH(item, customButtonList);
      }
      if (type === "DRAWER") {
        return animateDRAWER(item, customButtonList, listGroup);
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
        isClick: false,
      });
    });
  }

  return roamButtonGroup;
}
//获取漫游动画按钮组
export function getRoamListByRoamButtonMap(): ActionItemMap[] {
  const data = getScene().userData as typeof userData;

  const { roamButtonGroup } = data.customButtonList as {
    roamButtonGroup?: CustomButtonListType["roamButtonGroup"];
  };
  if (!roamButtonGroup) {
    return [];
  }

  const { listGroup } = roamButtonGroup;

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
            animateROAM(scene, camera, controls, NAME, roamButtonGroup, true);
            controls.enabled = false;
          }
          if (state.includes("_STOP")) {
            animateROAM(scene, camera, controls, NAME, roamButtonGroup, false);
            cameraBackHome(getCamera(), getControls(), 1000);
            controls.enabled = true;
          }
        },
      } as ActionItemMap;
    })
    .filter((item): item is ActionItemMap => item !== undefined); // 过滤掉 undefined 值，并做类型保护
}
