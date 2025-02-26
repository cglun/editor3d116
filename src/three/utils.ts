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

export function createLabelRenderer(
  node: HTMLElement,
  renderer: CSS2DRenderer | CSS3DRenderer
) {
  const labelRenderer = renderer;
  labelRenderer.setSize(node.offsetWidth, node.offsetHeight);
  // const top = node.childNodes[0] as HTMLElement;
  // const tt = top.getBoundingClientRect().top;
  // debugger;

  labelRenderer.domElement.style.position = "absolute";

  // labelRenderer.domElement.style.zIndex = "-1";
  labelRenderer.domElement.style.pointerEvents = "none";
  node.appendChild(labelRenderer.domElement);
  return labelRenderer;
}

function createDiv(logo: string, name: string) {
  const div = document.createElement("div");
  div.className = "mark-label";
  const img = document.createElement("i");
  img.className = setClassName(logo);
  div.appendChild(img);

  const span = document.createElement("span");
  span.textContent = name;
  div.appendChild(span);

  return div;
}

export function createCss3dLabel(name: string, logo: string) {
  const div = createDiv(logo, name);
  const css3DSprite = new CSS3DSprite(div);

  css3DSprite.name = name;
  css3DSprite.position.set(0, 0, 0);
  css3DSprite.scale.set(0.04, 0.04, 0.04);
  css3DSprite.userData = {
    type: UserDataType.CSS3DObject,
    labelLogo: logo,
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

export function setLabel(scene: Scene) {
  const MARK_LABEL = scene.getObjectByName("MARK_LABEL");
  if (!MARK_LABEL) {
    return;
  }
  cleaerOldLabel();
  const children = MARK_LABEL.children;
  children.forEach((item) => {
    const { type } = item.userData;
    let label = createCss3dLabel(item.name, item.userData.labelLogo);

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
      selectedObject: null,
    };
  });
  let newCamera = new PerspectiveCamera();
  debugger;
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

export function glbLoader() {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/editor3d/static/js/draco/gltf/");
  //const loader = new GLTFLoader(new LoadingManager());
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  return loader;
}
