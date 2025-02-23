import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import Form from "react-bootstrap/esm/Form";
import { config3d } from "../../three/utils";

export const Route = createLazyFileRoute("/editor3d/config")({
  component: RouteComponent,
});

function RouteComponent() {
  const [config, setConfig] = useState(config3d);
  return (
    <ListGroup horizontal className="ms-2 mt-2">
      <ListGroup.Item>
        <Form className="ms-2">
          <Form.Check
            label="2d标签"
            type="switch"
            checked={config.css2d}
            onChange={() => {
              setConfig({
                ...config3d,
                css2d: !config.css2d,
              });
              config3d.css2d = !config.css2d;
            }}
          />
        </Form>
      </ListGroup.Item>
    </ListGroup>
  );
}
