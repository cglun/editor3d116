import React from "react";
import { createRootRoute } from "@tanstack/react-router";
import { initEditorScene, initTourWindow, MyContext } from "../app/MyContext";
import { reducerScene, reducerTour } from "../app/reducer";
import Editor from "../component/Editor/Index";
import { Alert } from "react-bootstrap";
import { APP_COLOR } from "../app/type";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <Alert variant={APP_COLOR.Danger}>404 Not Found</Alert>
  ),
});

function RootComponent() {
  const [scene, dispatchScene] = React.useReducer(
    reducerScene,
    initEditorScene
  );
  const [tourWindow, dispatchTourWindow] = React.useReducer(
    reducerTour,
    initTourWindow
  );

  return (
    <MyContext.Provider
      value={{ scene, dispatchScene, tourWindow, dispatchTourWindow }}
    >
      <Editor />
    </MyContext.Provider>
  );
}
