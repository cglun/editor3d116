import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ListGroup } from "react-bootstrap";
import { getCamera, getScene } from "../../three/init3dEditor";
import { ConfigCheck } from "../../component/common/ConfigCheck";
import { BoxGeometry, Light, Mesh, MeshLambertMaterial, Scene } from "three";
import { cameraTween } from "../../three/animate";
import { showModelByName, getCamera as cc } from "../../three/init3dViewer";

export const Route = createLazyFileRoute("/editor3d/config")({
  component: RouteComponent,
});

function RouteComponent() {
  function enableShadow(scene: Scene) {
    const { useShadow } = scene.userData.config3d;
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = useShadow;
        child.receiveShadow = useShadow;
      }
      if (child instanceof Light) {
        child.castShadow = useShadow;
      }
    });
  }

  return (
    <ListGroup horizontal className="mt-2">
      <ListGroup.Item>
        <ConfigCheck label="使用动画" configKey="useTween" />
      </ListGroup.Item>
      <ListGroup.Item>
        <ConfigCheck
          label="投射阴影"
          configKey="useShadow"
          callBack={() => enableShadow(getScene())}
        />
      </ListGroup.Item>
      <ListGroup.Item>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            const { perspectiveCameraPosition } = getScene().userData;
            const c = getCamera();
            cameraTween(c, perspectiveCameraPosition).start();
            console.log(getScene().userData);
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
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            const S = getScene();
            showModelByName(S, "MODEl_GROUP", false);
            // showModelByName(S, "A", true);
          }}
        >
          default
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            const S = getScene();
            // showModelByName(S, "MODEl_GROUP", false);
            showModelByName(S, "A", true);
            // const m = S.getObjectByName("A")?.parent;
            const m = S.getObjectByName("MODEl_GROUP");
            if (m) {
              m.visible = true;
            }
          }}
        >
          SHOW
        </Button>

        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            console.log(cc());
          }}
        >
          SHOW
        </Button>
      </ListGroup.Item>
    </ListGroup>
  );
}
