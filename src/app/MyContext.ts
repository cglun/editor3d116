import { createContext } from "react";

import { Scene } from "three";

export type EditorScene = { type: string; payload: Scene };
export type TourWindow = {
  type: string;
  payload: {
    show: boolean;
    tourSrc: string;
    title: string;
  };
};

export const initScene: EditorScene = {
  type: "scene",
  payload: new Scene(),
};
export const initTourWindow: TourWindow = {
  type: "tourWindow",
  payload: {
    show: false,
    title: "全景漫游",
    tourSrc: "",
  },
};

export const MyContext = createContext<{
  scene: EditorScene;
  dispatchScene: React.Dispatch<EditorScene>;
  tourWindow: TourWindow;
  dispatchTourWindow: React.Dispatch<TourWindow>;
}>({
  scene: initScene,
  dispatchScene: () => {},
  tourWindow: initTourWindow,
  dispatchTourWindow: () => {},
});
