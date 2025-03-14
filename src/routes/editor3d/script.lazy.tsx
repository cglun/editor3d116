import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { getButtonColor } from "../../app/config";
import { getScene } from "../../three/init3dEditor";
import { useUpdateScene } from "../../app/hooks";
import { CodeHighlight } from "@mantine/code-highlight";
import { MantineProvider } from "@mantine/core";
import AlertBase from "../../component/common/AlertBase";
import { APP_COLOR } from "../../app/type";

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
        <MantineProvider>
          <AlertBase
            className="mt-2"
            type={APP_COLOR.Secondary}
            text={
              "开发调试，可以在【/src/three/scriptDev.ts】中编写脚本进行调试，调试完成后，复制到此处保存!"
            }
          />
          <CodeHighlight
            style={{
              padding: "109px !important",
            }}
            code={code}
            language="javascript"
            withCopyButton={false}
          />
        </MantineProvider>
      )}
    </Container>
  );
}
