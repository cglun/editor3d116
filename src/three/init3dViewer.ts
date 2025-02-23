import {
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import { CSS2DRenderer, OrbitControls } from "three/examples/jsm/Addons.js";
import { createDirectionalLight, createGridHelper } from "./utils";

let scene: Scene,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  renderer: WebGLRenderer,
  labelRenderer: CSS2DRenderer | null;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
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
  node.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  scene.add(createDirectionalLight("平行光"));
  scene.add(createGridHelper("网格辅助"));

  animate();
}

export function getControls() {
  return controls;
}
export function getLabelRenderer() {
  return labelRenderer;
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

export function getScene(): Scene {
  return scene;
}

export function getRenderer() {
  return renderer;
}

// 截图,返回图片的base64
export function takeScreenshot(width: number, height: number): string {
  renderer.setSize(width, height);
  camera.aspect = 1;
  renderer.render(scene, camera);
  const screenshot = renderer.domElement.toDataURL("image/png");
  return screenshot;
}
