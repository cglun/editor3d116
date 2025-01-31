import React, { memo, useContext, useEffect, useRef } from "react";

import { init3d } from "../../three/utils";
import { MyContext } from "../../app/MyContext";
import { getScene } from "../../three/init3d116";

function Canvas3d() {
  const canvas3d: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);
  const { dispatchScene } = useContext(MyContext);

  useEffect(() => {
    init3d(canvas3d);

    dispatchScene({
      type: "setScene",
      payload: getScene(),
    });
    return () => {
      canvas3d.current?.children[0].remove();
    };
  }, []);

  return <div style={{ height: "70vh" }} ref={canvas3d}></div>;
}
export default memo(Canvas3d);
