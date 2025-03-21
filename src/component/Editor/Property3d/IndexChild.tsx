import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Color, Fog, Object3D, Texture } from "three";

import Card from "react-bootstrap/esm/Card";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { getScene } from "../../../three/init3dEditor";
import { ButtonGroup, Container } from "react-bootstrap";
import { useUpdateScene } from "../../../app/hooks";
import { Input3d } from "./Input3d";
import { InputAttrText } from "./InputAttrText";
import { InputAttrNumber } from "./InputAttrNumber";
import { getButtonColor, getThemeByScene } from "../../../app/utils";
import AlertBase from "../../common/AlertBase";
import { setTextureBackground } from "../../../three/common3d";

const step = 0.1;
function SceneProperty() {
  const { scene, updateScene } = useUpdateScene();
  let { themeColor } = getThemeByScene(scene);

  const _scene = getScene();

  let bgColor = "#000116";
  const background = _scene.background as Color | Texture;
  if (background !== null) {
    const bc = background;
    if (bc instanceof Color) {
      bgColor = "#" + bc.getHexString();
    }
  }
  let fogColor = "#000116";
  if (_scene.fog !== null) {
    const fog = _scene.fog;
    fogColor = "#" + fog.color.getHexString();
  }

  function setBgColor() {
    return (
      <>
        <InputGroup size="sm">
          <InputGroup.Text>背景色</InputGroup.Text>
          <Form.Control
            aria-label="small"
            aria-describedby="inputGroup-sizing-sm"
            type="color"
            value={bgColor}
            onChange={(e) => {
              _scene.background = new Color(e.target.value);
              _scene.userData.backgroundHDR = "none";
              updateScene(getScene());
            }}
          />
        </InputGroup>

        <InputGroup size="sm">
          <InputGroup.Text>背景图</InputGroup.Text>
          <Form.Select
            aria-label="Default select example"
            value={_scene.userData.backgroundHDR}
            onChange={(e: any) => {
              const type = e.target.value;
              if (type === "none") {
                _scene.background = new Color(bgColor);
                _scene.environment = null;
                _scene.userData.backgroundHDR = "none";
              }
              _scene.userData.backgroundHDR = e.target.value;
              setTextureBackground(_scene, e.target.value);
              updateScene(getScene());
            }}
          >
            <option value="venice_sunset_1k.hdr">环境贴图一</option>
            <option value="spruit_sunrise_1k.hdr">环境贴图二</option>
            <option value="none">背景色</option>
          </Form.Select>
        </InputGroup>
        {background instanceof Texture && (
          <InputAttrNumber
            title={"模糊度"}
            selected3d={_scene}
            attr={"backgroundBlurriness"}
            step={step}
          />
        )}
      </>
    );
  }

  return (
    <Container fluid>
      {/* {background instanceof Color ? setBgColor() : "texture"} */}
      <AlertBase type={themeColor} text={"背景色和背景图，只选其一"} />
      {setBgColor()}

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
        selected3d={_scene.fog}
        attr={"near"}
        step={step}
      />
      <InputAttrNumber
        title={"雾气远端"}
        selected3d={_scene.fog}
        attr={"far"}
        step={step}
      />
      <Button
        variant={getButtonColor(themeColor)}
        size="sm"
        onClick={() => {
          _scene.background = new Color("#000");
          _scene.fog = null;
          updateScene(getScene());
        }}
      >
        重置雾气
      </Button>
    </Container>
  );
}

function CommonProperty({ selected3d }: { selected3d: Object3D | any }) {
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
              selected3d={selected3d}
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
  selected3d: Object3D | any;
}) {
  if (selected3d) {
    if (selected3d.isScene) {
      return <SceneProperty />;
    }
    if (selected3d.isCamera) {
      return (
        <Input3d
          transform={selected3d.position}
          title={"相机位置"}
          step={step}
        />
      );
    }
    return <CommonProperty selected3d={selected3d} />;
  }
}
