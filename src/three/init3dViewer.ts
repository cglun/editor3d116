import {
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import {
  createDirectionalLight,
  createGridHelper,
  createLabelRenderer,
} from "./utils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";

let scene: Scene,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  renderer: WebGLRenderer,
  labelRenderer2d: CSS2DRenderer,
  labelRenderer3d: CSS3DRenderer;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  const { config3d } = scene.userData;
  if (labelRenderer2d && config3d.css2d) {
    labelRenderer2d.render(scene, camera);
  }
  if (labelRenderer3d && config3d.css3d) {
    labelRenderer3d.render(scene, camera);
  }
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
  scene.userData = {
    isSelected: false,
    config3d: {
      css2d: true, //是否开启2d标签
      css3d: true, //是否开启3d标签
    },
  };
  const { config3d } = scene.userData;
  if (config3d.css2d) {
    const labelRenderer = new CSS2DRenderer();
    const top = node.getBoundingClientRect().top;
    labelRenderer.domElement.style.top = top + "px";
    labelRenderer2d = createLabelRenderer(node, labelRenderer);
  }
  if (config3d.css3d) {
    const labelRenderer = new CSS3DRenderer();
    const top = node.getBoundingClientRect().top;
    labelRenderer.domElement.style.top = top + "px";
    labelRenderer3d = createLabelRenderer(node, labelRenderer);
  }

  animate();
}

export function getControls() {
  return controls;
}
export function getLabelRenderer() {
  return labelRenderer2d;
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
