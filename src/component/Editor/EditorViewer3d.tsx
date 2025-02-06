import React, { memo, useContext, useEffect, useRef } from "react";

import { MyContext } from "../../app/MyContext";
import createScene, { getScene } from "../../three/init3d116"; // 初始化

function EditorViewer3d() {
  const editorCanvas: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);
  const { dispatchScene } = useContext(MyContext);
  useEffect(() => {
    if (editorCanvas.current) {
      createScene(editorCanvas.current);
    }

    dispatchScene({
      type: "setScene",
      payload: getScene().clone(),
    });
    return () => {
      editorCanvas.current?.children[0].remove();
    };
  }, []);

  return <div style={{ height: "70vh" }} ref={editorCanvas}></div>;
}
export default memo(EditorViewer3d);
