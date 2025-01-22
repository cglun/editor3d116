import React from "react";
import { createRootRoute } from "@tanstack/react-router";
import { initScene, initToast, MyContext } from "../app/MyContext";
import reducerToast, { reducerScene } from "../app/reducer";
import EditorIndex from "../component/Editor/EditorIndex";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [toast, dispatchToast] = React.useReducer(reducerToast, initToast);
  const [scene, dispatchScene] = React.useReducer(reducerScene, initScene);
  // const MyContext = createContext(1);
  return (
    <MyContext.Provider value={{ toast, dispatchToast, scene, dispatchScene }}>
      <EditorIndex />
    </MyContext.Provider>
  );
}
