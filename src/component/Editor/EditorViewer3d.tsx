import React, { memo, useEffect, useRef } from "react";
import initScene, {
  getPerspectiveCamera,
  getLabelRenderer,
  getRenderer,
  getScene,
  getTransfControls,
  setCameraType,
} from "../../three/init3dEditor"; // 初始化
import { Button, ButtonGroup } from "react-bootstrap";

import { TransformControlsMode } from "three/examples/jsm/Addons.js";
import { Object3D, Vector3 } from "three";
import { getThemeByScene, setClassName } from "../../app/utils";
import {
  createGroupIfNotExist,
  onWindowResize,
  removeCanvasChild,
} from "../../three/utils";
import { useUpdateScene } from "../../app/hooks";
import ModalTour from "../common/ModalTour";
import { createGridHelper } from "../../three/factory3d";

function EditorViewer3d() {
  const editorCanvas: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  const { scene, updateScene } = useUpdateScene();
  let { themeColor } = getThemeByScene(scene);

  useEffect(() => {
    removeCanvasChild(editorCanvas);
    if (editorCanvas.current) {
      initScene(editorCanvas.current);
      const scene = getScene();
      const HELPER_GROUP = createGroupIfNotExist(scene, "HELPER_GROUP");
      HELPER_GROUP?.add(createGridHelper());
      HELPER_GROUP && scene.add(HELPER_GROUP);
    }
    updateScene(getScene().clone());

    window.addEventListener("resize", () =>
      onWindowResize(
        editorCanvas,
        getPerspectiveCamera(),
        getRenderer(),
        getLabelRenderer()
      )
    );
    return () => {
      removeCanvasChild(editorCanvas);
      window.removeEventListener("resize", () =>
        onWindowResize(
          editorCanvas,
          getPerspectiveCamera(),
          getRenderer(),
          getLabelRenderer()
        )
      );
    };
  }, []);

  function setMode(modeName: TransformControlsMode) {
    const transfControls = getTransfControls();
    transfControls.setMode(modeName);
  }

  return (
    <div className="position-relative">
      <div style={{ height: "70vh" }} ref={editorCanvas}></div>
      <div className="position-absolute" style={{ left: "1rem", top: "1rem" }}>
        <ButtonGroup>
          <Button
            variant={themeColor}
            title="移动"
            onClick={() => {
              setMode("translate");
            }}
          >
            <i className="bi bi-arrows-move"></i>
          </Button>
          <Button
            variant={themeColor}
            title="旋转"
            onClick={() => {
              setMode("rotate");
            }}
          >
            <i className="bi bi-arrow-repeat"></i>
          </Button>
          <Button
            variant={themeColor}
            title="缩放"
            onClick={() => {
              setMode("scale");
            }}
          >
            <i className="bi bi-arrows-angle-expand"></i>
          </Button>
          <Button
            variant={themeColor}
            title="顶视"
            onClick={() => {
              setCameraType("OrthographicCamera", new Vector3(0, 1, 0));
            }}
          >
            <i className="bi bi-align-top"></i>
          </Button>
          <Button
            variant={themeColor}
            title="前视"
            onClick={() => {
              setCameraType("OrthographicCamera", new Vector3(0, 0, 1));
            }}
          >
            <i className="bi bi-align-middle"></i>
          </Button>
          <Button
            variant={themeColor}
            title="左视"
            onClick={() => {
              setCameraType("OrthographicCamera", new Vector3(1, 0, 0));
            }}
          >
            <i className="bi bi-align-start"></i>
          </Button>
          <Button
            variant={themeColor}
            title="透视"
            onClick={() => {
              setCameraType("PerspectiveCamera", Object3D.DEFAULT_UP);
            }}
          >
            <i className={setClassName("box")}></i>
          </Button>
        </ButtonGroup>
      </div>
      <ModalTour />
    </div>
  );
}
export default memo(EditorViewer3d);
