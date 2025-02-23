import {
  DirectionalLight,
  GridHelper,
  Object3D,
  ObjectLoader,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { UserDataType } from "../app/type";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/Addons.js";
import { setClassName } from "../app/utils";
import { ItemInfo } from "../component/Editor/ListCard";
import _axios from "../app/http";

export function getObjectNameByName(object3D: Object3D): string {
  return object3D.name.trim() === "" ? object3D.type : object3D.name;
}

export function hasClass(obj: any, className: string) {
  return obj.classList.contains(className);
}

export function toggleClass(currentSelectDiv: any, className: string) {
  currentSelectDiv.classList.contains(className)
    ? currentSelectDiv.classList.add(className)
    : currentSelectDiv.classList.remove(className);
}

export function toggleAttribute(
  currentSelectDiv: any,
  attribute: string,
  value: string
) {
  currentSelectDiv.getAttribute(attribute)?.includes(value)
    ? currentSelectDiv.removeAttribute(attribute)
    : currentSelectDiv.setAttribute(attribute, value);
}

//base64转码
export function base64(file: File) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function hasAttribute(obj: any, attribute: string, includes: string) {
  return obj.getAttribute(attribute)?.includes(includes);
}

export function onWindowResize(
  canvas: React.RefObject<HTMLDivElement>,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  labelRenderer: CSS2DRenderer | null
) {
  if (canvas.current !== null) {
    const width = canvas.current.offsetWidth;
    const height = canvas.current.offsetHeight;
    camera.aspect = width / height; // 设置相机的宽高比和视口的宽高比一致
    camera.updateProjectionMatrix(); // 更新相机的投影矩阵
    renderer.setSize(width, height); // 更新渲染器的大小
    if (labelRenderer) {
      labelRenderer.setSize(width, height);
    }
  }
}

export function createGridHelper(name: string) {
  const gridHelper = new GridHelper(16, 16);
  gridHelper.userData = {
    type: UserDataType.GridHelper,
    isHelper: true,
    isSelected: false,
  };
  gridHelper.name = name;
  return gridHelper;
}

export function createDirectionalLight(name: string) {
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
  light.castShadow = true; // 开启投射阴影
  light.lookAt(0, 0, 0);
  return light;
}

export function createLabelRenderer(node: HTMLElement) {
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(node.offsetWidth, node.offsetHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  // labelRenderer.domElement.style.zIndex = "-1";
  labelRenderer.domElement.style.pointerEvents = "none";
  node.appendChild(labelRenderer.domElement);
  return labelRenderer;
}

export function createCss2dLabel(name: string, logo: string) {
  const div = document.createElement("div");
  div.className = "mark-label";

  const img = document.createElement("i");
  img.className = setClassName(logo);
  div.appendChild(img);

  const span = document.createElement("span");
  span.textContent = name;
  div.appendChild(span);

  //div.style.backgroundColor = "transparent";
  div.style.backgroundColor = "var(--bs-link-hover-color";
  const divLabel = new CSS2DObject(div);
  divLabel.name = name;
  divLabel.userData = {
    type: UserDataType.CSS2DObject,
    labelLogo: logo,
  };
  // divLabel.userData = {
  //   type: UserDataType.Label,
  //   isHelper: true,
  //   isSelected: false,
  // };
  //const { x, y, z } = model.position;
  // divLabel.position.set(x, y, z);
  //  divLabel.center.set(0, 0);
  //  model.userData.label = divLabel;
  return divLabel;
}
export function strToJson(str: string) {
  const json = JSON.parse(str);
  const { sceneJsonString, cameraJsonString, modelsJsonString, type } = json;
  const scene: Scene = JSON.parse(sceneJsonString);
  const camera: PerspectiveCamera = JSON.parse(cameraJsonString);
  const models = JSON.parse(modelsJsonString);
  const loader = new ObjectLoader();
  return { scene, camera, models, type, loader };
}

//反序列化
export function sceneDeserialize(data: string, item: ItemInfo) {
  const { scene, camera, models, loader } = strToJson(data);
  const newScene = new Scene();
  loader.parse(scene, function (object: Scene | any) {
    const { children, fog, background } = object;
    newScene.children = children;
    newScene.fog = fog;
    newScene.background = background;
    newScene.userData = {
      projectName: item.name,
      projectId: item.id,
      canSave: true,
    };
  });
  let newCamera = new PerspectiveCamera();
  loader.parse(camera, function (object: PerspectiveCamera | any) {
    newCamera = object;
  });

  return { scene: newScene, camera: newCamera, modelList: models };
}

export function getProjectData(id: number | string) {
  return new Promise((resolve, reject) => {
    _axios
      .get(`/project/getProjectData/${id}`)
      .then((res) => {
        if (res.data.data) {
          const data = res.data.data;
          // const _data: GlbModel = JSON.parse(data);
          resolve(data);
        } else {
          reject(res.data.message);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const config3d = {
  css2d: true,
};
