import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "react-bootstrap/esm/Button";

import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Group,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
} from "three";
import { addLocalModel, getScene } from "../../three/init3dEditor";

import { useContext } from "react";

import { ButtonGroup, Card } from "react-bootstrap";
import { getThemeColor } from "../../app/config";
import { MyContext } from "../../app/MyContext";
import { setClassName } from "../../app/utils";

import _axios from "../../app/http";

export const Route = createLazyFileRoute("/editor3d/addMesh")({
  component: RouteComponent,
});

function RouteComponent() {
  const color = getThemeColor();

  const scene = getScene();
  const { dispatchScene } = useContext(MyContext);

  function addBox() {
    // 创建立方体
    const cubeGeometry = new BoxGeometry(1, 1, 1);
    const cubeMaterial = new MeshLambertMaterial();
    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.name = "cube1";
    // cube.castShadow = true; // 立方体投射阴影
    cube.position.set(0, 0.5, 0);
    cube.userData.isSelected = true;
    scene.add(cube);
    dispatchScene({
      type: "setScene",
      payload: scene,
    });
  }
  function addAmbientLight() {
    const light = new AmbientLight(0xffffff, 0.5);
    scene.add(light);
    light.userData.isSelected = true;
    dispatchScene({
      type: "setScene",
      payload: scene,
    });
  }
  function addPlane() {
    // 创建地面

    const planeGeometry = new PlaneGeometry(10, 10);
    const planeMaterial = new MeshLambertMaterial({ color: 0xdddddd });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true; // 地面接收阴影
    plane.castShadow = true;
    plane.rotation.x = -Math.PI / 2;
    plane.userData.isSelected = true;
    scene.add(plane);
    dispatchScene({
      type: "setScene",
      payload: scene,
    });
  }
  function addGroup() {
    const group = new Group();
    group.userData.isSelected = true;
    scene.add(group);
    dispatchScene({
      type: "setScene",
      payload: scene,
    });
  }
  function addDirectionalLight() {
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);
    directionalLight.userData.isSelected = true;
    directionalLight.position.set(3, 3, 3);
    directionalLight.lookAt(0, 0, 0);

    const helper = new DirectionalLightHelper(directionalLight, 1, 0xffff00);

    helper.userData = {
      isHelper: true,
    };

    helper.position.setFromMatrixPosition(directionalLight.matrixWorld);
    scene.add(helper);
    dispatchScene({
      type: "setScene",
      payload: scene,
    });
  }

  return (
    <div className="d-flex flex-wrap pt-2">
      <Card>
        <Card.Header>
          <i className={setClassName("box")}></i> 几何体
        </Card.Header>
        <Card.Body className="pt-1">
          <ButtonGroup>
            <Button
              variant={color}
              onClick={() => {
                addBox();
              }}
            >
              立方体
            </Button>
            <Button
              variant={color}
              onClick={() => {
                addPlane();
              }}
            >
              平面
            </Button>
            <Button
              variant={color}
              onClick={() => {
                addGroup();
              }}
            >
              组
            </Button>
            <Button
              variant={color}
              title="添加glb模型"
              onClick={() => {
                addLocalModel();
              }}
            >
              本地模型
            </Button>
          </ButtonGroup>
        </Card.Body>
      </Card>
      <Card className="ms-2">
        <Card.Header>
          <i className={setClassName("lightbulb")}></i> 灯光
        </Card.Header>
        <Card.Body className="pt-1">
          <ButtonGroup>
            <Button
              variant={color}
              title="可以投射阴影"
              onClick={() => {
                addDirectionalLight();
              }}
            >
              面光
            </Button>
            <Button
              variant={color}
              title="不能投射阴影"
              onClick={() => {
                addAmbientLight();
              }}
            >
              环境光
            </Button>
          </ButtonGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
