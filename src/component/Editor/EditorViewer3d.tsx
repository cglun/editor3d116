import React, { memo, useContext, useEffect, useRef } from "react";

import { MyContext } from "../../app/MyContext";
import createScene, {
  getScene,
  getTransfControls,
  setCameraType,
} from "../../three/init3d116"; // 初始化
import { Button, ButtonGroup } from "react-bootstrap";
import { getThemeColor } from "../../app/config";
import { TransformControlsMode } from "three/examples/jsm/Addons.js";
import { Object3D, Vector3 } from "three";
import { setClassName } from "../../app/utils";

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
  const buttonColor = getThemeColor();
  const transfControls = getTransfControls();
  function setMode(modeName: TransformControlsMode) {
    transfControls.setMode(modeName);
  }
  return (
    <div className="position-relative">
      <div style={{ height: "70vh" }} ref={editorCanvas}></div>
      <div className="position-absolute" style={{ left: "1rem", top: "1rem" }}>
        <ButtonGroup>
          <Button
            variant={buttonColor}
            title="移动"
            onClick={() => {
              setMode("translate");
            }}
          >
            <i className="bi bi-arrows-move"></i>
          </Button>
          <Button
            variant={buttonColor}
            title="旋转"
            onClick={() => {
              setMode("rotate");
            }}
          >
            <i className="bi bi-arrow-repeat"></i>
          </Button>
          <Button
            variant={buttonColor}
            title="缩放"
            onClick={() => {
              setMode("scale");
            }}
          >
            <i className="bi bi-arrows-angle-expand"></i>
          </Button>
          <Button
            variant={buttonColor}
            title="顶视"
            onClick={() => {
              setCameraType("OrthographicCamera", new Vector3(0, 1, 0));
            }}
          >
            <i className="bi bi-align-top"></i>
          </Button>
          <Button
            variant={buttonColor}
            title="前视"
            onClick={() => {
              setCameraType("OrthographicCamera", new Vector3(0, 0, 1));
            }}
          >
            <i className="bi bi-align-middle"></i>
          </Button>
          <Button
            variant={buttonColor}
            title="左视"
            onClick={() => {
              setCameraType("OrthographicCamera", new Vector3(1, 0, 0));
            }}
          >
            <i className="bi bi-align-start"></i>
          </Button>
          <Button
            variant={buttonColor}
            title="透视"
            onClick={() => {
              setCameraType("PerspectiveCamera", Object3D.DEFAULT_UP);
            }}
          >
            <i className={setClassName("box")}></i>
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
export default memo(EditorViewer3d);
