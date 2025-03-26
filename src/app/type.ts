import {
  Euler,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Scene,
  Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

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

// export interface ModalBody {
//   title: string;
//   show: boolean;
//   body: any;
//   action: {
//     targetId: number;
//     type: ACTION_TYPE;
//   } | null;
// }
export enum HTTP_TYPE {
  GET = "GET",
  POST = "POST",
}
export enum ACTION_TYPE {
  ADD = "ADD",
  DELETE = "DELETE",
  UPDATE = "UPDATE",
}
export type ViewType = string | null;

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

// export type XXXX = {
//   modelUrl: string;
//   modelTotal: number;
//   type: "Mesh";
// };

export type EditorObject3d = Scene | PerspectiveCamera | Mesh | Object3D;

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
  id: string;
  handler: () => void;
}
export interface EditorExportObject {
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  all: object;
  getActionList: () => ActionItem[];
}
