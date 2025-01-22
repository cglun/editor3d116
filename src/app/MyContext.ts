import { createContext } from 'react';
import { DELAY, APP_COLOR, ToastBody, ModalBody } from '../type';
import { Scene } from 'three';

export type Toast = { type: string; toastBody: ToastBody };
export type Modal = { type: string; ModalBody: ModalBody };
export type Scene116 = { type: string; payload: Scene };

export const initToast: Toast = {
  type: 'toast',
  toastBody: {
    title: 'title',
    content: 'content',
    show: false,
    type: APP_COLOR.Success,
    delay: DELAY.MIDDLE,
  },
};
export const initScene: Scene116 = {
  type: 'scene',
  payload: new Scene(),
};
export const MyContext = createContext<{
  toast: Toast;
  dispatchToast: React.Dispatch<Toast>;
  scene: Scene116;
  dispatchScene: React.Dispatch<Scene116>;
}>({
  toast: initToast,
  dispatchToast: () => {},
  scene: initScene,
  dispatchScene: () => {},
});
