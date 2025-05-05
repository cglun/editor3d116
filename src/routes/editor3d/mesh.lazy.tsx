import { useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "react-bootstrap/esm/Button";
import {
  AmbientLight,
  BoxGeometry,
  Group,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
} from "three";
import { getScene } from "../../three/init3dEditor";
import { ButtonGroup, Card, Container } from "react-bootstrap";
import { MyContext } from "../../app/MyContext";
import { getThemeByScene, setClassName } from "../../app/utils";

import { useUpdateScene } from "../../app/hooks";
import {
  createDirectionalLight,
  createGridHelper,
} from "../../three/factory3d";
import { enableShadow } from "../../three/common3d";
import { glbLoader } from "../../three/utils";

export const Route = createLazyFileRoute("/editor3d/mesh")({
  component: RouteComponent,
});

function RouteComponent() {
  const _scene = getScene();
  const { dispatchScene } = useContext(MyContext);
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);

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
  function addLocalModel() {
    const blender = new URL(
      `/public/static/file3d/models/blender.glb`,
      import.meta.url
    ).href;

    const loader = glbLoader();
    loader.load(blender, function (gltf) {
      const _scene = getScene();
      const group = new Group();
      group.name = "猴子";
      group.add(...gltf.scene.children);
      _scene.add(group);

      // const helper = createDirectionalLightHelper(light);
      // _scene.add(helper);
      _scene.add(createGridHelper());
      enableShadow(_scene, getScene());
      updateScene(getScene());
    });
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
    const { useShadow } = getScene().userData.config3d;
    const light = createDirectionalLight();
    light.castShadow = useShadow;
    _scene.add(light);
    // const helper = new DirectionalLightHelper(directionalLight, 1, 0xffff00);
    // helper.userData.isHelper = true;
    // //helper.position.copy(directionalLight.position);

    // helper.position.setFromMatrixPosition(directionalLight.matrixWorld);

    // const HELPER_GROUP = createGroupIfNotExist(_scene, "HELPER_GROUP");
    // HELPER_GROUP?.add(helper);
    // HELPER_GROUP && _scene.add(HELPER_GROUP);
    // const helper = createDirectionalLightHelper(directionalLight);
    // _scene.add(helper);
    updateScene(_scene);
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
