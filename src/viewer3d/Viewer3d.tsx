import React from "react";
import { useEffect, useRef, useState } from "react";
import { Container, ProgressBar } from "react-bootstrap";
import { APP_COLOR, EditorExportObject, GlbModel } from "../app/type";
import { getModelGroup, glbLoader, removeCanvasChild } from "../three/utils";
import { ItemInfo } from "../component/Editor/ListCard";
import Toast3d from "../component/common/Toast3d";
import { initEditorScene, initTourWindow, MyContext } from "../app/MyContext";
import ModalTour from "../component/common/ModalTour";
import { reducerScene, reducerTour } from "../app/reducer";
import initScene, {
  getCamera,
  getRenderer,
  getScene,
  getControls,
  setCamera,
  setScene,
  getLabelRenderer,
  getDivElement,
  getAll,
} from "../three/init3dViewer";
import {
  getProjectData,
  onWindowResize,
  sceneDeserialize,
  setLabel,
} from "../three/utils";
import { enableShadow, raycasterSelect } from "../three/common3d";
import { enableScreenshot, setEnableScreenshot } from "../three/config3d";
import { runScript } from "../three/scriptDev";
import { getActionList } from "./viewer3dUtils";
import { Object3D } from "three";

/**
 * 其他应用可以调用此组件，
 * @returns
 */

export default function Viewer3d({
  item,
  canvasStyle = { height: "100vh", width: "100vw" },
  callBack,
}: {
  item: ItemInfo;
  canvasStyle?: { height: string; width: string };
  callBack?: (item: EditorExportObject) => void;
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

  function exportObj(): EditorExportObject {
    return {
      scene: getScene(),
      camera: getCamera(),
      controls: getControls(),
      all: getAll(),
      getActionList,
    };
  }

  let modelNum = 0;
  function loadScene(item: ItemInfo) {
    getProjectData(item.id)
      .then((data: string) => {
        const { scene, camera, modelList } = sceneDeserialize(data, item);

        setScene(scene);
        setCamera(camera);
        setLabel(scene, dispatchTourWindow);
        modelNum = modelList.length;

        if (modelNum === 0) {
          runScript(); // 运行脚本
          if (callBack) {
            callBack(exportObj());
          }
        }

        modelList.forEach((item: GlbModel) => {
          loadModelByUrl(item);
        });
      })
      .catch((error) => {
        Toast3d(error, "提示", APP_COLOR.Danger);
      })
      .finally(() => {
        const { javascript } = getScene().userData;
        if (enableScreenshot.enable) {
          setEnableScreenshot(true);
        }
        if (javascript) {
          eval(javascript);
        }
      });
  }
  function loadMesh(item: ItemInfo) {
    getProjectData(item.id)
      .then((res: string) => {
        loadModelByUrl(JSON.parse(res));
      })
      .catch((error) => {
        Toast3d(error, "提示", APP_COLOR.Danger);
      });
  }

  // 定义 GlbModel 类型，确保 userData 包含 modelUrl 和 modelTotal 属性
  function loadModelByUrl(model: GlbModel) {
    const loader = glbLoader();
    let progress = 0;

    loader.load(
      model.userData.modelUrl,
      function (gltf) {
        setProgress(100);
        const group = getModelGroup(model, gltf, getScene());
        enableShadow(group, getScene());
        getScene().add(group);

        if (modelNum <= 1) {
          // 移除无实际作用的函数调用
          runScript();
          if (callBack) {
            callBack(exportObj());
          }
          const { javascript } = getScene().userData;
          if (javascript) {
            eval(javascript);
          }
        }
        modelNum--;
      },
      function (xhr) {
        // 确保 modelTotal 存在，避免类型错误
        progress = parseFloat(
          ((xhr.loaded / model.userData.modelTotal) * 100).toFixed(2)
        );

        setProgress(progress);
      },
      function (error) {
        Toast3d("加载失败:" + error, "error", APP_COLOR.Warning);
      }
    );
  }

  useEffect(() => {
    removeCanvasChild(canvas3d);
    if (canvas3d.current) {
      initScene(canvas3d.current);

      if (item.des === "Scene") {
        loadScene(item);
      } else {
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
