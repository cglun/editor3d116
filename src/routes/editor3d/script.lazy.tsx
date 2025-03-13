import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import Highlight from "react-highlight";
import { getButtonColor } from "../../app/config";
import { getScene } from "../../three/init3dEditor";
import { useUpdateScene } from "../../app/hooks";

export const Route = createLazyFileRoute("/editor3d/script")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene } = useUpdateScene();
  const { javascript } = scene.payload.userData;
  const [code, setCode] = useState(javascript);
  const [e, setE] = useState(false);
  useEffect(() => {
    setCode(javascript);
    setE(false);
  }, [scene]);

  return (
    <Container fluid>
      <Button
        className="mt-2"
        size="sm"
        variant={getButtonColor()}
        onClick={() => {
          setE(!e);
        }}
      >
        {e ? "返回" : "编辑"}
      </Button>
      {e && (
        <FloatingLabel
          className="mt-2"
          controlId="floatingTextarea2"
          label="编辑中……"
        >
          <Form.Control
            as="textarea"
            placeholder="编辑中……"
            style={{ height: "60vh", minHeight: "60vh" }}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              getScene().userData.javascript = e.target.value;
            }}
          />
        </FloatingLabel>
      )}
      {!e && (
        <div style={{ height: "60vh", minHeight: "60vh" }}>
          <Highlight className="javascript">{code}</Highlight>
        </div>
      )}
    </Container>
  );
}
