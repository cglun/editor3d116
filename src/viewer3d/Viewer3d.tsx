import React from "react";
import { useEffect, useRef, useState } from "react";
import { Container, ProgressBar } from "react-bootstrap";
import { APP_COLOR, Context116, GlbModel, RecordItem } from "../app/type";
import { Object3D } from "three";
import {
  finishLoadExecute,
  loadModelByUrl,
  removeCanvasChild,
} from "../three/utils";

import Toast3d from "../component/common/Toast3d";
import { initEditorScene, initTourWindow, MyContext } from "../app/MyContext";
import ModalTour from "../component/common/ModalTour";
import { reducerScene, reducerTour } from "../app/reducer";
import initScene, {
  getCamera,
  getRenderer,
  getScene,
  setCamera,
  setScene,
  getLabelRenderer,
  getDivElement,
  getControls,
  getAll,
} from "../three/init3dViewer";
import {
  getProjectData,
  onWindowResize,
  sceneDeserialize,
  setLabel,
} from "../three/utils";
import { raycasterSelect } from "../three/common3d";
import { getActionList } from "./viewer3dUtils";

/**
 * 其他应用可以调用此组件，
 * @returns
 */

export default function Viewer3d({
  item,
  canvasStyle = { height: "100vh", width: "100vw" },
  callBack,
  callBackError,
  getProgress,
}: {
  item: RecordItem;
  canvasStyle?: { height: string; width: string };
  callBack?: (item: Context116) => void;
  callBackError?: (error: unknown) => void;
  getProgress?: (progress: number) => void;
}) {
  // 修改为明确指定 HTMLDivElement 类型
  const canvas3d: React.RefObject<HTMLDivElement> = useRef(null);

  const [progress, setProgress] = useState(0);
  const [scene, dispatchScene] = React.useReducer(
    reducerScene,
    initEditorScene
  );
  const [tourWindow, dispatchTourWindow] = React.useReducer(
    reducerTour,
    initTourWindow
  );

  let modelNum = 0;
  function loadScene(item: RecordItem) {
    const context: Context116 = {
      getScene,
      getCamera,
      getControls,
      getActionList,
      getAll,
    };
    getProjectData(item.id)
      .then((data: string) => {
        setProgress(0);
        if (getProgress) {
          getProgress(0);
        }
        const { scene, camera, modelList } = sceneDeserialize(data, item);
        setScene(scene);
        setCamera(camera);
        setLabel(scene, dispatchTourWindow);
        modelNum = modelList.length;

        if (modelNum === 0) {
          if (getProgress) {
            getProgress(100);
          }
          setProgress(100);
          // 运行调试脚本
          finishLoadExecute(context, callBack);
        }

        modelList.forEach((model: GlbModel) => {
          loadModelByUrl(
            model,
            scene,
            (_progress: number) => {
              setProgress(_progress);
              if (getProgress) {
                getProgress(_progress);
              }
              if (_progress >= 100) {
                //setProgress(100);
                modelNum--; // 确保在回调中更新 modelNum。如果不更新，可能会导致 modelNum 不正确。
                if (modelList.length === 1) {
                  finishLoadExecute(context, callBack);
                }
                if (modelList.length > 1 && modelNum <= 1) {
                  finishLoadExecute(context, callBack);
                }
              }
            },

            (error: unknown) => {
              if (callBackError) {
                callBackError({ error, item });
              }
              Toast3d("加载失败:" + error, "error", APP_COLOR.Danger);
              console.log("加载失败", error, item);
            }
          );
        });
      })
      .catch((error: unknown) => {
        if (callBackError) {
          callBackError({ error, item });
        }
        Toast3d("加载失败:" + error, "error", APP_COLOR.Danger);
        console.log("加载失败", error, item);
      });
  }

  function loadMesh(item: RecordItem) {
    getProjectData(item.id)
      .then((res: string) => {
        loadModelByUrl(
          JSON.parse(res),
          getScene(),
          (_progress: number) => {
            setProgress(_progress);
          },

          (error: unknown) => {
            console.log(error);
          }
        );
      })
      .catch((error) => {
        console.log(error);
        Toast3d(error, "提示", APP_COLOR.Danger);
      });
  }

  useEffect(() => {
    removeCanvasChild(canvas3d);
    if (canvas3d.current) {
      initScene(canvas3d.current);

      if (item.des === "Scene") {
        loadScene(item);
      }
      if (item.des === "Mesh") {
        loadMesh(item);
      }
      const divElement = getDivElement();
      divElement.addEventListener("click", clickHandler);
    }

    window.addEventListener("resize", () =>
      onWindowResize(canvas3d, getCamera(), getRenderer(), getLabelRenderer())
    );
    return () => {
      window.removeEventListener("resize", () =>
        onWindowResize(canvas3d, getCamera(), getRenderer(), getLabelRenderer())
      );
      const divElement = getDivElement();
      divElement.removeEventListener("click", clickHandler);
      removeCanvasChild(canvas3d);
    };
  }, [item]);

  function clickHandler(event: MouseEvent) {
    const divElement = getDivElement();
    const currentObject = raycasterSelect(
      event,
      getCamera(),
      getScene(),
      divElement
    );
    const selectedMesh: Object3D[] = [];
    for (let i = 0; i < currentObject.length; i++) {
      const { object } = currentObject[i];
      if (!object.userData.isHelper) {
        selectedMesh.push(object);
      }
    }
    if (selectedMesh.length > 0) {
      console.log(selectedMesh);
    }
  }

  return (
    <MyContext.Provider
      value={{ scene, dispatchScene, tourWindow, dispatchTourWindow }}
    >
      <Container fluid>
        <div className="mb-1 mx-auto" style={{ width: "300px" }}>
          {progress < 100 && !getProgress && (
            <ProgressBar now={progress} label={`${progress}%`} />
          )}
        </div>
        <div
          className="mx-auto position-relative"
          style={canvasStyle}
          ref={canvas3d}
        ></div>
        <ModalTour />
      </Container>
    </MyContext.Provider>
  );
}
