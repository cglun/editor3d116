import {
  BoxHelper,
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
  GLTF,
  CSS2DRenderer,
  CSS3DRenderer,
} from "three/examples/jsm/Addons.js";
import { GlbModel, UserDataType } from "../app/type";

import {
  config3d,
  createDirectionalLight,
  createGridHelper,
  createLabelRenderer,
  glbLoader,
} from "./utils";

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
  transfControls2: TransformControls,
  perspectiveCameraPosition: Vector3 = new Vector3(-5, 5, 8),
  labelRenderer2d: CSS2DRenderer,
  labelRenderer3d: CSS3DRenderer;

export function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  if (labelRenderer2d && config3d.css2d) {
    labelRenderer2d.render(scene, camera);
  }
  if (labelRenderer3d && config3d.css3d) {
    labelRenderer3d.render(scene, camera);
  }
}

export function addLight(): void {
  const light = createDirectionalLight("平行光");
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
  perspectiveCamera.position.set(
    perspectiveCameraPosition.x,
    perspectiveCameraPosition.y,
    perspectiveCameraPosition.z
  );

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

  // 初始化轨道控制器
  controls1 = new OrbitControls(perspectiveCamera, renderer.domElement);
  controls2 = new OrbitControls(orthographicCamera, renderer.domElement);
  controls = controls1;

  // 初始化变换控制器
  transfControls1 = new TransformControls(
    perspectiveCamera,
    renderer.domElement
  );
  transfControls2 = new TransformControls(
    orthographicCamera,
    renderer.domElement
  );
  transfControls = transfControls1;
  if (config3d.css2d) {
    labelRenderer2d = createLabelRenderer(node, new CSS2DRenderer());
    // new OrbitControls(perspectiveCamera, labelRenderer2d.domElement);
  }
  if (config3d.css3d) {
    labelRenderer3d = createLabelRenderer(node, new CSS3DRenderer());
  }

  animate();
}

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

export function addLocalModel() {
  const url = "/editor3d/static/models/blender.glb";
  const loader = glbLoader();
  loader.load(url, function (gltf) {
    scene.children = gltf.scene.children;
    addLight();
    addGridHelper();
  });
}

export function gltfToScene(gltf: GLTF) {
  // scene.add(gltf.scene);
  const _gltf = gltf.scene;
  const children = [...gltf.scene.children];
  for (let i = 0; i < children.length; i++) {
    const element = children[i];
    element.userData = {
      ...element.userData,
      ..._gltf.userData,
      type: UserDataType.GlbModel,
    };
    scene.add(element);
  }
}

export function addGlb1(modelUrl = "/editor3d/static/models/blender.glb") {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/editor3d/static/js/draco/gltf/");
  //const loader = new GLTFLoader(new LoadingManager());
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  return new Promise((resolve) => {
    loader.load(modelUrl, (gltf) => {
      const children = gltf.scene.children;
      for (let i = 0; i < children.length; i++) {
        const element = children[i];
        element.userData.type = UserDataType.GlbModel;
        scene.children.push(element);
      }
      resolve(gltf);
    });
  });
}

// 场景序列化
export function sceneSerialization(): string {
  const modelList: GlbModel[] = [];
  const oldChildren = [...scene.children];

  const children = scene.children.filter((child: Object3D | any) => {
    const childUserData = child.userData;
    if (childUserData.type === UserDataType.GlbModel) {
      const { id, name, position, rotation, scale } = child;

      const model: GlbModel = {
        id,
        name,
        position,
        rotation,
        scale,
        userData: child.userData,
      };

      modelList.push(model);
    } else {
      if (!childUserData.isHelper) {
        return child;
      }
    }
  });

  scene.children = children;

  const result = {
    sceneJsonString: JSON.stringify(scene.toJSON()),
    cameraJsonString: JSON.stringify(perspectiveCamera.toJSON()),
    modelsJsonString: JSON.stringify(modelList),
    config3d: JSON.stringify(config3d),
    type: "scene",
  };
  scene.children = oldChildren;
  return JSON.stringify(result);
}

export function addGridHelper() {
  scene.add(createGridHelper("网格辅助"));
}

export function getDivElement() {
  return divElement;
}
export function getLabelRenderer() {
  return labelRenderer2d;
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
export function setBoxHelper(selectedMesh: Object3D = new Object3D()) {
  if (boxHelper === undefined) {
    boxHelper = new BoxHelper(selectedMesh, 0xffff00);
    boxHelper.userData = {
      type: UserDataType.BoxHelper,
      isHelper: true,
      isSelected: false,
    };
    scene.add(boxHelper);
  } else {
    scene.add(boxHelper);
  }
}

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
    setBoxHelper();
  }

  const getHelper = transfControls.getHelper();
  getHelper.name = "TransformControlsRoot";

  getHelper.userData = {
    type: UserDataType.TransformHelper,
    isHelper: true,
    isSelected: false,
  };
  scene.add(getHelper);
  getHelper.traverse((child) => {
    child.userData = {
      type: UserDataType.TransformHelper,
      isHelper: true,
      isSelected: false,
    };
  });
}
