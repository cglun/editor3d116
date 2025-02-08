import {
  BoxHelper,
  DirectionalLight,
  GridHelper,
  MOUSE,
  Object3D,
  Object3DEventMap,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
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
  transfControls2: TransformControls;

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
  perspectiveCamera = new PerspectiveCamera(
    75,
    node.offsetWidth / node.offsetHeight,
    0.1,
    1000
  );

  perspectiveCamera.name = "透视相机";
  perspectiveCamera.position.set(-5, 5, 8);

  const xxx = 40;
  orthographicCamera = new OrthographicCamera(
    node.offsetWidth / -xxx,
    node.offsetWidth / xxx,
    node.offsetHeight / xxx,
    node.offsetHeight / -xxx,
    1,
    1000
  );

  camera = perspectiveCamera;

  renderer = new WebGLRenderer();
  renderer.shadowMap.enabled = true;

  renderer.setSize(node.offsetWidth, node.offsetHeight);
  scene = new Scene();
  scene.userData.isSelected = false;
  node.appendChild(renderer.domElement);
  controls1 = new OrbitControls(perspectiveCamera, renderer.domElement);
  controls2 = new OrbitControls(orthographicCamera, renderer.domElement);

  controls = controls1;

  transfControls1 = new TransformControls(
    perspectiveCamera,
    renderer.domElement
  );
  transfControls2 = new TransformControls(
    orthographicCamera,
    renderer.domElement
  );
  transfControls = transfControls1;
  addLight();
  addGridHelper();
  animate();
}

let perspectiveCameraPosition: Vector3 = new Vector3(-5, 5, 8);
export function setCameraType(cameraType: string, cameraUp: Vector3) {
  if (cameraType === "PerspectiveCamera") {
    const { x, y, z } = perspectiveCameraPosition;
    perspectiveCamera.position.set(x, y, z);
    camera = perspectiveCamera;
    camera.lookAt(0, 0, 0);
    transfControls = transfControls1;
    transfControls2.getHelper().visible = false;
    controls = controls1;
  }

  if (cameraType === "OrthographicCamera") {
    if (camera.type === "PerspectiveCamera") {
      perspectiveCameraPosition = camera.position.clone();
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
export function getControls() {
  return controls;
}
export function getTransfControls() {
  return transfControls;
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
  return perspectiveCamera;
}
export function getScene(): Scene {
  return scene;
}

export function getRenderer(): WebGLRenderer {
  return renderer;
}

export function addGlb(update: void): void {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/common/js/draco/gltf/");
  //const loader = new GLTFLoader(new LoadingManager());
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load("/common/models/blender.glb", (gltf) => {
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
  const gridHelper = new GridHelper(16, 16);

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
let boxHelper: BoxHelper;
export function setTransformControls(selectedMesh: Object3D[]) {
  transfControls.addEventListener("dragging-changed", (event) => {
    controls.enabled = !event.value;
  });
  transfControls.addEventListener("change", () => {
    if (boxHelper) {
      boxHelper.update();
    }
  });
  //transfControls.addEventListener("mouseDown", () => {});

  // transfControls.addEventListener("mouseUp", () => {});

  transfControls.attach(selectedMesh[0]);

  if (boxHelper) {
    boxHelper.setFromObject(selectedMesh[0]);
    boxHelper.update();
  } else {
    boxHelper = new BoxHelper(selectedMesh[0], 0xffff00);
    scene.add(boxHelper);
  }

  const getHelper = transfControls.getHelper();
  getHelper.name = "TransformControlsRoot";
  getHelper.userData.type = UserDataType.TransformHelper;
  scene.add(getHelper);
  getHelper.traverse((child) => {
    child.userData.type = UserDataType.TransformHelper;
  });
}

// 截图,返回图片的base64
export function takeScreenshot(): string {
  renderer.setSize(300, 300);
  camera = perspectiveCamera;
  camera.aspect = 1;
  renderer.render(scene, camera);
  const screenshot = renderer.domElement.toDataURL("image/png");
  return screenshot;
}
