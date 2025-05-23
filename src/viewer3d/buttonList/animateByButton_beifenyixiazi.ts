import {
  CatmullRomCurve3,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  Vector3,
} from "three";
import { ActionItemMap, CustomButtonListType } from "../../app/type";

import { createGroupIfNotExist } from "../../three/utils";
import { GLOBAL_CONSTANT } from "../../three/GLOBAL_CONSTANT";
import {
  getScene,
  getCamera,
  getControls,
  getUserData,
} from "../../three/init3dViewer";

import { cameraTween, meshTween } from "../../three/animate";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getObjectWorldPosition, getUserSetting } from "../viewer3dUtils";

// 显示模型-显示和隐藏
export function showModelByNameId(NAME_ID: string) {
  const MODEL_GROUP = createGroupIfNotExist(
    getScene(),
    GLOBAL_CONSTANT.MODEL_GROUP,
    false
  );
  if (MODEL_GROUP) {
    MODEL_GROUP.traverse((item) => {
      item.layers.set(1);
    });
  }

  const groups = createGroupIfNotExist(getScene(), NAME_ID, false);
  if (groups) {
    groups.traverse((item) => {
      item.layers.set(0);
    });
    showParentGroup(groups);
  }
  // 递归显示父级，新版本需要递归显示父级，才能显示模型
  function showParentGroup(group: Object3D<Object3DEventMap>) {
    group.layers.set(0);
    if (group.parent) {
      showParentGroup(group.parent);
    }
  }
}
// 显示模型-抽屉
export function drawerOutByNameId(
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
export function stretchModelByNameId(
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
      ? stretchListGroup(MODEL_GROUP, customButtonList, false)
      : stretchListGroup(MODEL_GROUP, customButtonList, true);
  }
}

function stretchListGroup(
  MODEL_GROUP: Object3D<Object3DEventMap>,
  customButtonList: CustomButtonListType,
  childrenIsStretch: boolean
) {
  const { animationTime, modelOffset } = getUserSetting(customButtonList);
  const array = MODEL_GROUP.children;
  const directionMultiplier = MODEL_GROUP.userData.childrenIsStretch ? -1 : 1;

  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const { x, y, z } = element.position;
    meshTween(
      element,
      new Vector3(
        x + modelOffset.x * index * directionMultiplier,
        y + modelOffset.y * index * directionMultiplier,
        z + modelOffset.z * index * directionMultiplier
      ),
      animationTime
    )
      .start()
      .onComplete(() => {
        MODEL_GROUP.userData.childrenIsStretch = childrenIsStretch;
        MODEL_GROUP.userData.childrenIsRunning = false;
      });
  }
}

let isMoveCamera = false;
export function moveCameraSTRETCH(
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

export function moveCameraDRAWER(
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

export function cameraBackHome(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  animationTime: number
) {
  cameraTween(camera, getUserData().fixedCameraPosition, animationTime)
    .start()
    .onComplete(() => {
      controls.target.set(0, 0, 0);
      controls.update();
      isMoveCamera = false;
    });
}

export function animateTOGGLE(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  const { NAME_ID } = item;

  return {
    ...item,
    handler: () => {
      item.isClick = !item.isClick;
      const { cameraOffset, animationTime } = getUserSetting(customButtonList);
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
  };
}
export function animateDRAWER(
  item: ActionItemMap,
  customButtonList: CustomButtonListType,
  listGroup: ActionItemMap[]
) {
  const { userSetting } = customButtonList.toggleButtonGroup;
  return {
    ...item,
    handler: () => {
      listGroup.forEach((_item: ActionItemMap) => {
        const _d = _item.data;
        if (_item.data?.isSelected && !_d?.isRunning) {
          const model = createGroupIfNotExist(getScene(), _item.NAME_ID, false);
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
  };
}
export function animateSTRETCH(
  item: ActionItemMap,
  customButtonList: CustomButtonListType
) {
  const { NAME_ID } = item;
  return {
    ...item,
    handler: () => {
      if (NAME_ID === GLOBAL_CONSTANT.MODEL_GROUP) {
        const MODEL_GROUP = createGroupIfNotExist(
          getScene(),
          GLOBAL_CONSTANT.MODEL_GROUP,
          false
        );
        if (MODEL_GROUP) {
          MODEL_GROUP.children.forEach((item) => {
            stretchModelByNameId(item.name, customButtonList);
          });
        }
        const { animationTime } = getUserSetting(customButtonList);
        cameraBackHome(getCamera(), getControls(), animationTime);
        return;
      }
      stretchModelByNameId(NAME_ID, customButtonList);
      moveCameraSTRETCH(item, customButtonList);
    },
  };
}

let _isRunning = false;
//ROAM动画
export function animateROAM(
  scene: Scene,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  curveName: string,
  roamButtonGroup: CustomButtonListType["roamButtonGroup"],
  isRunning: boolean
) {
  const vector: Vector3[] = [];
  const _curve = createGroupIfNotExist(scene, curveName, false);
  if (!_curve) {
    return;
  }
  _isRunning = isRunning;

  _curve.children.forEach((child) => {
    const position = getObjectWorldPosition(child);
    vector.push(position);
  });

  const curve = new CatmullRomCurve3(vector, true);

  // const points = curve.getPoints(50); // 创建线条材质
  // const material = new LineBasicMaterial({ color: 0xff0000 });
  // // 创建 BufferGeometry 并设置顶点
  // const geometry = new BufferGeometry().setFromPoints(points);

  // // 创建线条对象
  // const line = new Line(geometry, material);

  // 将线条添加到场景中
  //scene.add(line);
  // const model = getScene().getObjectByName("box");
  // const model = getCamera();

  //
  if (camera) {
    // 初始化进度变量
    let progress = 0;
    // 移动速度，可根据需要调整
    const speed = (roamButtonGroup?.userSetting?.speed ?? 2) / 10000;

    function moveModelAlongCurve() {
      if (progress <= 1 && _isRunning) {
        // 根据进度获取曲线上的点
        const point = curve.getPoint(progress);
        // 设置相机的位置
        camera.position.copy(point);
        // 获取曲线的切线方向
        const tangent = curve.getTangent(progress).normalize();
        // 计算相机的目标点，使其始终朝前
        const target = camera.position.clone().add(tangent);

        // 设置相机的朝向
        //  model.lookAt(target.x, target.y, target.z);
        controls.target.set(target.x, target.y, target.z);
        controls.update();
        // 增加进度
        progress += speed;
        if (progress > 1) {
          progress = 0;
        }

        requestAnimationFrame(moveModelAlongCurve);
      }
    }

    // 开始移动
    moveModelAlongCurve();
  }
}
