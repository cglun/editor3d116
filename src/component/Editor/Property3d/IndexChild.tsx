import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Color, Fog, Light, OrthographicCamera, Texture, Vector2 } from "three";
import Card from "react-bootstrap/esm/Card";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { getScene } from "../../../three/init3dEditor";
import { ButtonGroup, Container } from "react-bootstrap";
import { useUpdateScene } from "../../../app/hooks";
import { Input3d } from "./Input3d";
import { InputAttrText } from "./InputAttrText";
import { getButtonColor, getThemeByScene } from "../../../app/utils";
import AlertBase from "../../common/AlertBase";
import { setTextureBackground } from "../../../three/common3d";
import { userData } from "../../../three/config3d";
import { APP_COLOR, SelectedObject } from "../../../app/type";
import { InputAttrNumber } from "./InputAttrNumber";
import Toast3d from "../../common/Toast3d";

const step = 0.1;
function SceneProperty() {
  const { scene, updateScene } = useUpdateScene();

  const { themeColor } = getThemeByScene(scene);

  const _scene = getScene();
  let bgColor = "#000116";
  const background = _scene.background as Color | Texture;
  const [enableColor, setEnableColor] = useState(background instanceof Color);

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
      <AlertBase type={themeColor} text={"背景色和背景图，只选其一"} />{" "}
      <ButtonGroup className="mb-2" size="sm">
        <Button
          variant={getButtonColor(themeColor)}
          onClick={() => {
            setEnableColor(!enableColor);
            _scene.userData.backgroundHDR = userData.backgroundHDR;
            const { backgroundHDR } = _scene.userData;
            backgroundHDR.asBackground = !backgroundHDR.asBackground;
            if (!backgroundHDR.asBackground) {
              _scene.background = new Color(bgColor);
              _scene.environment = null;
            }
            if (backgroundHDR.asBackground) {
              _scene.userData.backgroundHDR.asBackground = true;
              setTextureBackground(_scene);
            }
            updateScene(getScene());
          }}
        >
          {enableColor ? "使用贴图" : "使用颜色"}
        </Button>
        <Button
          variant={getButtonColor(themeColor)}
          onClick={() => {
            // _scene.background = new Color("#000");
            _scene.fog = null;
            Toast3d("雾气已重置");
            updateScene(getScene());
          }}
        >
          重置雾气
        </Button>
      </ButtonGroup>
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
      <AlertBase
        className="mb-1 mt-1"
        type={APP_COLOR.Warning}
        text={"自定义按钮，类型：数组"}
      />
    </Container>
  );
}

function CommonProperty({ selected3d }: { selected3d: SelectedObject }) {
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

  function LightProperty() {
    if (!(selected3d instanceof Light)) {
      return;
    }
    //  selected3d!.shadow!.mapSize.x = 33512; // default
    const camera = selected3d.shadow?.camera as OrthographicCamera;
    return (
      <>
        <InputAttrNumber
          title="亮度"
          min={0}
          selected3d={selected3d}
          attr={"intensity"}
          step={step}
        />
        <InputAttrNumber
          title="阴影宽"
          min={0}
          selected3d={selected3d.shadow?.mapSize as Vector2}
          attr={"x"}
          step={step}
        />
        <InputAttrNumber
          title="阴影高"
          min={0}
          selected3d={selected3d.shadow?.mapSize as Vector2}
          attr={"y"}
          step={step}
        />
        <InputAttrNumber
          title="阴影近端"
          min={0}
          selected3d={camera}
          attr={"near"}
          step={step}
        />
        <InputAttrNumber
          title="阴影远端"
          min={0}
          selected3d={camera}
          attr={"far"}
          step={step}
        />
        <InputAttrNumber
          title="阴影左端"
          min={-10000}
          selected3d={camera}
          attr={"left"}
          step={step}
        />
        <InputAttrNumber
          title="阴影右端"
          min={-10000}
          selected3d={camera}
          attr={"right"}
          step={step}
        />
        <InputAttrNumber
          title="阴影顶端"
          min={-10000}
          selected3d={camera}
          attr={"top"}
          step={step}
        />
        <InputAttrNumber
          title="阴影底端"
          min={-10000}
          selected3d={camera}
          attr={"bottom"}
          step={step}
        />
      </>
    );
  }
  //@ts-expect-error
  function BindObject() {
    if (selected3d instanceof Light) {
      return;
    }
    return (
      <ButtonGroup size="sm">
        <Button
          variant={buttonColor}
          onClick={() => {
            const scene = getScene();
            console.log(scene);
          }}
        >
          绑定视角
        </Button>
        <Button
          variant={buttonColor}
          onClick={() => {
            alert("请在threejs中添加视角");
          }}
        >
          绑定场景
        </Button>
      </ButtonGroup>
    );
  }

  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
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
            {/* <BindObject /> */}
            <LightProperty />
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

// 移除 typeof 关键字，并添加类型注解，这里假设使用 SelectedObject 类型

export default function IndexChild({
  selected3d,
}: {
  selected3d: SelectedObject;
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
