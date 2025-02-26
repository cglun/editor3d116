import { createLazyFileRoute } from "@tanstack/react-router";

import { Button, ListGroup } from "react-bootstrap";

import { getScene } from "../../three/init3dEditor";
import { ConfigCheck } from "../../component/common/ConfigCheck";

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
      </ListGroup.Item>
    </ListGroup>
  );
}
