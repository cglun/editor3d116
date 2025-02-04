import { useEffect, useRef } from "react";

import { init3d } from "../three/utils";
/**
 * 其他应用可以调用此组件，
 * @returns
 */

export default function Viewer3d({
  canvasStyle = { height: "60vh", width: "60vw" },
}) {
  const canvas3d: React.RefObject<HTMLDivElement> = useRef<
    HTMLDivElement | any
  >();
  useEffect(() => {
    init3d(canvas3d);
  }, []);

  return <div style={canvasStyle} ref={canvas3d}></div>;
}
