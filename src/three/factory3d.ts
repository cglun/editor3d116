import {
  DirectionalLight,
  DirectionalLightHelper,
  GridHelper,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import {
  CSS2DObject,
  CSS2DRenderer,
  CSS3DRenderer,
  CSS3DSprite,
} from "three/examples/jsm/Addons.js";
import { UserDataType } from "../app/type";
import { cleaerOldLabel, createGroupIfNotExist, getTourSrc } from "./utils";
import { userData } from "./config3d";
import { setClassName } from "../app/utils";
import { setScene } from "./init3dEditor";
import { setTextureBackground } from "./common3d";

export function createPerspectiveCamera(
  node: HTMLElement,
  cameraName = "透视相机"
) {
  const camera = new PerspectiveCamera(
    75,
    node.offsetWidth / node.offsetHeight,
    0.1,
    1000
  );
  camera.name = cameraName;
  const { x, y, z } = userData.perspectiveCameraPosition;
  camera.position.set(x, y, z);
  camera.userData.isSelected = false;

  return camera;
}

export function createDirectionalLight(name = "平行光") {
  // 添加正交光源
  const light = new DirectionalLight(0xffffff, 2.16);
  light.name = name;
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
  //   light.castShadow = true; // 开启投射阴影
  light.lookAt(0, 0, 0);
  return light;
}
export function createDirectionalLightHelper(light: DirectionalLight) {
  return new DirectionalLightHelper(light, 1, "#fff");
}

export function createGridHelper(name = "网格辅助", wh = new Vector2(10, 10)) {
  const gridHelper = new GridHelper(wh.x, wh.y);
  gridHelper.userData = {
    type: UserDataType.GridHelper,
    isHelper: true,
    isSelected: false,
  };
  gridHelper.name = name;
  return gridHelper;
}

export function createRenderer(node: HTMLElement) {
  const renderer = new WebGLRenderer();
  renderer.shadowMap.enabled = true;

  renderer.setSize(node.offsetWidth, node.offsetHeight);
  return renderer;
}

export function createConfig(scene: Scene, node: HTMLElement) {
  const { config3d } = scene.userData;
  let labelRenderer2d, labelRenderer3d;
  if (config3d.css2d) {
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.top = "0px";
    labelRenderer2d = createLabelRenderer(node, labelRenderer);
    // new OrbitControls(perspectiveCamera, labelRenderer2d.domElement);
  }
  if (config3d.css3d) {
    const labelRenderer = new CSS3DRenderer();
    labelRenderer.domElement.style.top = "0px";
    labelRenderer3d = createLabelRenderer(node, labelRenderer);
  }
  return { labelRenderer2d, labelRenderer3d };
}

export function createScene() {
  const scene = new Scene();
  scene.userData = userData;
  //scene.background = new Color("#000116");
  setTextureBackground(scene);
  return scene;
}
export function createNewScene() {
  cleaerOldLabel();
  const newScene = new Scene();
  //const { themeColor } = userData.APP_THEME;
  // newScene.background =
  //   themeColor === APP_COLOR.Dark ? new Color("#000116") : new Color("#eee");

  newScene.userData = userData;
  newScene.userData.APP_THEME.sceneCanSave = false;
  setTextureBackground(newScene);
  const HELPER_GROUP = createGroupIfNotExist(newScene, "HELPER_GROUP");

  HELPER_GROUP?.add(createGridHelper());
  HELPER_GROUP && newScene.add(HELPER_GROUP);

  newScene.add(createDirectionalLight());
  setScene(newScene);
  return newScene;
}

export function createCss2dLabel(name: string, logo: string) {
  const div = createDiv(logo, name);
  const css2DObject = new CSS2DObject(div);
  css2DObject.name = name;
  css2DObject.userData = {
    type: UserDataType.CSS2DObject,
    labelLogo: logo,
  };

  return css2DObject;
}

export function createLabelRenderer(
  node: HTMLElement,
  renderer: CSS2DRenderer | CSS3DRenderer
) {
  const labelRenderer = renderer;
  labelRenderer.setSize(node.offsetWidth, node.offsetHeight);
  // const top = node.childNodes[0] as HTMLElement;
  // const tt = top.getBoundingClientRect().top;
  labelRenderer.domElement.style.position = "absolute";
  // labelRenderer.domElement.style.zIndex = "-1";
  labelRenderer.domElement.style.pointerEvents = "none";
  node.appendChild(labelRenderer.domElement);
  return labelRenderer;
}

function createDiv(
  logo: string,
  name: string,
  tourObject?: {
    id: string;
    title: string;
  },
  dispatchTourWindow?: any
) {
  const div = document.createElement("div");
  div.className = "mark-label";
  const img = document.createElement("i");
  img.className = setClassName(logo);
  div.appendChild(img);

  const span = document.createElement("span");
  span.textContent = name;
  div.appendChild(span);

  if (tourObject) {
    const i = document.createElement("i");
    i.className = setClassName("eye");
    i.classList.add("ms-2");
    i.style.cursor = "pointer";
    i.setAttribute("data-tour-id", tourObject.id);
    i.addEventListener("click", function () {
      dispatchTourWindow({
        type: "tourWindow",
        payload: {
          show: true,
          title: tourObject.title,
          tourSrc: getTourSrc(tourObject.id),
        },
      });
    });
    div.appendChild(i);
  }

  return div;
}

export function createCss3dLabel(
  name: string,
  logo: string,
  tourObjectect?: any,
  dispatchTourWindow?: any
) {
  const div = createDiv(logo, name, tourObjectect, dispatchTourWindow);
  const css3DSprite = new CSS3DSprite(div);

  css3DSprite.name = name;
  css3DSprite.position.set(0, 0, 0);
  css3DSprite.scale.set(0.04, 0.04, 0.04);

  css3DSprite.userData = {
    type: UserDataType.CSS3DObject,
    labelLogo: logo,
    tourObjectect: tourObjectect,
  };
  return css3DSprite;
}
