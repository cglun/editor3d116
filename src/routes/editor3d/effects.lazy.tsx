import { createLazyFileRoute } from "@tanstack/react-router";
import { useUpdateScene } from "../../app/hooks";

import AlertBase from "../../component/common/AlertBase";
import {
  Button,
  ButtonGroup,
  CardImg,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Modal,
  OverlayTrigger,
  Tab,
  Tabs,
  Tooltip,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { getButtonColor, getThemeByScene } from "../../app/utils";

import { getScene } from "../../three/init3dEditor";
import { SceneUserData, UserStyles } from "../../app/type";
import { getCardBackgroundUrl } from "../../three/utils";

export const Route = createLazyFileRoute("/editor3d/effects")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
  const [show, setShow] = useState(false);

  const userData = scene.payload.userData as SceneUserData;
  const userDataStyles = userData.userStyle;
  useEffect(() => {
    setShow(true);
  }, []);

  if (userData.projectId === -1) {
    return <AlertBase text={"到左上脚3d中加载场景！"} />;
  }

  if (!userData.config3d?.useComposer) {
    return <AlertBase text={"请到设置中开启合成"} />;
  }
  if (userDataStyles === undefined) {
    // userDataStyles = userStyle;
    return;
  }

  // return (
  //   <div>
  //     <input
  //       type="text"
  //       value={scene.payload.userData.projectId}
  //       onChange={(e) => {
  //         const u = getScene().userData as SceneUserData;
  //         if (u) {
  //           u.projectId = parseInt(e.target.value);
  //           console.log(cardSize);

  //           updateScene(getScene());
  //         }
  //       }}
  //     />
  //   </div>
  // );

  function handleClose() {
    const _userData = getScene().userData as SceneUserData;
    _userData.userStyle = userDataStyles;
    setShow(false);
  }
  function cardNumber(
    key: keyof UserStyles,
    placeholder: string,
    tips?: string,
    step?: number
  ) {
    return (
      <DsssssNumber
        tips={tips}
        step={step}
        placeholder={placeholder}
        value={Number(userDataStyles[key])}
        getValue={function (val: number) {
          const _userData = getScene().userData as SceneUserData;

          (_userData.userStyle as any)[key] = val;
          console.log(val);
          updateScene(getScene());
        }}
      />
    );
  }
  function cardText(
    key: keyof UserStyles,
    placeholder: string,
    type: "color" | "text",
    tips?: string
  ) {
    let displayValue = userDataStyles[key] as string;
    if (type === "color" && typeof displayValue === "string") {
      displayValue = rgbaToHex(displayValue);
    }

    return (
      <DsssssString
        tips={tips}
        type={type}
        placeholder={placeholder}
        value={displayValue}
        getValue={function (val: string) {
          const _userData = getScene().userData as SceneUserData;
          if (key === "cardBackgroundColor") {
            _userData.userStyle.cardBackgroundUrl = "";
          }

          (_userData.userStyle as any)[key] = val;
          updateScene(getScene());
        }}
      />
    );
  }

  // 修改 rgba 转十六进制颜色的函数，始终返回 #rrggbb 格式
  function rgbaToHex(rgba: string): string {
    if (rgba === undefined || rgba === null) {
      return "#000000";
    }

    // 匹配 rgba 和 rgb 格式的颜色值
    const match = rgba.match(
      /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/
    );
    if (!match) {
      return rgba.startsWith("#") ? rgba.slice(0, 7) : "#000000";
    }

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    // 将每个颜色分量转换为两位十六进制字符串
    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");

    return `#${hexR}${hexG}${hexB}`;
  }

  const defaultImage3dUrl = new URL(
    "/public/static/images/box.png",
    import.meta.url
  ).href;
  const {
    cardWidth,
    cardHeight,
    cardRadius,
    cardBackgroundColor,
    cardBackgroundUrl,
    headerFontSize,
    headerColor,
    bodyFontSize,
    bodyColor,
    modelHighlightColor,
    offsetX,
    offsetY,
    cardBackgroundAlpha,
    headerMarginTop,
    headerMarginLeft,
  } = userDataStyles;

  return (
    <ListGroup>
      <ListGroupItem>
        <ButtonGroup size="sm">
          {!show && (
            <Button
              variant={buttonColor}
              onClick={() => {
                setShow(true);
              }}
            >
              效果设置
            </Button>
          )}
        </ButtonGroup>
        <Modal size="xl" show={show} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>效果设置</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: 0, minHeight: "30px" }}>
            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
              <Tab eventKey="home" title="信息框设置">
                <ListGroup horizontal className="d-flex flex-wrap">
                  {cardText(
                    "modelHighlightColor",
                    "模型高亮边框颜色",
                    "color",
                    "保存后看预览效果"
                  )}
                  {cardNumber("cardWidth", "卡片宽度")}
                  {cardNumber("cardHeight", "卡片高度")}
                  {cardNumber(
                    "cardSize",
                    "卡片尺寸",
                    "真实效果要到预览中查看",
                    0.01
                  )}

                  {cardNumber(
                    "offsetX",
                    "卡片X轴偏移",
                    "真实效果要到预览中查看"
                  )}
                  {cardNumber(
                    "offsetY",
                    "卡片Y轴偏移",
                    "真实效果要到预览中查看"
                  )}
                  {cardNumber("cardRadius", "卡片圆角")}

                  {cardText(
                    "cardBackgroundColor",
                    "卡片背景颜色",
                    "color",
                    "背景图URL将清空"
                  )}
                  {cardText("cardBackgroundUrl", "卡片背景图URL地址", "text")}
                  {cardText("headerColor", "标题颜色", "color")}
                  {cardNumber("headerMarginTop", "标题上边距")}
                  {cardNumber("headerMarginLeft", "标题左边距")}
                  {cardNumber("headerFontSize", "标题字体大小")}
                  {cardNumber("bodyFontSize", "内容字体大小")}
                  {cardText("bodyColor", "内容字体颜色", "color")}
                </ListGroup>
                <div
                  className="d-flex flex-column align-items-center justify-content-center position-relative"
                  style={{
                    width: "600px",
                    height: "460px",
                    overflowY: "auto",
                  }}
                >
                  <div style={{}}>
                    <CardImg
                      src={defaultImage3dUrl}
                      style={{
                        width: "130px",
                        height: "130px",
                        backgroundColor: rgbaToHex(modelHighlightColor),
                      }}
                    />
                  </div>
                  <div
                    className="mark-label mark-label-controller-panel"
                    style={{
                      position: "absolute",
                      top: 165 + offsetY + "px",
                      left: 400 + offsetX + "px",
                      width: cardWidth + "px",
                      height: cardHeight + "px",

                      borderRadius: cardRadius + "px",
                      // 使用 rgba 格式设置背景色，结合十六进制颜色和透明度
                      backgroundColor: `rgba(${parseInt(cardBackgroundColor.slice(1, 3), 16)}, ${parseInt(
                        cardBackgroundColor.slice(3, 5),
                        16
                      )}, ${parseInt(cardBackgroundColor.slice(5, 7), 16)}, ${
                        cardBackgroundAlpha || 1
                      })`,
                      backgroundImage: getCardBackgroundUrl(cardBackgroundUrl),
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      backgroundSize: "cover",
                      padding: `${headerMarginTop}px ${headerMarginLeft}px  `,
                      fontSize: bodyFontSize + "px",
                      color: bodyColor,
                    }}
                  >
                    <div
                      className="mark-label-header"
                      style={{
                        fontSize: headerFontSize + "px",
                        color: headerColor,
                      }}
                    >
                      <i className="bi bi-eye"></i>
                      <span className="ms-1">标题信息</span>
                    </div>
                    <div
                      className="mark-label-body"
                      style={{
                        fontSize: bodyFontSize + "px",
                        color: bodyColor,
                        marginLeft: headerMarginLeft + "px",
                      }}
                    >
                      <p>编号：116</p>
                      <p>标题：标题</p>
                      <p>日期：2008</p>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="profile" title="待定……">
                待定……
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant={buttonColor} onClick={handleClose}>
              关闭
            </Button>
          </Modal.Footer>
        </Modal>
      </ListGroupItem>
    </ListGroup>
  );
}

function DsssssString({
  value,
  getValue,
  placeholder,
  type = "color",
  tips = "",
}: {
  placeholder: string;
  value: string;
  getValue: any;
  type: "color" | "text";
  tips?: string;
}) {
  return (
    <ListGroupItem>
      <InputGroup>
        <InputGroup.Text>{placeholder}</InputGroup.Text>

        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 250 }}
          overlay={<Tooltip>{tips}</Tooltip>}
        >
          <div className="ellipsis-3d">
            <Form>
              <Form.Control
                id={`${placeholder}-form1`}
                onChange={(e) => {
                  getValue(e.target.value.trim());
                }}
                type={type}
                value={value}
                placeholder={placeholder}
                aria-label={placeholder}
              />
            </Form>
          </div>
        </OverlayTrigger>
      </InputGroup>
    </ListGroupItem>
  );
}

function DsssssNumber({
  value,
  getValue,
  tips,
  placeholder,
  step = 1,
}: {
  placeholder: string;
  value: number;
  tips?: string;
  getValue: (val: number) => void;
  step?: number;
}) {
  return (
    <ListGroupItem>
      <InputGroup>
        <InputGroup.Text>{placeholder}</InputGroup.Text>

        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 250 }}
          overlay={<Tooltip>{tips}</Tooltip>}
        >
          <Form>
            <Form.Control
              id={`${placeholder}-form1`}
              onChange={(e) => {
                getValue(parseFloat(e.target.value.trim()));
              }}
              type="number"
              step={step}
              value={value}
              placeholder={placeholder}
              aria-label={placeholder}
            />
          </Form>
        </OverlayTrigger>
      </InputGroup>
    </ListGroupItem>
  );
}
