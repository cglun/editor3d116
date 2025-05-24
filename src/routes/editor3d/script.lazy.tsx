import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Form,
  ListGroup,
} from "react-bootstrap";
import { createLazyFileRoute } from "@tanstack/react-router";

import CodeEditor from "../../component/common/CodeEditor";
import { getScene } from "../../three/init3dEditor";
import { useUpdateScene } from "../../app/hooks";
import AlertBase from "../../component/common/AlertBase";
import {
  APP_COLOR,
  CustomButtonListType,
  CustomButtonType,
} from "../../app/type";
import { getButtonColor, getThemeByScene } from "../../app/utils";

import Toast3d from "../../component/common/Toast3d";

import ModalConfirm3d from "../../component/common/ModalConfirm3d";

import { Vector3 } from "three";
import {
  generateRoamButtonGroup,
  generateToggleButtonGroup,
} from "../../viewer3d/buttonList/buttonGroup";

export const Route = createLazyFileRoute("/editor3d/script")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene(); // const [javaScriptCode, setJavaScriptCode] = useState<string>(javascript);
  const [showJavaScript, setShowJavaScript] = useState(false); // 是否为调试场景[调试场景不允许修改代码]
  const [show, setShow] = useState(false); // 使用可选属性和类型断言
  const {
    javascript,
    projectId,
    customButtonList = {} as CustomButtonListType,
  } = scene.payload.userData as {
    javascript: string;
    projectId: number;
    customButtonList?: CustomButtonListType;
  };
  const buttonList = JSON.stringify(customButtonList, null, 5);
  const [buttonType, setButtonType] = useState<CustomButtonType>(
    customButtonList.toggleButtonGroup?.type || "TOGGLE"
  );

  if (scene.payload.userData === undefined) {
    return;
  }

  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  // 生成按钮组
  function generateButton() {
    const { toggleButtonGroup } = JSON.parse(buttonList);

    const gerToggleButtonGroup = generateToggleButtonGroup(
      toggleButtonGroup || [],
      getScene(),
      buttonType
    );

    const offset = 1;

    const modelPositionOffset = {
      TOGGLE: new Vector3(0, 0, 0),
      STRETCH: new Vector3(0, offset, 0),
      DRAWER: new Vector3(offset, 0, 0),
      ROAM: new Vector3(0, 0, 0),
    };
    const cameraPositionOffset = {
      TOGGLE: new Vector3(offset, 0, 0),
      STRETCH: new Vector3(0, offset, 0),
      DRAWER: new Vector3(offset, offset, 0),
      ROAM: new Vector3(0, 0, 0),
    };
    const afafafaaafaf = gerToggleButtonGroup;
    const buttonGroup: CustomButtonListType = {
      toggleButtonGroup: {
        name: "切换按钮组",
        type: buttonType,
        userSetting: {
          cameraOffset: cameraPositionOffset[buttonType],
          modelOffset: modelPositionOffset[buttonType],
          animationTime: 300,
        },
        listGroup: afafafaaafaf,
      },
      roamButtonGroup: {
        name: "漫游按钮组",
        type: "ROAM",
        userSetting: {
          speed: 2,
        },
        listGroup: generateRoamButtonGroup(),
      },
    };
    getScene().userData.customButtonList = buttonGroup;
    updateScene(getScene());
    Toast3d("已生成按钮组");
  }

  return (
    <Container fluid>
      <ListGroup.Item>
        <AlertBase
          className="mb-0 mt-0"
          type={APP_COLOR.Secondary}
          text={
            "开发调试，可以在【/src/three/scriptDev.ts】中编写脚本进行调试，调试完成后，复制到此处保存!"
          }
        />
      </ListGroup.Item>

      <ListGroup>
        {projectId && projectId !== -1 && (
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
              <ButtonGroup size="sm">
                {Object.keys(customButtonList).length !== 0 ? (
                  <Button
                    variant={buttonColor}
                    onClick={() => {
                      getScene().userData.customButtonList = {};
                      updateScene(getScene());
                      setButtonType(buttonType);
                      Toast3d("已重置按钮组");
                    }}
                  >
                    重置
                  </Button>
                ) : (
                  <>
                    <Form key={"inline-radio-2"}>
                      <Form.Check
                        defaultChecked={buttonType === "TOGGLE"}
                        inline
                        label="切换"
                        name="buttonType"
                        type={"radio"}
                        id={`inline-radio-1`}
                        onClick={() => {
                          setButtonType("TOGGLE");
                        }}
                      />
                      <Form.Check
                        defaultChecked={buttonType === "STRETCH"}
                        inline
                        label="拉伸"
                        name="buttonType"
                        type={"radio"}
                        id={`inline-radio-2`}
                        onClick={() => {
                          setButtonType("STRETCH");
                        }}
                      />
                      <Form.Check
                        defaultChecked={buttonType === "DRAWER"}
                        inline
                        label="抽屉"
                        name="buttonType"
                        type={"radio"}
                        id={`inline-radio-3`}
                        onClick={() => {
                          setButtonType("DRAWER");
                        }}
                      />
                    </Form>
                    <Button variant={buttonColor} onClick={generateButton}>
                      生成按钮
                    </Button>
                  </>
                )}
              </ButtonGroup>
            </CodeEditor>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  );
}
