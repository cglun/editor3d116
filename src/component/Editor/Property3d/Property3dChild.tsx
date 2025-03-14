import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Color, Fog, Object3D } from "three";
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

function CameraProperty() {
  return <AlertBase type={APP_COLOR.Info} text={"默认属性"} />;
}

function SceneProperty({ selectedObject }: { selectedObject: Object3D | any }) {
  const { updateScene } = useUpdateScene();

  const backgroundColor = selectedObject.background?.getHexString()
    ? selectedObject.background?.getHexString()
    : "000000";
  const fogColor = selectedObject.fog?.color.getHexString()
    ? selectedObject.background?.getHexString()
    : "000000";
  return (
    <Container fluid>
      <InputGroup size="sm">
        <InputGroup.Text>背景色</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          type="color"
          value={"#" + backgroundColor}
          onChange={(e) => {
            selectedObject.background = new Color(e.target.value);
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
            if (selectedObject.fog === null) {
              selectedObject.fog = new Fog(e.target.value, 0, 20);
            } else {
              selectedObject.fog.color = new Color(e.target.value);
            }
            updateScene(getScene());
          }}
        />
      </InputGroup>
      <AttrInputNumber
        title={"雾气近端"}
        selectedObject={selectedObject.fog}
        attr={"near"}
      ></AttrInputNumber>
      <AttrInputNumber
        title={"雾气远端"}
        selectedObject={selectedObject.fog}
        attr={"far"}
      ></AttrInputNumber>
      <Button
        variant={getThemeColor()}
        onClick={() => {
          selectedObject.background = new Color("#000");
          selectedObject.fog = null;
          updateScene(getScene());
        }}
      >
        重置雾气
      </Button>
    </Container>
  );
}

function CommonProperty({
  selectedObject,
}: {
  selectedObject: Object3D | any;
}) {
  return (
    selectedObject && (
      <Container fluid>
        <Input3d transform={selectedObject.position} title={"位置"}></Input3d>
        <Input3d transform={selectedObject.rotation} title={"旋转"}></Input3d>
        <Input3d transform={selectedObject.scale} title={"缩放"}></Input3d>

        <Card>
          <Card.Header>其他属性</Card.Header>
          <Card.Body>
            <InputAttrText
              title={"名称"}
              selectedObject={selectedObject}
              attr={"name"}
            />
            <InputAttrNumber
              title="亮度"
              selectedObject={selectedObject}
              attr={"intensity"}
            />
            {!selectedObject.isAmbientLight && (
              <ButtonGroup className=" d-flex justify-content-between flex-wrap">
                <Switch3d
                  title={"投射阴影"}
                  selectedObject={selectedObject}
                  attr={"castShadow"}
                />

                <Switch3d
                  title={"接收阴影"}
                  selectedObject={selectedObject}
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

export default function Property3dChild({
  selectedObject,
}: {
  selectedObject: Object3D | any;
}) {
  if (selectedObject) {
    if (selectedObject.isScene) {
      return <SceneProperty selectedObject={selectedObject} />;
    }
    if (selectedObject.isCamera) {
      return <CameraProperty />;
    }
    return <CommonProperty selectedObject={selectedObject} />;
  }
}
