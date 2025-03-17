import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Color, Fog, Object3D } from "three";

import Card from "react-bootstrap/esm/Card";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { getScene } from "../../../three/init3dEditor";
import { Container } from "react-bootstrap";
import { useUpdateScene } from "../../../app/hooks";
import { Input3d } from "./Input3d";
import { InputAttrText } from "./InputAttrText";
import { InputAttrNumber } from "./InputAttrNumber";
import { getThemeByScene } from "../../../app/utils";

const step = 0.1;
function SceneProperty() {
  const { scene, updateScene } = useUpdateScene();
  let { themeColor } = getThemeByScene(scene);

  const _scene = getScene();
  let bgColor = "#000116";
  if (_scene.background !== null) {
    const bc = _scene.background as Color;
    bgColor = "#" + bc.getHexString();
  }
  let fogColor = "#000116";
  if (_scene.fog !== null) {
    const fog = _scene.fog;
    fogColor = "#" + fog.color.getHexString();
  }
  return (
    <Container fluid>
      <InputGroup size="sm">
        <InputGroup.Text>背景色</InputGroup.Text>
        <Form.Control
          aria-label="small"
          aria-describedby="inputGroup-sizing-sm"
          type="color"
          value={bgColor}
          onChange={(e) => {
            const _scene = getScene();
            _scene.background = new Color(e.target.value);
            updateScene(getScene());
          }}
        />
      </InputGroup>
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
        variant={themeColor}
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
