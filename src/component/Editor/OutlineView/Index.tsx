import { Camera, Object3D, OrthographicCamera, PerspectiveCamera } from "three";
import {
  getCamera,
  getDivElement,
  getPerspectiveCamera,
  getScene,
  getTransfControls,
  setCamera,
  setSelectedObject,
  setTransformControls,
} from "../../../three/init3dEditor";

import { Accordion, Card, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import Property3d from "../Property3d/Index";
import TreeList from "../TreeList";
import { useUpdateScene } from "../../../app/hooks";
import { OutlineViewCamera } from "./OutlineViewCamera";
import { OutlineViewScene } from "./OutlineViewScene";
import { hideBoxHelper, raycasterSelect } from "../../../three/common3d";
import Icon from "../../common/Icon";
import { styleHeader } from "./fontColor";

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

    const divElement = getDivElement();
    const clickHandler = function (event: MouseEvent) {
      event.stopPropagation();
      event.preventDefault();
      const currentObject = raycasterSelect(event, camera, _scene, divElement);
      const selectedMesh: Object3D[] = [];
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
    };

    divElement.addEventListener("click", clickHandler);

    return () => {
      divElement.removeEventListener("click", clickHandler);
    };
  }, [updateScene]); // 添加 updateScene 到依赖数组

  function resetTextWarning(
    targetItem: Object3D,
    _children: Object3D[] = scene.payload.children
  ) {
    // 假设 getScene 返回的是一个包含所需属性的对象
    const scene = getScene();
    const camera = getCamera();
    if (
      !(
        camera instanceof PerspectiveCamera ||
        camera instanceof OrthographicCamera
      )
    ) {
      return;
    }
    if (
      !(
        targetItem instanceof PerspectiveCamera ||
        targetItem instanceof Object3D
      )
    ) {
      scene.userData.isSelected = false;
      camera.userData.isSelected = false;
      _setCamera(camera);
      setCamera(camera);
      updateScene(scene);
    }

    if (_children === undefined) {
      return;
    }
    return _children.map((item: Object3D) => {
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
    return children.map((item: Object3D) => {
      item.userData.show = show;

      if (item.children.length > 0) {
        setD2(item.children, false);
      }
      return item;
    });
  }

  const lightList: Object3D[] = [];
  const meshList: Object3D[] = [];
  const array = scene.payload.children;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if ("isLight" in element && element.isLight) {
      lightList.push(element);
    } else {
      meshList.push(element);
    }
  }

  const { selected3d } = scene.payload.userData;
  const gap = 1;

  return (
    <Accordion defaultActiveKey={["0", "1"]} alwaysOpen style={{}}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <Icon iconName="archive" gap={gap} />
          大纲
        </Accordion.Header>
        <Accordion.Body className="outline-view">
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="camera-reels" gap={gap} title="相机" />
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <OutlineViewCamera
                  object3D={_camera as Camera}
                  _setCamera={_setCamera}
                />
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="box2" gap={gap} title=" 场景" />
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <OutlineViewScene />
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="lightbulb" gap={gap} title="灯光" />
            </Card.Header>
            <Card.Body>
              <ListGroup className="da-gang">
                {lightList.length > 0 && (
                  <TreeList
                    resetTextWarning={resetTextWarning}
                    data={lightList}
                  />
                )}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="text-center" style={styleHeader}>
              <Icon iconName="box" gap={gap} title="模型" />
            </Card.Header>
            <Card.Body>
              <ListGroup className="da-gang">
                {meshList.length > 0 && (
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
