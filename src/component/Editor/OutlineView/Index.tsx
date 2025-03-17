import { Object3D, OrthographicCamera, PerspectiveCamera } from "three";
import {
  getCamera,
  getDivElement,
  getPerspectiveCamera,
  getScene,
  getTransfControls,
  raycasterSelect,
  setCamera,
  setSelectedObject,
  setTransformControls,
} from "../../../three/init3dEditor";
import { setClassName } from "../../../app/utils";
import { Accordion, Card, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import Property3d from "../Property3d/Index";
import TreeList from "../TreeList";
import { useUpdateScene } from "../../../app/hooks";
import { OutlineViewCamera } from "./OutlineViewCamera";
import { OutlineViewScene } from "./OutlineViewScene";
import { hideBoxHelper } from "../../../three/common3d";
export default function Index() {
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
    const divElement = getDivElement();
    divElement.addEventListener("click", function (event) {
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
      if (selectedMesh.length === 0) {
        hideBoxHelper(getScene());
        getTransfControls().detach();
        return;
      }

      setSelectedObject(selectedMesh[0]);
      updateScene(getScene());

      setTransformControls(selectedMesh[0]);
    });

    return () => {
      divElement.removeEventListener("click", () => {});
    };
  }, []);

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
              <ListGroup>
                <OutlineViewCamera
                  object3D={_camera}
                  resetTextWarning={resetTextWarning}
                  _setCamera={_setCamera}
                />
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center">
              <i className={setClassName("box2")}></i> 场景
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <OutlineViewScene />
              </ListGroup>
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
      {selected3d && <Property3d selected3d={selected3d} />}
    </Accordion>
  );
}
