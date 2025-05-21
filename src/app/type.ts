import {
  Euler,
  Mesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Extra3d, Parameters3d } from "../three/config3d";

export interface CanvasNode {
  width: number;
  height: number;
}
export interface SceneItem {
  id: number;
  description: string;
  name: string;
  projectId: number;
  type: string;
}
export enum APP_COLOR {
  Primary = "primary",
  Secondary = "secondary",
  Success = "success",
  Danger = "danger",
  Warning = "warning",
  Info = "info",
  Light = "light",
  Dark = "dark",
}

export enum DELAY {
  SHORT = 1000,
  MIDDLE = 2000,
  LONG = 3000,
}

export interface ToastBody {
  title: string;
  content: string;
  type: APP_COLOR;
  delay: DELAY;
  show: boolean;
}

export enum HTTP_TYPE {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  UPDATE = "UPDATE",
}

export interface GlbModel {
  id?: number;
  name: string;
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  userData: {
    modelUrl: string;
    modelTotal: number;
  };
}

export enum UserDataType {
  GlbModel = "GlbModel",
  TransformHelper = "TransformHelper",
  GridHelper = "GridHelper",
  BoxHelper = "BoxHelper",
  CSS2DObject = "CSS2DObject",
  CSS3DObject = "CSS3DObject",
}

export type SelectedObject = Scene | PerspectiveCamera | Mesh | Object3D;

export interface RecordItem {
  id: number;
  name: string;
  des: string;
  cover: string;
}
export interface ProjectListResponse {
  code: number;
  message: string;
  data: {
    records: RecordItem[];
  };
}
// export interface ActionItem {
//   showName: string;
//   NAME_ID: string;
//   handler: (obj?: {}) => void;
// }
export interface ActionItemMap {
  showName: string | string[];
  NAME_ID: string;
  handler?: (nameId?: string) => void;
  data?: {
    isSelected: boolean;
    isRunning?: boolean;
    cameraPosition?: {
      x: number;
      y: number;
      z: number;
    };
  };
}
// 使用 = 定义类型，并且明确成员类型为字符串字面量类型
export type CustomButtonType = "TOGGLE" | "DRAWER" | "STRETCH";
interface UserSetting {
  modelOffset?: {
    x: number;
    y: number;
    z: number;
  };
  cameraOffset?: {
    x: number;
    y: number;
    z: number;
  };
  animationTime?: number;
  speed?: number;
}

export type CustomButtonListType = {
  canBeSelectedModel: {
    groupNameList: string[];
    modelNameList: string[];
  };
  toggleButtonGroup: {
    name: string;
    type: CustomButtonType;
    listGroup: ActionItemMap[];
    userSetting?: UserSetting;
  };
  roamButtonGroup: {
    name: string;
    type: "ROAM";
    userSetting?: UserSetting;
    listGroup: ActionItemMap[];
  };
};

// 定义 item 的类型
export type TourItem = {
  id: number; // 假设 id 是数字类型
  title: string;
  thumbUrl: string;
};
export interface ConfirmButton {
  show?: boolean;
  hasButton?: boolean;
  closeButton?: boolean;
}

// 定义 context 的类型
export interface Context116 {
  getScene: () => Scene; // 返回 Scene 类型
  getControls: () => OrbitControls; // 返回 OrbitControls 类型
  getCamera: () => PerspectiveCamera | OrthographicCamera; // 返回 PerspectiveCamera 类型
  getAll: () => {
    scene: Scene;
    camera: PerspectiveCamera | OrthographicCamera;
    controls: OrbitControls;
    renderer: WebGLRenderer;
    divElement: HTMLDivElement;
    extra3d: Extra3d;
    parameters3d: Parameters3d;
  }; // 返回 object 类型
  getUserData?: () => {}; // 返回 {}

  getToggleButtonGroup?: () => ActionItemMap[]; // 返回 ActionItemMap[] 类型
  getRoamListByRoamButtonMap?: () => ActionItemMap[]; // 返回 ActionItemMap[] 类型
}
