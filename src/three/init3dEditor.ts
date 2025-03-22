import {
  BoxHelper,
  Camera,
  Color,
  DataTexture,
  MOUSE,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

import {
  OrbitControls,
  TransformControls,
  DragControls,
} from "three/examples/jsm/Addons.js";

import { GlbModel, UserDataType } from "../app/type";
import { cameraTween } from "./animate";
import { setBoxHelper, commonAnimate, AnimateProps } from "./common3d";
import { extra3d as extra, parameters } from "./config3d";
import {
  createConfig,
  createPerspectiveCamera,
  createRenderer,
  createScene,
} from "./factory3d";
import { createGroupIfNotExist } from "./utils";

let scene: Scene,
  camera: PerspectiveCamera | OrthographicCamera,
  perspectiveCamera: PerspectiveCamera,
  orthographicCamera: OrthographicCamera,
  controls: OrbitControls,
  controls1: OrbitControls,
  controls2: OrbitControls,
  renderer: WebGLRenderer,
  divElement: HTMLDivElement,
  transfControls: TransformControls,
  transfControls1: TransformControls,
  transfControls2: TransformControls,
  extra3d = extra,
  parameters3d = parameters;

export function getAll() {
  return {
    scene,
    camera,
    controls,
    renderer,
    divElement,
    extra3d,
  };
}

function animate() {
  const animateProps: AnimateProps = {
    scene,
    camera,
    controls,
    renderer,
    extra3d,
    parameters3d,
  };
  commonAnimate(animateProps);
  requestAnimationFrame(animate);
}

export default function initScene(node: HTMLDivElement): void {
  divElement = node;
  //透视相机
  perspectiveCamera = createPerspectiveCamera(node);
  camera = perspectiveCamera;
  const tween = cameraTween(camera, new Vector3(-5, 15, 18));
  tween.start();

  //正交相机
  const xxx = 40;
  orthographicCamera = new OrthographicCamera(
    node.offsetWidth / -xxx,
    node.offsetWidth / xxx,
    node.offsetHeight / xxx,
    node.offsetHeight / -xxx,
    1,
    1000
  );
  orthographicCamera.name = "正交相机";
  scene = createScene();
  renderer = createRenderer(node);
  node.appendChild(renderer.domElement);
  // 初始化轨道控制器
  controls1 = new OrbitControls(perspectiveCamera, renderer.domElement);
  controls2 = new OrbitControls(orthographicCamera, renderer.domElement);
  controls = controls1;

  // 初始化变换控制器
  transfControls1 = new TransformControls(
    perspectiveCamera,
    renderer.domElement
  );
  transfControls2 = new TransformControls(
    orthographicCamera,
    renderer.domElement
  );
  transfControls = transfControls1;
  extra3d = createConfig(scene, node);
  animate();
}

// 场景序列化
export function sceneSerialization(): string {
  scene.userData.selected3d = undefined;
  const sceneCopy = scene.clone();
  const modelList: GlbModel[] = [];

  let MODEL_GROUP = createGroupIfNotExist(sceneCopy, "MODEL_GROUP");
  const HELPER_GROUP = createGroupIfNotExist(sceneCopy, "HELPER_GROUP");
  if (HELPER_GROUP) {
    HELPER_GROUP.children = [];
  }
  const existModelGroup = MODEL_GROUP && MODEL_GROUP.children;

  if (existModelGroup) {
    MODEL_GROUP.children.forEach((child) => {
      const { id, name, position, rotation, scale } = child;
      const model: GlbModel = {
        id,
        name,
        position,
        rotation,
        scale,
        userData: child.userData,
      };
      modelList.push(model);
    });
    MODEL_GROUP.children = [];
  }

  // const sceneSelected = scene.userData.selected3d;
  // if (sceneSelected !== null && sceneSelected?.type === "Scene") {}

  const background = sceneCopy.background as Color | DataTexture;
  const isColor = background !== null && background instanceof Color;
  // const isTexture = background !== null && background instanceof DataTexture;
  sceneCopy.background = null;
  sceneCopy.environment = null;

  if (isColor) {
    sceneCopy.background = background;
    sceneCopy.userData.backgroundHDR = undefined;
  }

  const result = {
    sceneJsonString: JSON.stringify(sceneCopy.toJSON()),
    cameraJsonString: JSON.stringify(sceneCopy.userData.fiexedCameraPosition),
    modelsJsonString: JSON.stringify(modelList),
    type: "scene",
  };

  // scene.background = background;
  // if (isTexture) {
  //   scene.environment = background;
  // }

  return JSON.stringify(result);
}

export function setDragControls(currentObject: Object3D) {
  const dragControls = new DragControls(
    [currentObject],
    camera,
    renderer.domElement
  );
  dragControls.mouseButtons = {
    LEFT: null,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: null,
  };
  dragControls.addEventListener("dragstart", function () {
    controls.enabled = false;
    // dragControls.enabled = true;
  });

  dragControls.addEventListener("dragend", function () {
    controls.enabled = true;
    dragControls.enabled = false;
    setTimeout(() => {
      dragControls.dispose();
    }, 100);
  });
}

//为选中的物体加上变换控件
export function setTransformControls(selectedMesh: Object3D) {
  transfControls.addEventListener("dragging-changed", (event) => {
    controls.enabled = !event.value;
  });
  transfControls.addEventListener("change", () => {
    const boxHelper = scene.getObjectByName("BOX_HELPER") as BoxHelper;
    if (boxHelper) {
      boxHelper.update();
    }
  });
  //transfControls.addEventListener("mouseDown", () => {});
  // transfControls.addEventListener("mouseUp", () => {});
  transfControls.attach(selectedMesh);
  setBoxHelper(selectedMesh, scene);
  const HELPER_GROUP = createGroupIfNotExist(scene, "HELPER_GROUP");

  const getHelper = transfControls.getHelper();
  const userData = {
    type: UserDataType.TransformHelper,
    isHelper: true,
    isSelected: false,
  };
  getHelper.userData = userData;
  HELPER_GROUP?.add(getHelper);
  HELPER_GROUP && scene.add(HELPER_GROUP);
  getHelper.traverse((child) => {
    child.userData = userData;
  });
}

//射线 拾取物体
export function raycasterSelect(event: MouseEvent) {
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  pointer.x = (event.offsetX / divElement.offsetWidth) * 2 - 1;
  pointer.y = -(event.offsetY / divElement.offsetHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    // 你可以根据intersects数组中的信息来处理相交事件，比如改变相交物体的颜色等
    return intersects;
  }
  return [];
}

export function getControls() {
  return controls;
}
export function getTransfControls() {
  return transfControls;
}
export function getPerspectiveCamera(): PerspectiveCamera {
  return perspectiveCamera;
}
export function getCamera(): PerspectiveCamera | OrthographicCamera {
  return camera;
}
export function setCamera(_camera: Camera) {
  perspectiveCamera.position.x = _camera.position.x;
  perspectiveCamera.position.y = _camera.position.y;
  perspectiveCamera.position.z = _camera.position.z;
}
export function getScene(): Scene {
  return scene;
}
export function setScene(newScene: Scene) {
  scene = newScene;
}

export function getRenderer(): WebGLRenderer {
  return renderer;
}
export function getDivElement() {
  return divElement;
}
export function getLabelRenderer() {
  return extra.labelRenderer2d;
}
export function setSelectedObject(obj: Object3D) {
  scene.userData.selected3d = obj;
}

export function setCameraType(cameraType: string, cameraUp: Vector3) {
  if (cameraType === "PerspectiveCamera") {
    const { x, y, z } = scene.userData.perspectiveCameraPosition;
    perspectiveCamera.position.set(x, y, z);
    camera = perspectiveCamera;
    camera.lookAt(0, 0, 0);
    transfControls = transfControls1;
    transfControls2.getHelper().visible = false;
    controls = controls1;
  }

  if (cameraType === "OrthographicCamera") {
    if (camera.type === "PerspectiveCamera") {
      scene.userData.perspectiveCameraPosition = camera.position.clone();
    }

    camera = orthographicCamera;
    const { x, y, z } = cameraUp;

    const bl = 40;
    camera.position.x = x * bl;
    camera.position.y = y * bl;
    camera.position.z = z * bl;
    camera.lookAt(0, 0, 0);
    transfControls = transfControls2;
    transfControls1.getHelper().visible = false;

    controls2.mouseButtons = {
      LEFT: MOUSE.LEFT,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.LEFT,
    };
    controls = controls2;
  }
}
