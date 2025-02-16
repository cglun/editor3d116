import { useEffect, useRef, useState } from "react";

import createScene, {
  getCamera,
  getRenderer,
  getScene,
  setCamera,
  setScene,
} from "../three/init3dViewer";
import { onWindowResize } from "../three/utils";

import { APP_COLOR, GlbModel, UserDataType } from "../app/type";
import { Group, Scene } from "three";
import { glbLoader } from "../three/init3dEditor";
import _axios from "../app/http";
import { strToJson } from "../app/utils";
import { ItemInfo } from "../component/Editor/ListCard";
import { ProgressBar } from "react-bootstrap";
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
  const [progress, setProgress] = useState(30);

  function loadScene() {
    const { id, des, name } = item;
    if (des === "Scene") {
      const newScene = new Scene();
      _axios.get(`/project/getProjectData/${id}`).then((res) => {
        if (res.data.data) {
          const data = res.data.data;
          const { scene, camera, models, loader } = strToJson(data);

          loader.parse(scene, function (object: Scene | any) {
            const { children, fog, background } = object;
            newScene.children = children;
            newScene.fog = fog;
            newScene.background = background;
            newScene.userData = {
              projectName: name,
              projectId: id,
              canSave: true,
            };

            setScene(newScene);
          });

          loader.parse(camera, function (object) {
            setCamera(object);
          });

          models.forEach((item: GlbModel) => {
            loadModelByUrl(item);
          });
        }
      });
    }
    if (des === "Mesh") {
      _axios.get(`/project/getProjectData/${id}`).then((res) => {
        if (res.data.data) {
          const data = res.data.data;
          const _data = JSON.parse(data);

          loadModelByUrl(_data);
        }
      });
    }
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
    // init3d(canvas3d);
    if (canvas3d.current) {
      createScene(canvas3d.current);
      loadScene();
    }

    window.addEventListener("resize", () =>
      onWindowResize(canvas3d, getCamera(), getRenderer())
    );
    return () => {
      setScene(new Scene());
      console.log("销毁大场景");

      window.removeEventListener("resize", () =>
        onWindowResize(canvas3d, getCamera(), getRenderer())
      );
    };
  }, []);

  return (
    <>
      <div className="mb-1" style={{ width: "300px" }}>
        <ProgressBar now={progress} label={`${progress}%`} />
      </div>
      <div style={canvasStyle} ref={canvas3d}></div>
    </>
  );
}
