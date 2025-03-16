import { createLazyFileRoute } from "@tanstack/react-router";
import { ListGroup } from "react-bootstrap";
import { getScene } from "../../three/init3dEditor";
import { ConfigCheck } from "../../component/common/ConfigCheck";
import { enableShadow } from "../../three/common3d";

export const Route = createLazyFileRoute("/editor3d/config")({
  component: RouteComponent,
});

function RouteComponent() {
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
    </ListGroup>
  );
}
