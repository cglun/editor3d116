import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import Form from "react-bootstrap/esm/Form";
import { config3d } from "../../three/utils";

export const Route = createLazyFileRoute("/editor3d/config")({
  component: RouteComponent,
});

function RouteComponent() {
  function ConfigCheck({ label = "标签", configKey = "css2d" }) {
    const _configKey = configKey as keyof typeof config3d;
    const [_value, _setValue] = useState(config3d[_configKey]);
    return (
      <Form className="ms-2">
        <Form.Check
          label={label}
          type="switch"
          checked={_value}
          onChange={() => {
            _setValue(!_value);
            config3d[_configKey] = !_value;
            console.log(config3d[_configKey] as boolean);
          }}
        />
      </Form>
    );
  }

  return (
    <ListGroup horizontal className="ms-2 mt-2">
      <ListGroup.Item>
        <ConfigCheck label="css2d" configKey="css2d" />
      </ListGroup.Item>
      <ListGroup.Item>
        <ConfigCheck label="css3d" configKey="css3d" />
      </ListGroup.Item>
    </ListGroup>
  );
}
