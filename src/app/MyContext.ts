import { createContext } from "react";
import { ToastBody, ModalBody } from "./type";
import { Scene } from "three";

export type Toast = { type: string; toastBody: ToastBody };
export type Modal = { type: string; ModalBody: ModalBody };
export type Scene116 = { type: string; payload: Scene };

export const initScene: Scene116 = {
  type: "scene",
  payload: new Scene(),
};
export const MyContext = createContext<{
  scene: Scene116;
  dispatchScene: React.Dispatch<Scene116>;
}>({
  scene: initScene,
  dispatchScene: () => {},
});
