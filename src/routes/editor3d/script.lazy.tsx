import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
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
import { ActionItem, APP_COLOR } from "../../app/type";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import { useRef } from "react";
import { createGroupIfNotExist } from "../../three/utils";
import { GLOBAL_CONSTANT } from "../../three/GLOBAL_CONSTANT";
import { showModelByName } from "../../viewer3d/viewer3dUtils";
import Toast3d from "../../component/common/Toast3d";

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

  // 添加 javascript 和 projectId 到依赖项数组
  useEffect(() => {
    setCode(javascript);
    const SCENE_PROJECT = localStorage.getItem("SCENE_PROJECT");
    if (SCENE_PROJECT && projectId == SCENE_PROJECT) {
      setIsDebug(true);
    } else {
      setIsDebug(false);
    }
  }, [scene, javascript, projectId]);
  function generateButtonGroup() {
    const actionList: ActionItem[] = [];
    const MODEL_GROUP = createGroupIfNotExist(
      getScene(),
      GLOBAL_CONSTANT.MODEL_GROUP,
      false
    );
    if (MODEL_GROUP) {
      // _rootGroupName = MODEL_GROUP.children[0].name;
      const { children } = MODEL_GROUP;
      const envMesh = children.find((item) => item.name.includes("_ENV"));
      //二层
      children.forEach((item) => {
        const level2 = item.children;
        level2.forEach((item) => {
          if (!item.name.includes("_ENV")) {
            const { name, id } = item;
            actionList.push({
              id,
              name,
              handler: () => {
                showModelByName(item.name);
              },
              bindCameraView: null,
              bindSceneById: null,
            });
          }
        });
      });
      //三层
      children.forEach((item) => {
        const level2 = item.children;
        level2.forEach((item) => {
          const level3 = item.children;
          level3.forEach((item) => {
            const { name, id } = item;
            actionList.push({
              id,
              name,

              handler: () => {
                showModelByName(name);
                if (envMesh) {
                  envMesh.visible = true;
                }
              },
              bindCameraView: null,
              bindSceneById: null,
            });
          });
        });
      });
    }
    const _code = JSON.stringify(actionList) + "\n\n\n\n\n" + code;
    // navigator.clipboard
    //   .writeText(_code)
    //   .then(() => {
    //     Toast3d("复制成功");
    //   })
    //   .catch((error) => {
    //     // 处理复制过程中出现的错误
    //     console.error("复制时发生错误:", error);
    //     Toast3d("复制失败", "失败", APP_COLOR.Danger);
    //   });
    setCode(_code);
    getScene().userData.javascript = _code;
  }
  const bb = [
    { id: 987, name: "A", bindCameraView: null, bindSceneById: null },
    { id: 988, name: "B", bindCameraView: null, bindSceneById: null },
    { id: 989, name: "C", bindCameraView: null, bindSceneById: null },
    { id: 1016, name: "A_F1", bindCameraView: null, bindSceneById: null },
    { id: 1017, name: "A_F2", bindCameraView: null, bindSceneById: null },
    { id: 1018, name: "A_F3", bindCameraView: null, bindSceneById: null },
    { id: 1019, name: "A_F4", bindCameraView: null, bindSceneById: null },
    { id: 1020, name: "B_F1", bindCameraView: null, bindSceneById: null },
    { id: 1021, name: "B_F2", bindCameraView: null, bindSceneById: null },
    { id: 1022, name: "B_F3", bindCameraView: null, bindSceneById: null },
    { id: 1023, name: "B_F4", bindCameraView: null, bindSceneById: null },
    { id: 1024, name: "C_F1", bindCameraView: null, bindSceneById: null },
    { id: 1025, name: "C_F2", bindCameraView: null, bindSceneById: null },
    { id: 1026, name: "C_F3", bindCameraView: null, bindSceneById: null },
    { id: 1027, name: "C_F4", bindCameraView: null, bindSceneById: null },
  ];
  return (
    <Container fluid>
      <ListGroup horizontal>
        {projectId && (
          <ListGroup.Item>
            <ButtonGroup size="sm">
              {isDebug ? (
                <Button
                  variant={buttonColor}
                  onClick={() => {
                    localStorage.removeItem("SCENE_PROJECT");
                    setIsDebug(!isDebug);
                    location.reload();
                  }}
                >
                  取消调试
                </Button>
              ) : (
                <Button
                  variant={buttonColor}
                  onClick={() => {
                    localStorage.setItem("SCENE_PROJECT", projectId);
                    setIsDebug(!isDebug);
                  }}
                >
                  设置调试
                </Button>
              )}
              <Button variant={buttonColor} onClick={generateButtonGroup}>
                复制按钮代码
              </Button>
              <Button
                variant={buttonColor}
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.readText().then((text) => {
                      setCode(`${code}\n${text}`);
                    });
                  }
                }}
              >
                粘贴代码
              </Button>
            </ButtonGroup>
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
