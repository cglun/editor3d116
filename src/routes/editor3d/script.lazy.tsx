import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
} from "react-bootstrap";
import { getScene } from "../../three/init3dEditor";
import { useUpdateScene } from "../../app/hooks";
import { CodeHighlight } from "@mantine/code-highlight";
import { MantineProvider } from "@mantine/core";
import AlertBase from "../../component/common/AlertBase";
import { APP_COLOR } from "../../app/type";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import { useRef } from "react";

export const Route = createLazyFileRoute("/editor3d/script")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene } = useUpdateScene();
  const { javascript, projectId } = scene.payload.userData;
  const [code, setCode] = useState(javascript);
  const [editable, setEditable] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 创建一个引用

  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
  const [isDebug, setIsDebug] = useState(false); // 是否为调试场景[调试场景不允许修改代码]

  // 添加 javascript 到依赖项数组
  useEffect(() => {
    setCode(javascript);
    const SCENE_PROJECT = localStorage.getItem("SCENE_PROJECT");
    if (SCENE_PROJECT && projectId == SCENE_PROJECT) {
      setIsDebug(true);
    } else {
      setIsDebug(false);
    }
  }, [scene, javascript]);

  return (
    <Container fluid>
      <ListGroup horizontal>
        {projectId && (
          <ListGroup.Item>
            {isDebug ? (
              <Button
                variant={buttonColor}
                onClick={() => {
                  localStorage.removeItem("SCENE_PROJECT");
                  setIsDebug(!isDebug);
                  location.reload();
                }}
              >
                取消调试场景
              </Button>
            ) : (
              <Button
                variant={buttonColor}
                onClick={() => {
                  localStorage.setItem("SCENE_PROJECT", projectId);
                  setIsDebug(!isDebug);
                }}
              >
                设置调试场景
              </Button>
            )}
          </ListGroup.Item>
        )}
        <ListGroup.Item>
          <AlertBase
            className="  mb-0 mt-0"
            type={APP_COLOR.Secondary}
            text={
              "开发调试，可以在【/src/three/scriptDev.ts】中编写脚本进行调试，调试完成后，复制到此处保存!"
            }
          />
        </ListGroup.Item>
      </ListGroup>

      {editable ? (
        <FloatingLabel controlId="floatingTextarea2" label="编辑中……">
          <Form.Control
            as="textarea"
            ref={textareaRef} // 将引用绑定到文本框
            style={{ height: "100vh" }}
            value={code}
            onMouseLeave={() => {
              setEditable(!editable);
            }}
            onMouseEnter={() => {
              // 聚焦到文本框内容最后面
              if (textareaRef.current) {
                const length = textareaRef.current.value.length;
                textareaRef.current.setSelectionRange(length, length);
                textareaRef.current.focus();
              }
            }}
            onChange={(e) => {
              setCode(e.target.value);
              getScene().userData.javascript = e.target.value;
            }}
          />
        </FloatingLabel>
      ) : (
        <MantineProvider>
          <CodeHighlight
            code={code.trim().length > 0 ? code : "//编辑代码"}
            style={{
              padding: "2px 10px ",
              minHeight: "10vh",
              cursor: "text",
              borderWidth: "1px",
              borderStyle: "dashed",
              borderColor: "var(--bs-card-border-color)",
              borderRadius: "4px",
            }}
            language="javascript"
            withCopyButton={false}
            onClick={() => {
              setEditable(!editable);
            }}
          />
        </MantineProvider>
      )}
    </Container>
  );
}
