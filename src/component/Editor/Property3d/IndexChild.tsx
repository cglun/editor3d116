import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Color, Fog, Object3D, Scene } from "three";
import { getThemeColor } from "../../../app/config";
import Card from "react-bootstrap/esm/Card";
import InputGroup from "react-bootstrap/esm/InputGroup";

import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import { getScene } from "../../../three/init3dEditor";
import AlertBase from "../../common/AlertBase";
import { APP_COLOR } from "../../../app/type";
import { Container } from "react-bootstrap";
import { useUpdateScene } from "../../../app/hooks";
import { Input3d } from "./Input3d";
import { InputAttrText } from "./InputAttrText";
import { InputAttrNumber } from "./InputAttrNumber";
import { Switch3d } from "./Switch3d";
const step = 0.1;
function CameraProperty() {
  return <AlertBase type={APP_COLOR.Info} text={"默认属性"} />;
}

function SceneProperty({ scene }: { scene: Scene }) {
  const { updateScene } = useUpdateScene();
  let bgColor = new Color("#000116");
  if (scene.background === null) {
    scene.background = bgColor;
  } else {
    bgColor = scene.background as Color;
  }

  const fogColor = scene.fog?.color.getHexString();

  return (
    <Container fluid>
      <InputGroup size="sm">
        <InputGroup.Text>背景色</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          type="color"
          value={"#" + bgColor.getHexString()}
          onChange={(e) => {
            scene.background = new Color(e.target.value);
            updateScene(getScene());
          }}
        />
      </InputGroup>
      <InputGroup size="sm">
        <InputGroup.Text>雾气色</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          type="color"
          value={"#" + fogColor}
          onChange={(e) => {
            if (scene.fog === null) {
              scene.fog = new Fog(new Color(e.target.value), 0, 116);
            }
            scene.fog.color = new Color(e.target.value);
            updateScene(getScene());
          }}
        />
      </InputGroup>
      <InputAttrNumber
        title={"雾气近端"}
        selected3d={scene.fog}
        attr={"near"}
        step={step}
      ></InputAttrNumber>
      <InputAttrNumber
        title={"雾气远端"}
        selected3d={scene.fog}
        attr={"far"}
        step={step}
      ></InputAttrNumber>
      <Button
        variant={getThemeColor()}
        onClick={() => {
          scene.background = new Color("#000");
          scene.fog = null;
          updateScene(getScene());
        }}
      >
        重置雾气
      </Button>
    </Container>
  );
}

function CommonProperty({ selected3d }: { selected3d: Object3D | any }) {
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
            {!selected3d.isAmbientLight && (
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
            )}
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
      return <SceneProperty scene={selected3d} />;
    }
    if (selected3d.isCamera) {
      return <CameraProperty />;
    }
    return <CommonProperty selected3d={selected3d} />;
  }
}
