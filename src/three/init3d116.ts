import {
  DirectionalLight,
  GridHelper,
  MOUSE,
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
  DragControls,
} from "three/examples/jsm/Addons.js";
import { GlbModel, UserDataType } from "../app/type";

let scene: Scene,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  renderer: WebGLRenderer,
  divElement: HTMLDivElement,
  transfControls: TransformControls;

export function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

export function addLight(): void {
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
export default function createScene(node: HTMLDivElement): void {
  divElement = node;
  camera = new PerspectiveCamera(
    75,
    node.offsetWidth / node.offsetHeight,
    0.1,
    1000
  );
  camera.name = "透视相机" + Math.random();
  camera.position.set(-5, 5, 8);

  renderer = new WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(node.offsetWidth, node.offsetHeight);

  scene = new Scene();
  scene.userData.isSelected = false;

  node.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  transfControls = new TransformControls(camera, renderer.domElement);
  addLight();

  addGridHelper();

  animate();
}

export function getControls() {
  return controls;
}

export function setScene(newScene: Scene) {
  scene = newScene;
}
export function setCamera(camera1: Object3D<Object3DEventMap>) {
  camera.position.x = camera1.position.x;
  camera.position.y = camera1.position.y;
  camera.position.z = camera1.position.z;
}
export function getCamera(): PerspectiveCamera {
  return camera;
}
export function getScene(): Scene {
  return scene;
}

export function getRenderer(): WebGLRenderer {
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
      element.userData.type = UserDataType.GlbModel;
      scene.children.push(element);
    }
    //scene.add(data.scene);
    update;
  });
}

// 场景序列化
export function sceneSerialization(
  scene: Scene,
  camera: PerspectiveCamera
): string {
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

export function addGridHelper() {
  const gridHelper = new GridHelper(30, 30);

  gridHelper.userData = {
    type: UserDataType.GridHelper,
    isSelected: false,
  };
  gridHelper.name = "网格辅助";
  scene.add(gridHelper);
}

export function getDivElement() {
  return divElement;
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

//为选中的物体加上变换控件
export function setTransformControls(selectedMesh: Object3D[]) {
  transfControls.addEventListener("dragging-changed", (event) => {
    controls.enabled = !event.value;
  });

  transfControls.attach(selectedMesh[0]);
  transfControls.setSize(0.6);
  const getHelper = transfControls.getHelper();
  getHelper.name = "TransformControlsRoot";
  getHelper.userData.type = UserDataType.TransformHelper;
  scene.add(getHelper);
  if (selectedMesh.length === 0) {
    getHelper.visible = false;
  }
  getHelper.traverse((child) => {
    child.userData.type = UserDataType.TransformHelper;
  });
}

// 截图,返回图片的base64
export function takeScreenshot(): string {
  renderer.setSize(300, 300);
  camera.aspect = 1;
  renderer.render(scene, camera);
  const screenshot = renderer.domElement.toDataURL("image/png");
  return screenshot;
}
