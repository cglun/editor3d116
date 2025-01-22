import { Scene116, Toast } from './MyContext';

export default function reducerToast(toast: Toast, action: Toast): any {
  switch (action.type) {
    case 'toast':
      return { ...toast, toastBody: { ...action.toastBody } };
    default:
      return toast;
  }
}

export function reducerScene(scene: Scene116, action: Scene116): any {
  switch (action.type) {
    case 'setScene':
      return { ...scene, payload: { ...action.payload } };
    default:
      return scene;
  }
}
