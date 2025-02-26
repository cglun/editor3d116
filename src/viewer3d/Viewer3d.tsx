import { useEffect, useRef, useState } from "react";

import createScene, {
  getCamera,
  getRenderer,
  getScene,
  setCamera,
  setScene,
  getLabelRenderer,
} from "../three/init3dViewer";
import {
  getProjectData,
  onWindowResize,
  sceneDeserialize,
  setLabel,
} from "../three/utils";
import { APP_COLOR, GlbModel, UserDataType } from "../app/type";
import { Group } from "three";
import { glbLoader } from "../three/utils";
import _axios from "../app/http";
import { ItemInfo } from "../component/Editor/ListCard";
import { Container, ProgressBar } from "react-bootstrap";
import Toast3d from "../component/common/Toast3d";

/**
 * 其他应用可以调用此组件，
 * @returns
 */

export default function Viewer3d({
  item,
  canvasStyle = { height: "100vh", width: "100vw" },
}: {
  item: ItemInfo;
  canvasStyle?: { height: string; width: string };
}) {
  const canvas3d: React.RefObject<HTMLDivElement> = useRef<
    HTMLDivElement | any
  >();
  const [progress, setProgress] = useState(0);

  function loadScene(item: ItemInfo) {
    getProjectData(item.id)
      .then((data: any) => {
        const { scene, camera, modelList } = sceneDeserialize(data, item);
        setScene(scene);
        setCamera(camera);
        setLabel(scene);
        modelList.forEach((item: GlbModel) => {
          loadModelByUrl(item);
        });
      })
      .catch((error) => {
        Toast3d(error, "提示", APP_COLOR.Danger);
      });
  }
  function loadMesh(item: ItemInfo) {
    getProjectData(item.id)
      .then((res: any) => {
        loadModelByUrl(JSON.parse(res));
      })
      .catch((error) => {
        Toast3d(error, "提示", APP_COLOR.Danger);
      });
  }

  function loadModelByUrl(model: GlbModel) {
    const loader = glbLoader();
    let progress = 0;
    loader.load(
      model.userData.modelUrl,
      function (gltf) {
        setProgress(100);

        const { position, rotation, scale } = model;

        const group = new Group();
        group.name = model.name;
        group.add(...gltf.scene.children);
        group.userData = {
          ...model.userData,
          type: UserDataType.GlbModel,
        };
        group.position.set(position.x, position.y, position.z);

        group.position.set(position.x, position.y, position.z);

        // group.rotation.set(rotation._x, rotation._y, rotation._z, "XYZ");
        group.setRotationFromEuler(rotation);
        group.scale.set(scale.x, scale.y, scale.z);

        getScene().add(group);

        //  gltfToScene(group);
      },
      function (xhr) {
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
    if (canvas3d.current) {
      createScene(canvas3d.current);
      item.des === "Scene" ? loadScene(item) : loadMesh(item);
    }

    window.addEventListener("resize", () =>
      onWindowResize(canvas3d, getCamera(), getRenderer(), getLabelRenderer())
    );
    return () => {
      // getDivElement()?.removeChild(getRenderer().domElement);
      canvas3d.current?.children[0].remove();
      window.removeEventListener("resize", () =>
        onWindowResize(canvas3d, getCamera(), getRenderer(), getLabelRenderer())
      );
    };
  }, [item.id]);

  return (
    <Container fluid>
      <div className="mb-1 mx-auto" style={{ width: "300px" }}>
        {progress < 100 && (
          <ProgressBar now={progress} label={`${progress}%`} />
        )}
      </div>
      <div className="mx-auto" style={canvasStyle} ref={canvas3d}></div>
    </Container>
  );
}
