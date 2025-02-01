import {
  DirectionalLight,
  DirectionalLightHelper,
  GridHelper,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";

import {
  GLTFLoader,
  DRACOLoader,
  OrbitControls,
  TransformControls,
} from "three/examples/jsm/Addons.js";
import { GlbModel } from "../app/type";
import { getObjectNameByName } from "./utils";

let scene: Scene,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  renderer: WebGLRenderer,
  divElement: HTMLDivElement,
  transfControls: TransformControls;

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

// let cube: Mesh;

// function addCube() {
//   // 创建立方体
//   const cubeGeometry = new BoxGeometry(1, 1, 1);
//   const cubeMaterial = new MeshLambertMaterial();
//   cube = new Mesh(cubeGeometry, cubeMaterial);
//   cube.name = "cube1";
//   cube.castShadow = true; // 立方体投射阴影

//   // 创建立方体
//   const cubeGeometry2 = new BoxGeometry(1, 1, 1);
//   const cubeMaterial2 = new MeshLambertMaterial();
//   const cube2 = new Mesh(cubeGeometry2, cubeMaterial2);
//   cube2.name = "cube2";
//   cube2.castShadow = true; // 立方体投射阴影

//   // 创建立方体
//   const cubeGeometry3 = new BoxGeometry(1, 1, 1);
//   const cubeMaterial3 = new MeshLambertMaterial();
//   const cube3 = new Mesh(cubeGeometry3, cubeMaterial3);
//   cube3.name = "cube3";
//   cube3.castShadow = true; // 立方体投射阴影

//   cube2.add(cube3);

//   const g = new Group();
//   g.name = "立方体组";
//   g.add(cube);
//   g.add(cube2);
//   scene.add(g);
// }

function addLight(): void {
  // 添加正交光源
  const light = new DirectionalLight(0xffffff, 2.16);
  // 设置阴影参数
  light.shadow.mapSize.width = 2048; // 阴影图的宽度
  light.shadow.mapSize.height = 2048; // 阴影图的高度
  light.shadow.camera.near = 0.5; // 阴影摄像机的近剪裁面
  light.shadow.camera.far = 5000; // 阴影摄像机的远剪裁面
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  light.shadow.camera.bottom = -10;

  light.position.set(3, 3, 3);
  light.castShadow = true; // 开启投射阴影
  light.lookAt(0, 0, 0);
  scene.add(light);
}

function createScene(node: HTMLDivElement): void {
  divElement = node;

  camera = new PerspectiveCamera(
    75,
    node.offsetWidth / node.offsetHeight,
    0.1,
    1000
  );
  camera.name = "透视相机";
  camera.position.set(-5, 5, 8);

  renderer = new WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(node.offsetWidth, node.offsetHeight);

  scene = new Scene();
  scene.userData.isSelected = false;

  node.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  transfControls = new TransformControls(camera, renderer.domElement);

  animate();
}

function setScene(newScene: Scene) {
  scene = newScene;
}
function setCamera(camera1: Object3D<Object3DEventMap>) {
  camera.position.x = camera1.position.x;
  camera.position.y = camera1.position.y;
  camera.position.z = camera1.position.z;
}
function getCamera(): PerspectiveCamera {
  return camera;
}
function getScene(): Scene {
  return scene;
}

function getRenderer(): WebGLRenderer {
  return renderer;
}

export function addGlb(update: void): void {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/assets/js/draco/gltf/");
  //const loader = new GLTFLoader(new LoadingManager());
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load("/assets/models/blender.glb", (gltf) => {
    const children = gltf.scene.children;
    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      element.userData.type = "GlbModel";
      scene.children.push(element);
    }
    //scene.add(data.scene);
    update;
  });
}

// 场景序列化
function sceneSerialization(scene: Scene, camera: PerspectiveCamera): string {
  const _scene = scene.clone();
  const models: GlbModel[] = [];
  _scene.children.forEach((child) => {
    if (child.userData.type === "GlbModel") {
      const model: GlbModel = {
        id: child.id,
        name: child.name,
        position: child.position,
        rotation: child.rotation,
        scale: child.scale,
      };
      models.push(model);
      child.parent?.remove(child);
    }
  });
  const sceneJson = _scene.toJSON();
  const cameraJson = camera.toJSON();
  const sceneJsonString = JSON.stringify(sceneJson);
  const cameraJsonString = JSON.stringify(cameraJson);
  const modelsJsonString2 = JSON.stringify(models);
  return (
    sceneJsonString + "!116!" + cameraJsonString + "!116!" + modelsJsonString2
  );
}

function addGridHelper() {
  const gridHelper = new GridHelper(30, 30);
  gridHelper.userData.type = "GridHelper";
  gridHelper.name = "网格辅助";
  scene.add(gridHelper);
}

//射线拾取物体
function onPointerClick(event: MouseEvent, callBack: Function) {
  const t = scene.getObjectByName("TransformHelper");
  if (t) {
    scene.remove(t);
  }
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  const raycaster = new Raycaster();
  const pointer = new Vector2();

  pointer.x = (event.offsetX / divElement.offsetWidth) * 2 - 1;
  pointer.y = -(event.offsetY / divElement.offsetHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    // 你可以根据intersects数组中的信息来处理相交事件，比如改变相交物体的颜色等
    callBack(intersects[0].object);
  }
}
function getDivElement() {
  return divElement;
}

function transformControls(currentObject: Object3D) {
  transfControls.detach();

  // if (
  //   currentObject.userData.type === "GridHelper" ||
  //   currentObject.type === "TransformControlsPlane" ||
  //   currentObject.type === "Line"
  // ) {
  //   // transfControls.detach();
  //   return;
  // }

  transfControls.addEventListener("dragging-changed", (event) => {
    controls.enabled = !event.value;
  });
  //raycaster = transfControls.getRaycaster();
  transfControls.attach(currentObject);

  transfControls.size = 0.5;

  //const t = scene.getObjectByName("TransformHelper");
  // if (t === undefined) {
  // }
  const getHelper = transfControls.getHelper();
  getHelper.name = "TransformHelper";
  getHelper.userData.type = "TransformHelper";
  scene.add(getHelper);
}

export {
  sceneSerialization,
  createScene,
  addGridHelper,
  getRenderer,
  setScene,
  getScene,
  addLight,
  setCamera,
  getCamera,
  onPointerClick,
  getDivElement,
  transformControls,
};
