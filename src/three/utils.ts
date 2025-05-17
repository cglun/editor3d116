import React from "react";
import {
  AnimationClip,
  AnimationMixer,
  Group,
  Object3D,
  ObjectLoader,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  VectorKeyframeTrack,
  WebGLRenderer,
} from "three";
import { Context116, GlbModel, RecordItem, UserDataType } from "../app/type";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import axios from "../app/http";
import { createCss2dLabel, createCss3dLabel } from "./factory3d";
import { enableShadow, setTextureBackground } from "./common3d";
import { TourWindow } from "../app/MyContext";
import {
  enableScreenshot,
  Parameters3d,
  setEnableScreenshot,
  userData,
} from "./config3d";
import { runScript } from "./scriptDev";
import { GLOBAL_CONSTANT } from "./GLOBAL_CONSTANT";

export function getObjectNameByName(object3D: Object3D): string {
  return object3D.name.trim() === "" ? object3D.type : object3D.name;
}

//base64转码
export function base64(file: File) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function onWindowResize(
  canvas: React.RefObject<HTMLDivElement>,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  labelRenderer: CSS2DRenderer | undefined
) {
  if (canvas.current !== null) {
    const width = canvas.current.offsetWidth;
    const height = canvas.current.offsetHeight;
    camera.aspect = width / height; // 设置相机的宽高比和视口的宽高比一致
    camera.updateProjectionMatrix(); // 更新相机的投影矩阵
    renderer.setSize(width, height); // 更新渲染器的大小
    if (labelRenderer) {
      labelRenderer.setSize(width, height);
    }
  }
}

export function setLabel(
  scene: Scene,
  dispatchTourWindow?: React.Dispatch<TourWindow>
) {
  clearOldLabel();

  const MARK_LABEL_GROUP = createGroupIfNotExist(
    scene,
    GLOBAL_CONSTANT.MARK_LABEL_GROUP
  );
  if (!MARK_LABEL_GROUP) {
    return;
  }

  const children = MARK_LABEL_GROUP.children;
  children.forEach((item) => {
    const { type } = item.userData;
    let label = createCss3dLabel(
      item.name,
      item.userData.labelLogo,
      item.userData.tourObject,
      dispatchTourWindow
    );

    if (type === UserDataType.CSS2DObject) {
      label = createCss2dLabel(item.name, item.userData.labelLogo);
    }
    const { x, y, z } = item.position;
    label.position.set(x, y, z);
    item.userData.needDelete = true;
    MARK_LABEL_GROUP.add(label);
  });

  const labelList = children.filter((item) => {
    if (!item.userData.needDelete) {
      return item;
    }
  });

  MARK_LABEL_GROUP.children = labelList;
}
//删除之前的标签
export function clearOldLabel() {
  const labelDiv = document.querySelectorAll(".mark-label");
  if (labelDiv.length > 0) {
    labelDiv.forEach((element) => {
      element.parentNode?.removeChild(element);
    });
  }
}
export function getTourSrc(tourObject: string) {
  let tourSrc = "/#/preview/";
  if (tourObject) {
    tourSrc = "/#/preview/" + tourObject;
    if (import.meta.env.DEV) {
      tourSrc = "http://localhost:5173/#/preview/" + tourObject;
    }
  }
  return tourSrc;
}

export function strToJson(str: string) {
  const { sceneJsonString, modelsJsonString, type } = JSON.parse(str);
  const scene: Scene = JSON.parse(sceneJsonString);

  const models = JSON.parse(modelsJsonString);

  const loader = new ObjectLoader();
  return { scene, models, type, loader };
}

//反序列化
export function sceneDeserialize(data: string, item: RecordItem) {
  const { scene, models, loader } = strToJson(data);

  let newScene = new Scene();
  loader.parse(scene, function (object: Object3D) {
    // 类型断言为 Scene
    const sceneObject = object as Scene;
    const { userData } = sceneObject;

    // 检查 object 是否为 Scene 类型
    if (object instanceof Scene) {
      newScene = object;
      newScene.userData = {
        ...userData,
        projectName: item.name,
        projectId: item.id,
        canSave: true,
        selected3d: null,
      };
    } else {
      console.error("The parsed object is not a Scene type.");
    }

    const backgroundHDR = object.userData.backgroundHDR;
    if (backgroundHDR) {
      setTextureBackground(newScene);
    }
  });

  const newCamera = new PerspectiveCamera();
  const { fixedCameraPosition } = newScene.userData;
  if (fixedCameraPosition) {
    const { x, y, z } = fixedCameraPosition;
    newCamera.position.set(x, y, z);
  }

  return {
    scene: newScene,
    camera: newCamera,
    modelList: models,
  };
}

export function getProjectData(id: number): Promise<string> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/project/getProjectData/${id}`)
      .then((res) => {
        if (res.data.data) {
          const data = res.data.data;
          resolve(data);
        } else {
          reject(res.data.message);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function glbLoader() {
  const loader = new GLTFLoader();
  const baseurl = import.meta.env.BASE_URL;
  let path = `${baseurl}static/js/draco/gltf/`;
  if (import.meta.env.DEV) {
    path = `${baseurl}public/static/js/draco/gltf/`;
  }
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(path);
  loader.setDRACOLoader(dracoLoader);
  return loader;
}

export function removeCanvasChild(canvas3d: React.RefObject<HTMLDivElement>) {
  if (canvas3d.current !== null) {
    const { children } = canvas3d.current;
    for (let i = 0; i < children.length; i++) {
      children[i].remove();
    }
  }
}
//创建动画剪辑
function cameraClip(clip1: AnimationClip): AnimationClip {
  // 创建关键帧数组
  const track = new VectorKeyframeTrack(
    ".position",
    clip1.tracks[0].times,
    clip1.tracks[0].values
  );

  return new AnimationClip("AN_" + clip1.name, -1, [track]);
}

function getModelGroup(
  model: GlbModel,
  gltf: GLTF,
  context: Scene,
  camera: PerspectiveCamera | OrthographicCamera,
  parameters3d: Parameters3d
) {
  const { position, rotation, scale } = model;
  let MODEL_GROUP = createGroupIfNotExist(context, GLOBAL_CONSTANT.MODEL_GROUP);
  if (!MODEL_GROUP) {
    MODEL_GROUP = new Group();
    MODEL_GROUP.name = GLOBAL_CONSTANT.MODEL_GROUP;
    context.add(MODEL_GROUP);
  }

  const scene = gltf.scene;
  const { config3d } = context.userData as typeof userData;
  if (config3d.useKeyframe) {
    const mixer = new AnimationMixer(scene);
    const cameraMixer = new AnimationMixer(camera); // 将相机作为动画目标

    parameters3d.mixer.push(mixer);
    parameters3d.mixer.push(cameraMixer);

    if (gltf.animations.length > 0) {
      for (let i = 0; i < gltf.animations.length; i++) {
        const clip = gltf.animations[i];

        if (clip.name.trim().toUpperCase().includes("CAMERA")) {
          const cameraAnimationAction = cameraMixer.clipAction(
            cameraClip(clip)
          );
          parameters3d.actionMixerList.push(cameraAnimationAction);
          // cameraAnimationAction.play();
        } else {
          const action = mixer.clipAction(clip);
          parameters3d.actionMixerList.push(action);
          action.play();
        }
      }
    }
  }

  if (scene.children.length === 1) {
    const gltfModel = scene.children[0];
    gltfModel.position.set(position.x, position.y, position.z);
    gltfModel.setRotationFromEuler(rotation);
    gltfModel.scale.set(scale.x, scale.y, scale.z);

    gltfModel.userData = {
      ...model.userData,
      type: UserDataType.GlbModel,
    };
    MODEL_GROUP.add(gltfModel);
    return MODEL_GROUP;
  }
  const group = new Group();
  group.name = model.name;
  group.add(...scene.children);
  group.userData = {
    ...model.userData,
    type: UserDataType.GlbModel,
  };
  group.position.set(position.x, position.y, position.z);

  // group.rotation.set(rotation._x, rotation._y, rotation._z, "XYZ");
  group.setRotationFromEuler(rotation);
  group.scale.set(scale.x, scale.y, scale.z);
  MODEL_GROUP.add(group);
  return MODEL_GROUP;
}

//创建group,如果group不存在,则创建group
export function createGroupIfNotExist(
  contextScene: Scene | Group | Object3D,
  name: string,
  createGroup: boolean = true
): Scene | Group | Object3D | undefined {
  let group = contextScene.getObjectByName(name);

  if (group !== undefined) {
    return group;
  }
  if (createGroup) {
    group = new Group();
    group.name = name;
    if (name === GLOBAL_CONSTANT.HELPER_GROUP) {
      group.userData.isHelper = true;
    }
    return group;
  }
  return undefined;
}

export function loadModelByUrl(
  model: GlbModel,
  scene: Scene,
  camera: PerspectiveCamera | OrthographicCamera,
  parameters3d: Parameters3d,
  getProgress: (progress: number) => void,
  getError: (error: unknown) => void
) {
  const loader = glbLoader();

  loader.load(
    model.userData.modelUrl + "?url",
    function (gltf) {
      const group = getModelGroup(model, gltf, scene, camera, parameters3d);
      enableShadow(group, scene);
      scene.add(group);

      getProgress(100);
    },
    function (xhr) {
      const progress = parseFloat(
        ((xhr.loaded / model.userData.modelTotal) * 100).toFixed(2)
      );
      if (progress < 100) {
        getProgress(progress);
      }
    },
    function (error) {
      getError(error);
    }
  );
}

export function finishLoadExecute(
  context: Context116,
  callBack?: (context: Context116) => void
) {
  const { javascript } = context.getScene().userData;
  if (enableScreenshot.enable) {
    setEnableScreenshot(true);
  }

  if (javascript) {
    // 使用类型正确的 context 调用方法
    // 这里的 context 需要根据实际情况修改类型为 Context116 或正确的类型定义;
    const { getScene, getControls, getCamera } = context;

    getScene();
    getControls();
    getCamera();
    eval(javascript);
    if (callBack) {
      callBack(context);
    }
  }
  if (import.meta.env.MODE === "development") {
    runScript(context);
  }
}
