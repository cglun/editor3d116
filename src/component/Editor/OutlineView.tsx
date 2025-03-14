import { Object3D, OrthographicCamera, PerspectiveCamera } from "three";
import {
  getCamera,
  getDivElement,
  getPerspectiveCamera,
  getScene,
  raycasterSelect,
  setCamera,
  setScene,
  setSelectedObject,
  setTransformControls,
} from "../../three/init3dEditor";
import { setClassName } from "../../app/utils";

import { SPACE } from "../../app/config";
import { Accordion, Button, Card, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

import ObjectProperty from "./Property3d/Index";
import { getObjectNameByName } from "../../three/utils";
import TreeList from "./TreeList";

import { useUpdateScene } from "../../app/hooks";
import { APP_COLOR } from "../../app/type";
import Toast3d from "../common/Toast3d";
import { cameraTween } from "../../three/animate";

export default function OutlineView() {
  const [_camera, _setCamera] = useState<
    PerspectiveCamera | OrthographicCamera
  >();
  const { scene, updateScene } = useUpdateScene();
  useEffect(() => {
    const camera = getPerspectiveCamera();
    _setCamera(camera);

    const _scene = getScene();
    _scene.children = setD2(_scene.children);
    updateScene(getScene());
    getDivElement().addEventListener("click", function (event) {
      event.stopPropagation();
      event.preventDefault();
      const currentObject = raycasterSelect(event);

      const selectedMesh = [];
      for (let i = 0; i < currentObject.length; i++) {
        const { object } = currentObject[i];
        if (!object.userData.isHelper) {
          selectedMesh.push(object);
        }
      }

      setSelectedObject(selectedMesh[0]);
      updateScene(getScene());
      setTransformControls(selectedMesh);
    });

    return () => {
      getDivElement().removeEventListener("click", () => {});
    };
  }, []);

  function sceneDiv(object3D: Object3D | any) {
    return (
      object3D && (
        <ListGroup.Item
          as={"div"}
          className={`d-flex justify-content-between ${object3D.userData.isSelected ? "text-warning" : ""} `}
          onClick={() => {
            // const _object3D = { ...object3D };
            resetTextWarning(object3D);

            if (object3D.isScene || object3D.isCamera) {
              if (object3D.isScene) {
                object3D.userData.isSelected = !object3D.userData.isSelected;
                setScene(object3D);
                updateScene(object3D);
              }
              if (object3D.isCamera) {
                object3D.userData.isSelected = !object3D.userData.isSelected;
                _setCamera(object3D);
              }
            }
            // setCurObj3d(object3D);
            setSelectedObject(object3D);
            updateScene(getScene());
          }}
        >
          <div>
            {object3D.isCamera ? (
              <i className={setClassName("camera-reels")}></i>
            ) : (
              <i className={setClassName("box2")}></i>
            )}
            {SPACE + getObjectNameByName(object3D)}
            {object3D.isCamera && (
              <>
                <>
                  <Button
                    className="ms-2"
                    size="sm"
                    title="相机初始位置"
                    variant={APP_COLOR.Secondary}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const _scene = getScene();
                      _scene.userData.fiexedCameraPosition =
                        getPerspectiveCamera().position.clone();
                      Toast3d("初始位置已设置");
                    }}
                  >
                    固定
                  </Button>
                  <Button
                    className="ms-2"
                    size="sm"
                    title="到初始位置"
                    variant={APP_COLOR.Secondary}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const _scene = getScene();
                      const camera = getPerspectiveCamera();

                      const { fiexedCameraPosition } = _scene.userData;

                      cameraTween(camera, fiexedCameraPosition, 500).start();
                      // camera.position.set(x, y, z);
                    }}
                  >
                    初始
                  </Button>
                </>
              </>
            )}
          </div>
        </ListGroup.Item>
      )
    );
  }

  function resetTextWarning(
    targetItem: Object3D | any,
    _children = scene.payload.children
  ) {
    if (!targetItem.isCamera || !targetItem.isScene) {
      const scene = getScene();
      const camera = getCamera();
      scene.userData.isSelected = false;
      camera.userData.isSelected = false;
      _setCamera(camera);
      setCamera(camera);
      updateScene(scene);
    }

    if (_children === undefined) {
      return;
    }

    return _children.map((item: any) => {
      if (item.uuid === targetItem.uuid) {
        item.userData.isSelected = true;
      } else {
        item.userData.isSelected = false;
      }

      if (item.children.length > 0) {
        if (item.uuid === targetItem.uuid) {
          item.userData.isSelected = true;
        } else {
          item.userData.isSelected = false;
        }
        resetTextWarning(targetItem, item.children);
      }
      return item;
    });
  }

  function setD2(children: Object3D[], show = true) {
    return children.map((item) => {
      item.userData.show = show;

      if (item.children.length > 0) {
        setD2(item.children, false);
      }
      return item;
    });
  }
  const lightList = [];
  const meshList = [];
  const array = scene.payload.children;
  for (let index = 0; index < array.length; index++) {
    const element = array[index] as any;
    if (element.isLight) {
      lightList.push(element);
    } else {
      meshList.push(element);
    }
  }

  const { selected3d } = scene.payload.userData;

  return (
    <Accordion defaultActiveKey={["0", "1"]} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <i className={setClassName("archive")}></i>
          <span className="px-2">大纲视图</span>
        </Accordion.Header>
        <Accordion.Body className="outline-view">
          <Card>
            <Card.Header className="text-center">
              <i className={setClassName("camera-reels")}></i> 相机
            </Card.Header>
            <Card.Body>
              <ListGroup> {sceneDiv(_camera)}</ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center">
              <i className={setClassName("box2")}></i> 场景
            </Card.Header>
            <Card.Body>
              <ListGroup>{sceneDiv(getScene())}</ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center">
              <i className={setClassName("lightbulb")}></i> 灯光
            </Card.Header>
            <Card.Body>
              <ListGroup className="da-gang">
                {lightList && (
                  <TreeList
                    resetTextWarning={resetTextWarning}
                    data={lightList}
                  />
                )}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center">
              <i className={setClassName("box")}></i> 模型
            </Card.Header>
            <Card.Body>
              <ListGroup className="da-gang">
                {meshList && (
                  <TreeList
                    resetTextWarning={resetTextWarning}
                    data={meshList}
                  />
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Accordion.Body>
      </Accordion.Item>
      {selected3d && <ObjectProperty selected3d={selected3d} />}
    </Accordion>
  );
}
