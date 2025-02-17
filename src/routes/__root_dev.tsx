import React from "react";
import { createRootRoute } from "@tanstack/react-router";
import { initScene, MyContext } from "../app/MyContext";
import { reducerScene } from "../app/reducer";

import Viewer3d from "../viewer3d/Viewer3d";
import Button from "react-bootstrap/esm/Button";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [scene, dispatchScene] = React.useReducer(reducerScene, initScene);

  const [item, setItem] = React.useState({
    id: 139,
    name: "立方体",
    des: "Scene",
    cover: "",
  });
  return (
    <MyContext.Provider value={{ scene, dispatchScene }}>
      {/* <Editor /> */}
      <Button
        onClick={() => {
          setItem({
            ...item,
            id: item.id + 1,
          });
        }}
      >
        ++
      </Button>
      <Viewer3d item={item}></Viewer3d>
    </MyContext.Provider>
  );
}
