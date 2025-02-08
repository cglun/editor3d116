import {
  BoxGeometry,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import {
  GLTFLoader,
  DRACOLoader,
  OrbitControls,
} from "three/examples/jsm/Addons.js";
import { UserDataType } from "../app/type";

let scene: Scene,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  renderer: WebGLRenderer;

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
  camera = new PerspectiveCamera(
    75,
    node.offsetWidth / node.offsetHeight,
    0.1,
    1000
  );

  camera.position.set(-5, 5, 8);
  camera.name = "截图透视相机";

  renderer = new WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(node.offsetWidth, node.offsetHeight);

  scene = new Scene();
  scene.userData.isSelected = false;

  node.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);

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
export function setCamera(_camera: Object3D<Object3DEventMap>) {
  camera.position.x = _camera.position.x;
  camera.position.y = _camera.position.y;
  camera.position.z = _camera.position.z;
}
export function getCamera() {
  return camera;
}

export function getRenderer() {
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
export function addGridHelper() {
  const gridHelper = new GridHelper(10, 10);

  gridHelper.userData = {
    type: UserDataType.GridHelper,
    isSelected: false,
  };
  gridHelper.name = "网格辅助";
  scene.add(gridHelper);
}
export function getScene(): Scene {
  return scene;
}
export function addCube() {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  scene.add(cube);
}

// 截图,返回图片的base64
export function takeScreenshot(width: number, height: number): string {
  renderer.setSize(width, height);
  // camera = getCamera();
  debugger;
  camera.aspect = 1;
  renderer.render(scene, camera);
  const screenshot = renderer.domElement.toDataURL("image/png");
  return screenshot;
}
