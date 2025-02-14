import { Euler, Vector3 } from "three";

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

export interface ModalBody {
  title: string;
  show: boolean;
  body: any;
  action: {
    targetId: number;
    type: ACTION_TYPE;
  } | null;
}
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
  modelUrl: string;
}

export enum UserDataType {
  GlbModel = "GlbModel",
  TransformHelper = "TransformHelper",
  GridHelper = "GridHelper",
  BoxHelper = "BoxHelper",
}
