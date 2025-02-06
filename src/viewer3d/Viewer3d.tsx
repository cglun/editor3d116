import { useEffect, useRef } from "react";

import createScene from "../three/init3d105";
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
    createScene(canvas3d.current);
  }, []);

  return <div style={canvasStyle} ref={canvas3d}></div>;
}
