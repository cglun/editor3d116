import { EditorScene, TourWindow } from "./MyContext";

export function reducerTour(
  tourWindow: TourWindow,
  action: TourWindow
): TourWindow {
  switch (action.type) {
    case "tourWindow":
      return { ...tourWindow, payload: { ...action.payload } };
    default:
      return tourWindow;
  }
}

export function reducerScene(
  scene: EditorScene,
  action: EditorScene
): EditorScene | any {
  switch (action.type) {
    case "setScene":
      return { ...scene, payload: { ...action.payload } };
    default:
      return scene;
  }
}
