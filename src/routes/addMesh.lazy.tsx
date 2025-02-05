import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "react-bootstrap/esm/Button";
import { getThemeColor } from "../app/config";

import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
} from "three";
import { addGlb, getScene, takeScreenshot } from "../three/init3d116";

import { useContext, useState } from "react";
import { MyContext } from "../app/MyContext";
import { ButtonGroup, Card, Image } from "react-bootstrap";
import { setClassName } from "../app/utils";

export const Route = createLazyFileRoute("/addMesh")({
  component: RouteComponent,
});

function RouteComponent() {
  const color = getThemeColor();

  const scene = getScene();
  const { dispatchScene } = useContext(MyContext);
  function setSelected(object3D: Object3D) {
    object3D.userData.isSelected = true;
  }
  function addBox() {
    // 创建立方体
    const cubeGeometry = new BoxGeometry(1, 1, 1);
    const cubeMaterial = new MeshLambertMaterial();
    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.name = "cube1";
    // cube.castShadow = true; // 立方体投射阴影
    cube.position.set(0, 0.5, 0);
    setSelected(cube);
    scene.add(cube);
    dispatchScene({
      type: "setScene",
      payload: scene,
    });
  }
  function addAmbientLight() {
    const light = new AmbientLight(0xffffff, 0.5);
    scene.add(light);

    setSelected(light);
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
    setSelected(plane);
    scene.add(plane);
    dispatchScene({
      type: "setScene",
      payload: scene,
    });
  }
  function addGroup() {
    const group = new Group();
    setSelected(group);
    scene.add(group);
    dispatchScene({
      type: "setScene",
      payload: scene,
    });
  }
  function addDirectionalLight() {
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);
    setSelected(directionalLight);
    directionalLight.position.set(3, 3, 3);
    directionalLight.lookAt(0, 0, 0);

    dispatchScene({
      type: "setScene",
      payload: scene,
    });
  }
  const [xx, setXx] = useState("");
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
            <Button
              variant={color}
              title="添加glb模型"
              onClick={() => {
                addGlb(
                  dispatchScene({
                    type: "setScene",
                    payload: getScene(),
                  })
                );
              }}
            >
              glb模型
            </Button>
            <Button
              variant={color}
              title="序列化"
              onClick={() => {
                // const str = sceneSerialization(getScene(), getCamera());
                // console.log(str);
              }}
            >
              序列化
            </Button>
            <Button
              variant={color}
              onClick={() => {
                fetch("/api");
              }}
            >
              测试
            </Button>

            <Button
              variant={color}
              onClick={() => {
                const xx = takeScreenshot();
                setXx(xx);
              }}
            >
              截图
            </Button>
            <Image src={xx}></Image>
          </ButtonGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
