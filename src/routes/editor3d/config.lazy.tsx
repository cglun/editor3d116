import { createLazyFileRoute } from "@tanstack/react-router";

import { Button, ListGroup } from "react-bootstrap";

import { getScene } from "../../three/init3dEditor";
import { ConfigCheck } from "../../component/common/ConfigCheck";
import { BoxGeometry, Mesh, MeshLambertMaterial, Vector3 } from "three";
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
            console.log(getScene());
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
            cameraTween(cube, new Vector3(10, 10, 10))
              .start()
              .onComplete(() => {
                console.log("动画完成");
                cubeGeometry.dispose();
                cubeMaterial.dispose();
                cube.removeFromParent();
              });
          }}
        >
          移动
        </Button>
      </ListGroup.Item>
    </ListGroup>
  );
}
