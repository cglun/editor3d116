import {
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {
  createConfigRenderer,
  createDirectionalLight,
  createPerspectiveCamera,
  createRenderer,
  createScene,
} from "./factory3d";

import { extra3d as extra, parameters } from "./config3d";
import { AnimateProps, commonAnimate } from "./common3d";

let scene: Scene,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  renderer: WebGLRenderer,
  divElement: HTMLDivElement,
  extra3d = extra;
const parameters3d = { ...parameters, flag: "3d" };
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
  camera = createPerspectiveCamera(node, "截图透视相机");
  camera.position.set(-3, 3, 5);
  scene = createScene();
  const { useShadow } = getScene().userData.config3d;
  const light = createDirectionalLight();
  light.castShadow = useShadow;
  scene.add(light);

  renderer = createRenderer(node);
  node.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);

  const { labelRenderer2d, labelRenderer3d } = createConfigRenderer(
    scene,
    node
  );
  extra3d = {
    ...extra3d,
    labelRenderer2d,
    labelRenderer3d,
  };
  animate();
}

export function getControls() {
  return controls;
}
export function getLabelRenderer() {
  return extra.labelRenderer2d;
}
export function setScene(newScene: Scene) {
  scene = newScene;
}
export function setCamera(_camera: Object3D<Object3DEventMap>) {
  camera.position.x = _camera.position.x;
  camera.position.y = _camera.position.y;
  camera.position.z = _camera.position.z;
}
export function getAll() {
  return {
    scene,
    camera,
    controls,
    renderer,
    divElement,
    extra3d,
    parameters3d,
  };
}
export function getUserData() {
  return scene.userData;
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
export function getDivElement() {
  return divElement;
}

// 截图,返回图片的base64
export function takeScreenshot(width: number, height: number): string {
  renderer.setSize(width, height);
  camera.aspect = 1;
  renderer.render(scene, camera);
  const screenshot = renderer.domElement.toDataURL("image/png");
  return screenshot;
}
