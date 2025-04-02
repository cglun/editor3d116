import React, { memo, useContext, useEffect, useRef } from "react";
import initScene, {
  getPerspectiveCamera,
  getLabelRenderer,
  getRenderer,
  getScene,
  getTransfControls,
  setCameraType,
  getCamera,
  getControls,
  getAll,
  setScene,
  setCamera,
} from "../../three/init3dEditor"; // 初始化
import { Button, ButtonGroup, Container, ProgressBar } from "react-bootstrap";

import { TransformControlsMode } from "three/examples/jsm/Addons.js";
import { Object3D, Vector3 } from "three";
import { getThemeByScene, setClassName } from "../../app/utils";
import {
  createGroupIfNotExist,
  finishLoadExecute,
  getProjectData,
  loadModelByUrl,
  onWindowResize,
  removeCanvasChild,
  sceneDeserialize,
  setLabel,
} from "../../three/utils";
import { useUpdateScene } from "../../app/hooks";
import ModalTour from "../common/ModalTour";
import {
  createDirectionalLight,
  createGridHelper,
} from "../../three/factory3d";

import { MyContext } from "../../app/MyContext";
import { APP_COLOR, Context116, GlbModel, RecordItem } from "../../app/type";
import { getActionList } from "../../viewer3d/viewer3dUtils";
import ModalConfirm3d from "../common/ModalConfirm3d";
import Toast3d from "../common/Toast3d";

function EditorViewer3d() {
  const editorCanvas: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);

  useEffect(() => {
    removeCanvasChild(editorCanvas);

    newScene();
    const SCENE_PROJECT = localStorage.getItem("SCENE_PROJECT");
    if (SCENE_PROJECT) {
      loadScene({
        id: parseInt(SCENE_PROJECT),
        name: "",
        des: "",
        cover: "",
      }); // 加载场景
    }

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
    // 添加 updateScene 到依赖项数组
  }, [editorCanvas.current]);
  function newScene() {
    if (editorCanvas.current) {
      initScene(editorCanvas.current);
      const scene = getScene();
      const HELPER_GROUP = createGroupIfNotExist(scene, "HELPER_GROUP");
      const { useShadow } = getScene().userData.config3d;
      const light = createDirectionalLight();
      light.castShadow = useShadow;

      scene.add(light);
      HELPER_GROUP?.add(createGridHelper());
      if (HELPER_GROUP) {
        scene.add(HELPER_GROUP);
      }
      // 调用 updateScene 函数更新场景
      updateScene(getScene().clone());
    }
  }
  const { dispatchTourWindow } = useContext(MyContext);
  let modelNum = 0;
  const context: Context116 = {
    getScene,
    getCamera,
    getControls,
    getActionList,
    getAll,
  };
  function loadScene(item: RecordItem) {
    getProjectData(item.id)
      .then((data) => {
        const { scene, camera, modelList } = sceneDeserialize(data, item);
        const HELPER_GROUP = createGroupIfNotExist(scene, "HELPER_GROUP");
        HELPER_GROUP?.add(createGridHelper());
        if (HELPER_GROUP) {
          scene.add(HELPER_GROUP);
        }
        setScene(scene);
        setCamera(camera);
        // 加载完成后，设置标签
        setLabel(scene, dispatchTourWindow);
        modelNum = modelList.length;
        if (modelNum === 0) {
          finishLoadExecute(context);
          updateScene(getScene());
        }
        modelList.forEach((model: GlbModel) => {
          loadModelByUrl(
            model,
            scene,
            (_progress: number) => {
              ModalConfirm3d({
                title: "提示",
                body: <ProgressBar now={_progress} label={`${_progress}%`} />,
                confirmButton: {
                  show: true,
                  closeButton: false,
                  hasButton: false,
                },
              });

              if (modelNum <= 1) {
                ModalConfirm3d({
                  title: "提示",
                  body: "加载完成",
                  confirmButton: {
                    show: false,
                  },
                });
                updateScene(getScene());
                finishLoadExecute(context);
              }

              if (_progress >= 100) {
                modelNum--; // 确保在回调中更新 modelNum。如果不更新，可能会导致 modelNum 不正确。
              }
            },

            (error: unknown) => {
              ModalConfirm3d({
                title: "提示",
                body: "加载失败" + error,
                confirmButton: {
                  show: true,
                },
              });
            }
          );
        });
      })
      .catch((error) => {
        Toast3d(error, "提示", APP_COLOR.Danger);
      });
  }

  function setMode(modeName: TransformControlsMode) {
    const transfControls = getTransfControls();
    transfControls.setMode(modeName);
  }

  return (
    <Container fluid>
      <ButtonGroup
        className="sticky-top"
        style={{ left: "1rem", top: "2.4rem" }}
      >
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

      <Container
        fluid
        id="editor-canvas"
        className="position-relative"
        style={{ height: "70vh", marginTop: "-2.4rem" }}
        ref={editorCanvas}
      ></Container>
      <ModalTour />
    </Container>
  );
}
export default memo(EditorViewer3d);
