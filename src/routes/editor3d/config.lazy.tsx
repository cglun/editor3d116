import { createLazyFileRoute } from "@tanstack/react-router";
import { ListGroup } from "react-bootstrap";
import { getScene } from "../../three/init3dEditor";
import { ConfigCheck } from "../../component/common/ConfigCheck";
import { Light, Mesh, Scene } from "three";

export const Route = createLazyFileRoute("/editor3d/config")({
  component: RouteComponent,
});

function RouteComponent() {
  const child = getScene().children.length;
  const disabled = child > 1 ? false : true;
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
        <ConfigCheck
          label="使用动画"
          configKey="useTween"
          disabled={disabled}
        />
      </ListGroup.Item>
      <ListGroup.Item>
        <ConfigCheck
          label="投射阴影"
          disabled={disabled}
          configKey="useShadow"
          callBack={() => enableShadow(getScene())}
        />
      </ListGroup.Item>
    </ListGroup>
  );
}
