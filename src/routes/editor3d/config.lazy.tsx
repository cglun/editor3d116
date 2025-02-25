import { createLazyFileRoute } from "@tanstack/react-router";

import { Button, ListGroup } from "react-bootstrap";

import { getScene } from "../../three/init3dEditor";

export const Route = createLazyFileRoute("/editor3d/config")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ListGroup horizontal className="ms-2 mt-2">
      <ListGroup.Item>
        <Button
          onClick={() => {
            console.log(getScene());
          }}
        >
          场景
        </Button>
      </ListGroup.Item>
      <ListGroup.Item></ListGroup.Item>
    </ListGroup>
  );
}
