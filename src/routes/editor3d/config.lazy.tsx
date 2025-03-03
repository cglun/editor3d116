import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ListGroup } from "react-bootstrap";
import { getCamera, getScene } from "../../three/init3dEditor";
import { ConfigCheck } from "../../component/common/ConfigCheck";
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import { cameraTween } from "../../three/animate";
export const Route = createLazyFileRoute("/editor3d/config")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ListGroup horizontal className="ms-2 mt-2">
      <ListGroup.Item>
        <ConfigCheck label="使用动画" configKey="useTween" />
      </ListGroup.Item>
      <ListGroup.Item>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            const { perspectiveCameraPosition } = getScene().userData;

            console.log(getScene());
            const c = getCamera();

            cameraTween(c, perspectiveCameraPosition).start();
            // console.log(getPerspectiveCamera());
          }}
        >
          场景
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            const cubeGeometry = new BoxGeometry(1, 1, 1);
            const cubeMaterial = new MeshLambertMaterial();
            const cube = new Mesh(cubeGeometry, cubeMaterial);
            cube.name = "cube1";
            // cube.castShadow = true; // 立方体投射阴影
            cube.position.set(0, 0.5, 0);
            cube.userData.isSelected = true;
            getScene().add(cube);

            const cubeGeometry2 = new BoxGeometry(1, 1, 1);
            const cubeMaterial2 = new MeshLambertMaterial();
            const cube2 = new Mesh(cubeGeometry2, cubeMaterial2);
            cube2.name = "cube1";
            // cube.castShadow = true; // 立方体投射阴影
            cube2.position.set(0, 0.5, 0);
            cube2.userData.isSelected = true;
            getScene().add(cube2);
          }}
        >
          移动
        </Button>
        <Button variant="outline-primary" size="sm">
          default
        </Button>
      </ListGroup.Item>
    </ListGroup>
  );
}
