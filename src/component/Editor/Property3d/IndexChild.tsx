import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Color, Fog, Light, Scene, Texture } from "three";
import Card from "react-bootstrap/esm/Card";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { getScene } from "../../../three/init3dEditor";
import { Container } from "react-bootstrap";
import { useUpdateScene } from "../../../app/hooks";
import { Input3d } from "./Input3d";
import { InputAttrText } from "./InputAttrText";
import { InputAttrNumber } from "./InputAttrNumber";
import { getButtonColor, getThemeByScene } from "../../../app/utils";
import AlertBase from "../../common/AlertBase";
import { setTextureBackground } from "../../../three/common3d";
import { useState } from "react";
import { userData } from "../../../three/config3d";
import { EditorObject3d } from "../../../app/type";
import { Switch3d } from "./Switch3d";

const step = 0.1;
function SceneProperty() {
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);

  const _scene = getScene();

  let bgColor = "#000116";
  const background = _scene.background as Color | Texture;
  //const enableColor = background instanceof Color;
  const [enableColor, setEnableColor] = useState(background instanceof Color);

  // const [checked, setChecked] = useState(background instanceof Texture);

  if (background !== null) {
    if (background instanceof Color) {
      bgColor = "#" + background.getHexString();
    }
  }
  let fogColor = "#000116";
  if (_scene.fog !== null) {
    const fog = _scene.fog;
    fogColor = "#" + fog.color.getHexString();
  }
  function setBgColorColor() {
    return (
      <InputGroup size="sm">
        <InputGroup.Text>背景色</InputGroup.Text>
        <Form.Control
          aria-label="small"
          aria-describedby="inputGroup-sizing-sm"
          type="color"
          value={bgColor}
          onChange={(e) => {
            _scene.background = new Color(e.target.value);
            _scene.environment = null;
            updateScene(getScene());
          }}
        />
      </InputGroup>
    );
  }
  function setBgColorTexture() {
    const enableTexture = _scene.userData.backgroundHDR.asBackground;
    return (
      <>
        <Form className="border px-2">
          <Form.Check
            label="使用HDR作为背景"
            type="switch"
            checked={enableTexture}
            onChange={() => {
              const { backgroundHDR } = _scene.userData;
              backgroundHDR.asBackground = !backgroundHDR.asBackground;
              setTextureBackground(_scene);
              updateScene(getScene());
            }}
          />
        </Form>
        <InputGroup size="sm">
          <InputGroup.Text>背景图</InputGroup.Text>
          <Form.Select
            aria-label="Default select example"
            disabled={!enableTexture}
            value={_scene.userData.backgroundHDR.name}
            onChange={(e) => {
              _scene.userData.backgroundHDR.name = e.target.value;
              setTextureBackground(_scene);
              updateScene(getScene());
            }}
          >
            <option value="venice_sunset_1k.hdr">环境贴图一</option>
            <option value="spruit_sunrise_1k.hdr">环境贴图二</option>
          </Form.Select>
        </InputGroup>
        <InputAttrNumber
          title={"模糊度"}
          min={0}
          max={1}
          disabled={!enableTexture}
          selected3d={_scene}
          attr={"backgroundBlurriness"}
          step={step}
        />
        <InputAttrNumber
          title={"透明度"}
          min={0}
          max={1}
          disabled={!enableTexture}
          selected3d={_scene}
          attr={"backgroundIntensity"}
          step={step}
        />
        <InputAttrNumber
          title={"光强度"}
          min={0}
          disabled={!enableTexture}
          selected3d={_scene}
          attr={"environmentIntensity"}
          step={step}
        />
      </>
    );
  }
  return (
    <Container fluid>
      <AlertBase type={themeColor} text={"背景色和背景图，只选其一"} />
      <Button
        className="mb-2"
        variant={getButtonColor(themeColor)}
        size="sm"
        onClick={() => {
          setEnableColor(!enableColor);

          // if (!backgroundHDR) {}
          _scene.userData.backgroundHDR = userData.backgroundHDR;
          const { backgroundHDR } = _scene.userData;
          backgroundHDR.asBackground = !backgroundHDR.asBackground;
          if (!backgroundHDR.asBackground) {
            _scene.background = new Color(bgColor);
            _scene.environment = null;
          }
          if (backgroundHDR.asBackground) {
            // const textureName = "venice_sunset_1k.hdr";
            // _scene.userData.backgroundHDR.name = textureName;

            _scene.userData.backgroundHDR.asBackground = true;
            setTextureBackground(_scene);
          }
          updateScene(getScene());
        }}
      >
        {enableColor ? "使用贴图" : "使用颜色"}
      </Button>
      {enableColor ? setBgColorColor() : setBgColorTexture()}
      <InputGroup size="sm">
        <InputGroup.Text>雾气色</InputGroup.Text>
        <Form.Control
          aria-label="small"
          aria-describedby="inputGroup-sizing-sm"
          type="color"
          value={fogColor}
          onChange={(e) => {
            const _scene = getScene();
            if (_scene.fog === null) {
              _scene.fog = new Fog(bgColor, 0, 116);
            }
            _scene.fog.color = new Color(e.target.value);

            updateScene(getScene());
          }}
        />
      </InputGroup>

      <InputAttrNumber
        title={"雾气近端"}
        min={0}
        selected3d={_scene.fog as Fog}
        attr={"near"}
        step={step}
      />

      <InputAttrNumber
        title={"雾气远端"}
        min={0}
        selected3d={_scene.fog as Fog}
        attr={"far"}
        step={step}
      />
      <Button
        variant={getButtonColor(themeColor)}
        size="sm"
        onClick={() => {
          // _scene.background = new Color("#000");
          _scene.fog = null;
          updateScene(getScene());
        }}
      >
        重置雾气
      </Button>
    </Container>
  );
}

function CommonProperty({ selected3d }: { selected3d: EditorObject3d }) {
  // const { type } = selected3d.parent;
  // let canSetShadow = true;
  // // if (type && type === "Scene") {
  // //   canSetShadow = true;
  // // }

  // function findTopLevelParent(object) {

  //   canSetShadow =
  //     object.userData.type === UserDataType.GlbModel ? true : false;
  //   if (object.parent) {
  //     return findTopLevelParent(object.parent);
  //   } else {
  //     return object; // 如果没有父对象，返回当前对象，即顶层父对象
  //   }
  // }
  // findTopLevelParent(selected3d);
  // debugger;
  return (
    selected3d && (
      <Container fluid>
        <Input3d transform={selected3d.position} title={"位置"} step={step} />
        <Input3d transform={selected3d.rotation} title={"旋转"} step={step} />
        <Input3d transform={selected3d.scale} title={"缩放"} step={step} />
        <Card>
          <Card.Header>其他属性</Card.Header>
          <Card.Body>
            <InputAttrText
              title={"名称"}
              selected3d={selected3d}
              attr={"name"}
            />
            <InputAttrNumber
              title="亮度"
              min={0}
              selected3d={selected3d as Light}
              attr={"intensity"}
              step={step}
            />

            {/* {!selected3d.isAmbientLight && (
              <ButtonGroup className=" d-flex justify-content-between flex-wrap">
                <Switch3d
                  title={"投射阴影"}
                  selected3d={selected3d}
                  attr={"castShadow"}
                />

                <Switch3d
                  title={"接收阴影"}
                  selected3d={selected3d}
                  attr={"receiveShadow"}
                />
              </ButtonGroup>
            )} */}
          </Card.Body>
        </Card>
      </Container>
    )
  );
}

export default function IndexChild({
  selected3d,
}: {
  selected3d: EditorObject3d;
}) {
  if (selected3d.type === "Scene") {
    return <SceneProperty />;
  }
  if (selected3d.type === "PerspectiveCamera") {
    return (
      <Input3d transform={selected3d.position} title={"相机位置"} step={step} />
    );
  }
  return <CommonProperty selected3d={selected3d} />;
}
