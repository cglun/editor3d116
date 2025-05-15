import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, ButtonGroup, Container, ListGroup } from "react-bootstrap";
import { getScene } from "../../three/init3dEditor";
import { useUpdateScene } from "../../app/hooks";
import AlertBase from "../../component/common/AlertBase";
import { APP_COLOR } from "../../app/type";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import CodeEditor from "../../component/common/CodeEditor";
import { generateButtonGroup } from "../../viewer3d/viewer3dUtils";
import Toast3d from "../../component/common/Toast3d";
import { userData } from "../../three/config3d";

import ModalConfirm3d from "../../component/common/ModalConfirm3d";
export const Route = createLazyFileRoute("/editor3d/script")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene();

  if (scene.payload.userData === undefined) {
    return;
  }

  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
  const { javascript, projectId, customButtonList } = scene.payload.userData;

  // const [javaScriptCode, setJavaScriptCode] = useState<string>(javascript);
  const [showJavaScript, setShowJavaScript] = useState(false); // 是否为调试场景[调试场景不允许修改代码]

  const [show, setShow] = useState(false);
  const buttonList = JSON.stringify(customButtonList, null, 5);

  //@ts-ignore
  const list = [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "A_F1" }];
  return (
    <Container fluid>
      <ListGroup.Item>
        <AlertBase
          className="  mb-0 mt-0"
          type={APP_COLOR.Secondary}
          text={
            "开发调试，可以在【/src/three/scriptDev.ts】中编写脚本进行调试，调试完成后，复制到此处保存!"
          }
        />
      </ListGroup.Item>

      <ListGroup>
        {projectId && (
          <ListGroup.Item>
            <ButtonGroup size="sm">
              <Button
                variant={buttonColor}
                onClick={() => {
                  setShowJavaScript(true);
                }}
              >
                编辑代码
              </Button>
              <Button
                variant={buttonColor}
                onClick={() => {
                  setShow(true);
                }}
              >
                编辑按钮
              </Button>
            </ButtonGroup>
            <CodeEditor
              tipsTitle="脚本编辑"
              code={javascript}
              isValidate={true}
              show={showJavaScript}
              setShow={setShowJavaScript}
              callback={function (value): void {
                getScene().userData.javascript = value;
                updateScene(getScene());
              }}
            />
            <CodeEditor
              tipsTitle="按钮组编辑"
              isValidate={true}
              language="json"
              code={buttonList}
              show={show}
              setShow={setShow}
              callback={(value) => {
                try {
                  getScene().userData.customButtonList = JSON.parse(value);
                  updateScene(getScene());
                } catch (error) {
                  if (error instanceof Error) {
                    ModalConfirm3d({
                      title: "提示",
                      body: error.message,
                      confirmButton: {
                        show: true,
                        closeButton: true,
                        hasButton: true,
                      },
                    });
                  }
                }
              }}
            >
              <ButtonGroup>
                {Object.keys(customButtonList).length !== 0 ? (
                  <Button
                    variant={buttonColor}
                    onClick={() => {
                      getScene().userData.customButtonList = {};
                      updateScene(getScene());
                      Toast3d("已重置按钮组");
                    }}
                  >
                    重置
                  </Button>
                ) : (
                  <Button
                    variant={buttonColor}
                    onClick={() => {
                      const { toggleButtonGroup } = JSON.parse(buttonList);

                      const gerToggleButtonGroup = generateButtonGroup(
                        toggleButtonGroup || [],
                        getScene()
                      );
                      type CustomButtonListType =
                        typeof userData.customButtonList;
                      const buttonGroup: CustomButtonListType = {
                        toggleButtonGroup: {
                          name: "切换按钮组",
                          type: "TOGGLE",
                          listGroup: gerToggleButtonGroup,
                        },
                        roamButtonGroup: {
                          name: "漫游按钮组",
                          type: "ROAM",
                          listGroup: [
                            { name: "开始漫游" },
                            { name: "停止漫游" },
                          ],
                        },
                      };
                      getScene().userData.customButtonList = buttonGroup;

                      updateScene(getScene());
                      console.log(getScene().userData.customButtonList);

                      Toast3d("已生成按钮组");
                    }}
                  >
                    生成按钮
                  </Button>
                )}
              </ButtonGroup>
            </CodeEditor>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  );
}
