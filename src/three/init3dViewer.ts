import {
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import TWEEN from "three/addons/libs/tween.module.js";
import { createLabelRenderer } from "./utils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import {
  createConfig,
  createDirectionalLight,
  createGridHelper,
  createPerspectiveCamera,
  createRenderer,
} from "./factory3d";

import { extra3d as extra, userData } from "./config3d";
let scene: Scene,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  renderer: WebGLRenderer,
  divElement: HTMLDivElement,
  extra3d = extra;
function animate() {
  const { config3d } = scene.userData;
  if (extra3d.labelRenderer2d && config3d.css2d) {
    extra3d.labelRenderer2d.render(scene, camera);
  }
  if (extra3d.labelRenderer3d && config3d.css3d) {
    extra3d.labelRenderer3d.render(scene, camera);
  }
  if (config3d.useTween) {
    TWEEN.update();
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

export default function createScene(node: HTMLDivElement): void {
  divElement = node;
  camera = createPerspectiveCamera(node, "截图透视相机");
  camera.position.set(-5, 5, 8);
  renderer = createRenderer(node);
  scene = new Scene();
  node.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  scene.add(createDirectionalLight());
  scene.add(createGridHelper());

  scene.userData = userData;
  extra3d = createConfig(scene, node);

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

export function showModelByName(
  scene: Scene,
  targetModelName: string,
  show: boolean
) {
  const model = scene.getObjectByName(targetModelName);
  if (model) {
    model.traverse((item) => {
      item.visible = show;
    });

    if (model.name === "MODEl_GROUP") {
      model.visible = true;
    }
  }
}
