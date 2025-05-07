import {
  Euler,
  Mesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Vector3,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
export interface ActionItem {
  name: string;
  handler: () => void;
}
export interface ActionItemMap {
  name: string;
  handler: () => void;
  data: {
    cameraView: Vector3 | undefined;
  };
}

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
  getActionList: () => ActionItem[]; // 返回 ActionItem[] 类型
  getAll: () => object; // 返回 object 类型
  getActionListByButtonMap: () => ActionItemMap[]; // 返回 ActionItemMap[] 类型
}
