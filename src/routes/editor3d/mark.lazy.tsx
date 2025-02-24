import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from "react-bootstrap";

import { getButtonColor } from "../../app/config";
import { useEffect, useState } from "react";
import { setClassName } from "../../app/utils";
import {
  config3d,
  createCss2dLabel,
  createCss3dLabel,
} from "../../three/utils";
import { getScene } from "../../three/init3dEditor";

import { Group } from "three";

import { CSS2DObject, CSS3DSprite } from "three/examples/jsm/Addons.js";

export const Route = createLazyFileRoute("/editor3d/mark")({
  component: RouteComponent,
});

function RouteComponent() {
  const [inputText, setInputText] = useState("mark");

  const [logo, setLogo] = useState<string>("geo-alt");
  //const { dispatchScene } = useContext(MyContext);

  useEffect(() => {
    // addLocalModel();
    // dispatchScene({
    //   type: "setScene",
    //   payload: getScene(),
    // });
  }, []);

  function addMark(label: CSS3DSprite | CSS2DObject) {
    const MARK_LABEL = getScene().getObjectByName("MARK_LABEL");

    const scene = getScene();
    if (!MARK_LABEL) {
      const group = new Group();
      group.name = "MARK_LABEL";
      group.add(label);
      scene.add(group);
    }
    if (MARK_LABEL) {
      MARK_LABEL.add(label);
    }

    // setLabelRenderer1(label3d);
  }

  function ConfigCheck({ label = "标签", configKey = "css2d" }) {
    const _configKey = configKey as keyof typeof config3d;
    const [_value, _setValue] = useState(config3d[_configKey]);
    return (
      <Form className="ms-2">
        <Form.Check
          label={label}
          type="switch"
          checked={_value}
          onChange={() => {
            _setValue(!_value);
            config3d[_configKey] = !_value;
            console.log(config3d[_configKey] as boolean);
          }}
        />
      </Form>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col xl={2}>
          <ListGroup horizontal className="ms-2 mt-2">
            <ListGroup.Item>
              <ConfigCheck label="css2d" configKey="css2d" />
            </ListGroup.Item>
            <ListGroup.Item>
              <ConfigCheck label="css3d" configKey="css3d" />
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col xl={1} className="text-center mt-2">
          <i className={setClassName(logo)} style={{ fontSize: "1.4rem" }}></i>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col xl={8}>
          <InputGroup className="mb-3">
            <div>
              <div></div>
              <Form.Select
                aria-label="logo"
                onChange={(e) => {
                  setLogo(e.target.value);
                }}
              >
                <option value="geo-alt" defaultValue="geo-alt">
                  图标1
                </option>
                <option value="geo"> 图标2</option>
                <option value="pin-map"> 图标3</option>
              </Form.Select>
            </div>
            <Form.Control
              placeholder="名称"
              onChange={(e) => {
                setInputText(e.target.value);
              }}
            />
            <Button
              variant={getButtonColor()}
              onClick={() => {
                addMark(createCss2dLabel(inputText, logo));
              }}
            >
              添加标记
            </Button>
          </InputGroup>
        </Col>
        <Col className="ms-2">
          <Button
            variant={getButtonColor()}
            onClick={() => {
              const scene = getScene();
              console.log(scene);
            }}
          >
            一键标记
          </Button>
          <Button
            onClick={() => {
              addMark(createCss3dLabel(inputText, logo));
            }}
          >
            3d标记
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
