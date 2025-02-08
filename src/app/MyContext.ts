import { createContext } from "react";
import { ToastBody, ModalBody } from "./type";
import { Scene } from "three";

export type Toast = { type: string; toastBody: ToastBody };
export type Modal = { type: string; ModalBody: ModalBody };
export type EditorScene = { type: string; payload: Scene };

export const initScene: EditorScene = {
  type: "scene",
  payload: new Scene(),
};
export const MyContext = createContext<{
  scene: EditorScene;
  dispatchScene: React.Dispatch<EditorScene>;
}>({
  scene: initScene,
  dispatchScene: () => {},
});
