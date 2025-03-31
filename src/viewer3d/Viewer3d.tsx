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
}: {
  item: RecordItem;
  canvasStyle?: { height: string; width: string };
  callBack?: (item: Context116) => void;
  callBackError?: (error: unknown) => void;
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
    if (item.des !== "Scene") {
      return;
    }
    const context: Context116 = {
      getScene,
      getCamera,
      getControls,
      getActionList,
      getAll,
    };
    getProjectData(item.id)
      .then((data: string) => {
        const { scene, camera, modelList } = sceneDeserialize(data, item);

        setScene(scene);
        setCamera(camera);
        setLabel(scene, dispatchTourWindow);
        modelNum = modelList.length;

        if (modelNum === 0) {
          // 运行调试脚本
          finishLoadExecute(context, callBack);
        }

        modelList.forEach((model: GlbModel) => {
          loadModelByUrl(
            model,
            scene,
            (_progress: number) => {
              setProgress(_progress);

              if (modelNum <= 1) {
                console.log("加载完成");
                finishLoadExecute(context, callBack);
              }

              if (_progress >= 100) {
                modelNum--; // 确保在回调中更新 modelNum。如果不更新，可能会导致 modelNum 不正确。
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

  // 定义 GlbModel 类型，确保 userData 包含 modelUrl 和 modelTotal 属性
  // function loadModelByUrl1(model: GlbModel) {
  //   const loader = glbLoader();
  //   let progress = 0;

  //   loader.load(
  //     model.userData.modelUrl,
  //     function (gltf) {
  //       setProgress(100);
  //       const group = getModelGroup(model, gltf, getScene());
  //       enableShadow(group, getScene());
  //       getScene().add(group);

  //       if (modelNum <= 1) {
  //         // 移除无实际作用的函数调用
  //         const context: Context116 = {
  //           getScene,
  //           getCamera,
  //           getControls,
  //           getActionList,
  //           getAll,
  //         };
  //         finishLoadExecute(context);
  //         if (callBack) {
  //           callBack(context);
  //         }
  //       }
  //       modelNum--;
  //     },
  //     function (xhr) {
  //       // 确保 modelTotal 存在，避免类型错误
  //       progress = parseFloat(
  //         ((xhr.loaded / model.userData.modelTotal) * 100).toFixed(2)
  //       );

  //       setProgress(progress);
  //     },
  //     function (error) {
  //       Toast3d("加载失败:" + error, "error", APP_COLOR.Warning);
  //     }
  //   );
  // }

  useEffect(() => {
    removeCanvasChild(canvas3d);
    if (canvas3d.current) {
      initScene(canvas3d.current);
      loadScene(item);
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
  }, [item]); // 完善 useEffect 依赖项

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
    // console.log(currentObject[0].object);

    // if (currentObject.length > 0) {
    //   setBoxHelper(currentObject[0].object, getScene());
    // } else {
    //   hideBoxHelper(getScene());
    // }
  }

  return (
    <MyContext.Provider
      value={{ scene, dispatchScene, tourWindow, dispatchTourWindow }}
    >
      <Container fluid>
        <div className="mb-1 mx-auto" style={{ width: "300px" }}>
          {progress < 100 && (
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
