import React from "react";
import { createRootRoute } from "@tanstack/react-router";
import { initScene, MyContext } from "../app/MyContext";
import { reducerScene } from "../app/reducer";
import Editor from "../component/Editor/Index";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [scene, dispatchScene] = React.useReducer(reducerScene, initScene);
  return (
    <MyContext.Provider value={{ scene, dispatchScene }}>
      <Editor />
    </MyContext.Provider>
  );
}
