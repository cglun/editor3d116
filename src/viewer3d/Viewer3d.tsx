import { useEffect, useRef } from "react";

import createScene, { getCamera, getRenderer } from "../three/init3dViewer";
import { onWindowResize } from "../three/utils";
/**
 * 其他应用可以调用此组件，
 * @returns
 */

export default function Viewer3d({
  canvasStyle = { height: "100vh", width: "100vw" },
}) {
  const canvas3d: React.RefObject<HTMLDivElement> = useRef<
    HTMLDivElement | any
  >();
  useEffect(() => {
    // init3d(canvas3d);
    if (canvas3d.current) {
      createScene(canvas3d.current);
    }
    window.addEventListener("resize", () =>
      onWindowResize(canvas3d, getCamera(), getRenderer())
    );
    return () => {
      window.removeEventListener("resize", () =>
        onWindowResize(canvas3d, getCamera(), getRenderer())
      );
    };
  }, []);

  return <div style={canvasStyle} ref={canvas3d}></div>;
}
