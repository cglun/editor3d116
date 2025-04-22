import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, ListGroup } from "react-bootstrap";
import { getScene } from "../../three/init3dEditor";
import { useUpdateScene } from "../../app/hooks";
import AlertBase from "../../component/common/AlertBase";
import { APP_COLOR } from "../../app/type";
import { getButtonColor, getThemeByScene } from "../../app/utils";

import ScriptEditor from "../../component/common/ScriptEditor";

export const Route = createLazyFileRoute("/editor3d/script")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene } = useUpdateScene();
  const { javascript, projectId } = scene.payload.userData;
  const [code, setCode] = useState<string>(javascript);

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

  //@ts-ignore
  const list = [
    { name: "A" },
    { name: "B" },
    { name: "C" },
    { name: "A_F1" },
    { name: "A_F2" },
    { name: "A_F3" },
    { name: "A_F4" },
    { name: "B_F1" },
    { name: "B_F2" },
    { name: "B_F3" },
    { name: "B_F4" },
    { name: "C_F1" },
    { name: "C_F2" },
    { name: "C_F3" },
    { name: "C_F4" },
    { name: "库房A" },
    { name: "库房B" },
    { name: "库房A货架1" },
    { name: "库房B货架2" },
    { name: "库房2货架1" },
    { name: "库房2货架2" },
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

      <ScriptEditor
        code={code}
        setCode={setCode}
        callback={function (): void {
          getScene().userData.javascript = code;
        }}
      />
    </Container>
  );
}
