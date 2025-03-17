import { useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "react-bootstrap/esm/Button";
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLightHelper,
  Group,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
} from "three";
import { getScene } from "../../three/init3dEditor";
import { ButtonGroup, Card, Container } from "react-bootstrap";

import { MyContext } from "../../app/MyContext";
import { getThemeByScene, setClassName } from "../../app/utils";
import _axios from "../../app/http";
import { useUpdateScene } from "../../app/hooks";
import { enableShadow } from "../../three/common3d";
import { glbLoader } from "../../three/utils";
import {
  createDirectionalLight,
  createGridHelper,
} from "../../three/factory3d";

export const Route = createLazyFileRoute("/editor3d/addMesh")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { color } = getTheme();

  const _scene = getScene();
  const { dispatchScene } = useContext(MyContext);
  const { scene, updateScene } = useUpdateScene();
  let { themeColor } = getThemeByScene(scene);

  function addBox() {
    // 创建立方体
    const cubeGeometry = new BoxGeometry(1, 1, 1);
    const cubeMaterial = new MeshLambertMaterial();
    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.name = "cube1";
    // cube.castShadow = true; // 立方体投射阴影
    cube.position.set(0, 0.5, 0);
    cube.userData.isSelected = true;
    const { useShadow } = getScene().userData.config3d;
    cube.castShadow = useShadow;
    cube.receiveShadow = useShadow;
    _scene.add(cube);
    updateScene(_scene);
  }
  function addAmbientLight() {
    const light = new AmbientLight(0xffffff, 0.5);
    _scene.add(light);
    light.userData.isSelected = true;
    updateScene(_scene);
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
    const { useShadow } = getScene().userData.config3d;
    plane.receiveShadow = useShadow;
    plane.castShadow = useShadow;
    _scene.add(plane);
    dispatchScene({
      type: "setScene",
      payload: _scene,
    });
  }
  function addGroup() {
    const group = new Group();
    group.userData.isSelected = true;
    _scene.add(group);
    updateScene(_scene);
  }
  function addDirectionalLight() {
    const directionalLight = createDirectionalLight();
    _scene.add(directionalLight);
    const helper = new DirectionalLightHelper(directionalLight, 1, 0xffff00);
    helper.userData.isHelper = true;
    helper.position.setFromMatrixPosition(directionalLight.matrixWorld);
    const { useShadow } = getScene().userData.config3d;
    directionalLight.castShadow = useShadow;
    _scene.add(helper);
    updateScene(_scene);
  }
  function addLocalModel() {
    const url = "/editor3d/static/models/blender.glb";
    const loader = glbLoader();
    loader.load(url, function (gltf) {
      _scene.children = gltf.scene.children;
      _scene.add(createDirectionalLight());
      _scene.add(createGridHelper());
      enableShadow(_scene);
      updateScene(getScene());
    });
  }

  return (
    <Container fluid className="d-flex flex-wrap pt-2">
      <Card>
        <Card.Header>
          <i className={setClassName("box")}></i> 几何体
        </Card.Header>
        <Card.Body className="pt-1">
          <ButtonGroup>
            <Button
              variant={themeColor}
              onClick={() => {
                addBox();
              }}
            >
              立方体
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                addPlane();
              }}
            >
              平面
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                addGroup();
              }}
            >
              组
            </Button>

            <Button
              variant={themeColor}
              title="添加glb模型"
              onClick={() => {
                addLocalModel();
              }}
            >
              猴头
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
              variant={themeColor}
              title="可以投射阴影"
              onClick={() => {
                addDirectionalLight();
              }}
            >
              面光
            </Button>
            <Button
              variant={themeColor}
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
    </Container>
  );
}
