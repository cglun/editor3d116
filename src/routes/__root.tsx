import React from "react";
import { createRootRoute } from "@tanstack/react-router";
import { initScene, MyContext } from "../app/MyContext";
import { reducerScene } from "../app/reducer";
import EditorIndex from "../component/Editor/EditorIndex";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [scene, dispatchScene] = React.useReducer(reducerScene, initScene);
  return (
    <MyContext.Provider value={{ scene, dispatchScene }}>
      <EditorIndex />
    </MyContext.Provider>
  );
}
