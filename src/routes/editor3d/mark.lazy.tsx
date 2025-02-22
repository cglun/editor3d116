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
import { useContext, useEffect, useState } from "react";
import { setClassName } from "../../app/utils";
import { addLabelRenderer, createCss2dLabel } from "../../three/utils";
import {
  addLocalModel,
  getDivElement,
  getLabelRenderer,
  getScene,
  setLabelRenderer,
} from "../../three/init3dEditor";
import { MyContext } from "../../app/MyContext";

export const Route = createLazyFileRoute("/editor3d/mark")({
  component: RouteComponent,
});

function RouteComponent() {
  const [inputText, setInputText] = useState("mark");
  const [mark, setMark] = useState<string[]>([]);
  const [logo, setLogo] = useState<string>("geo-alt");
  const { dispatchScene } = useContext(MyContext);
  function addMarkTest(inputText: string) {
    const labelRender = getLabelRenderer();
    if (labelRender === null) {
      const lb = addLabelRenderer(getDivElement());
      setLabelRenderer(lb);
    }
    const blender = getScene().getObjectByName("blender");

    if (blender) {
      const label = createCss2dLabel(blender, inputText, logo);
      getScene().add(label);
    }
  }
  useEffect(() => {
    // addLocalModel();
    // dispatchScene({
    //   type: "setScene",
    //   payload: getScene(),
    // });
  }, []);

  return (
    <Container fluid>
      <Row className="mt-2">
        <Col xl={1} className="text-center mt-2">
          <i className={setClassName(logo)} style={{ fontSize: "1.4rem" }}></i>
        </Col>
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
                setMark([...mark, inputText]);
                addMarkTest(inputText);
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
              console.log(getScene());
            }}
          >
            一键标记
          </Button>
        </Col>
      </Row>
      <ListGroup horizontal="sm">
        {mark &&
          mark.map((item, index) => {
            return (
              <ListGroup.Item style={{ cursor: "pointer" }} key={index}>
                {item}
              </ListGroup.Item>
            );
          })}

        {/* {mark.map((item, index) => {
          const [del, setDel] = useState(false);
          return (
            <ListGroup.Item
              key={index}
              onMouseEnter={() => {
                setDel(true);
              }}
              onMouseLeave={() => {
                setDel(false);
              }}
            >
              {item}
              <Button variant={getThemeColor()} size="sm" onClick={(item)=>{}}>
                {del && <i className={setClassName("trash")} />}
              </Button>
            </ListGroup.Item>
          );
        })} */}
      </ListGroup>
    </Container>
  );
}
