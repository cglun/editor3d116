import {
  Group,
  Object3D,
  ObjectLoader,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { UserDataType } from "../app/type";

import {
  CSS2DObject,
  CSS2DRenderer,
  CSS3DRenderer,
  CSS3DSprite,
  DRACOLoader,
  GLTFLoader,
} from "three/examples/jsm/Addons.js";
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
  labelRenderer: CSS2DRenderer | undefined
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
//const { tourWindow, dispatchTourWindow } = useContext(MyContext);
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

export function setLabel(scene: Scene, dispatchTourWindow?: any) {
  cleaerOldLabel();
  const MARK_LABEL = scene.getObjectByName("MARK_LABEL");
  if (!MARK_LABEL) {
    return;
  }

  const children = MARK_LABEL.children;
  children.forEach((item) => {
    const { type } = item.userData;
    let label = createCss3dLabel(
      item.name,
      item.userData.labelLogo,
      item.userData.tourObjectect,
      dispatchTourWindow
    );

    if (type === UserDataType.CSS2DObject) {
      label = createCss2dLabel(item.name, item.userData.labelLogo);
    }
    const { x, y, z } = item.position;
    label.position.set(x, y, z);
    item.userData.needDelete = true;
    MARK_LABEL.add(label);
  });

  const labelList = children.filter((item) => {
    if (!item.userData.needDelete) {
      return item;
    }
  });

  MARK_LABEL.children = labelList;
}
//删除之前的标签
export function cleaerOldLabel() {
  const labelDiv = document.querySelectorAll(".mark-label");
  if (labelDiv.length > 0) {
    labelDiv.forEach((element) => {
      element.parentNode?.removeChild(element);
    });
  }
}
function getTourSrc(tourObjectect: string) {
  let tourSrc = "/#/preview/";
  if (tourObjectect) {
    tourSrc = "/#/preview/" + tourObjectect;
    if (import.meta.env.DEV) {
      tourSrc = "http://localhost:5173/#/preview/" + tourObjectect;
    }
  }
  return tourSrc;
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
  const { scene, models, loader } = strToJson(data);
  const newScene = new Scene();
  loader.parse(scene, function (object: Scene | any) {
    const { children, fog, background, userData } = object;
    newScene.children = children;
    newScene.fog = fog;
    newScene.background = background;

    newScene.userData = {
      ...userData,
      projectName: item.name,
      projectId: item.id,
      canSave: true,
      selected3d: null,
    };
  });
  let newCamera = new PerspectiveCamera();

  const { x, y, z } = newScene.userData.fiexedCameraPosition;
  newCamera.position.set(x, y, z);

  // loader.parse(camera, function (object: PerspectiveCamera | any) {
  //   debugger;
  //   const { x, y, z } = newScene.userData.fiexedCameraPosition;
  //   newCamera.position.set(x, y, z);
  //   newCamera = object;
  // });

  return {
    scene: newScene,
    camera: newCamera,
    modelList: models,
  };
}

export function getProjectData(id: number) {
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

export function glbLoader() {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/editor3d/static/js/draco/gltf/");
  //const loader = new GLTFLoader(new LoadingManager());
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  return loader;
}

export function removeCanvasChild(canvas3d: HTMLDivElement | any) {
  if (canvas3d.current !== null) {
    const { children } = canvas3d.current;
    for (let i = 0; i < children.length; i++) {
      children[i].remove();
    }
  }
}

export function getModelGroup(model: Object3D | any, gltf: Scene | any) {
  const { position, rotation, scale } = model;
  const group = new Group();
  group.name = model.name;
  group.add(...gltf.scene.children);
  group.userData = {
    ...model.userData,
    type: UserDataType.GlbModel,
  };
  group.position.set(position.x, position.y, position.z);

  group.position.set(position.x, position.y, position.z);

  // group.rotation.set(rotation._x, rotation._y, rotation._z, "XYZ");
  group.setRotationFromEuler(rotation);
  group.scale.set(scale.x, scale.y, scale.z);
  return group;
}
