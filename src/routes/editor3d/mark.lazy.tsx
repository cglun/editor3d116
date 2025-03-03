import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Button,
  ButtonGroup,
  Card,
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
import { createCss2dLabel, createCss3dLabel } from "../../three/utils";
import { getScene } from "../../three/init3dEditor";
import { Group } from "three";
import { CSS2DObject, CSS3DSprite } from "three/examples/jsm/Addons.js";
import Toast3d from "../../component/common/Toast3d";
import { APP_COLOR } from "../../app/type";
import { useUpdateScene } from "../../app/hooks";
import { ConfigCheck } from "../../component/common/ConfigCheck";
import _axios from "../../app/http";

import { MyContext } from "../../app/MyContext";

export const Route = createLazyFileRoute("/editor3d/mark")({
  component: RouteComponent,
});

function RouteComponent() {
  const [markName, setMarkName] = useState("mark");
  const [logo, setLogo] = useState<string>("geo-alt");
  const [listTour, setListTour] = useState([]);
  const buttonColor = getButtonColor();
  const { scene, updateScene } = useUpdateScene();
  const { dispatchTourWindow } = useContext(MyContext);

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
  useEffect(() => {
    _axios.get("/pano/page?size=1000").then((res) => {
      if (res.data.code === 200) {
        const { records } = res.data.result;
        //records.dispatchTourWindow = dispatchTourWindow;
        // const _records = records.map((item: any) => {
        //   Object.assign(item, {
        //     dispatchTourWindow: dispatchTourWindow,
        //   });
        //   return item;
        // });

        setListTour(records);
      } else {
        Toast3d(res.data.message, "提示", APP_COLOR.Danger);
      }
    });
  }, []);

  const { config3d } = scene.payload.userData;

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
      </Row>
      <Row className="mt-2">
        <Col xl={8}>
          <InputGroup className="mb-3">
            <div className="d-flex ms-2">
              <i
                className={setClassName(logo)}
                style={{ fontSize: "1.4rem" }}
              ></i>
              <Form.Select
                className="ms-2"
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
                setMarkName(e.target.value);
              }}
            />
            <ButtonGroup>
              <Button
                variant={buttonColor}
                disabled={!config3d.css2d}
                onClick={() => {
                  addMark(createCss2dLabel(markName, logo));
                  updateScene(getScene());
                }}
              >
                添加2d标记
              </Button>
              <Button
                variant={buttonColor}
                disabled={!config3d.css2d}
                onClick={() => {
                  Toast3d("待续", "提示", APP_COLOR.Danger);
                }}
              >
                一键2d标记
              </Button>
              <Button
                variant={buttonColor}
                disabled={!config3d.css3d}
                onClick={() => {
                  addMark(createCss3dLabel(markName, logo));
                  updateScene(getScene());
                }}
              >
                添加3d标记
              </Button>
              <Button
                variant={buttonColor}
                disabled={!config3d.css3d}
                onClick={() => {
                  // Toast3d("待续", "提示", APP_COLOR.Danger);
                }}
              >
                一键3d标记
              </Button>
            </ButtonGroup>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col className="ms-2">
          {listTour &&
            config3d.css3d &&
            listTour.map((item: any, index: number) => {
              return (
                <Card style={{ width: "6rem" }} key={index}>
                  <Card.Header className="card-pd-header ">
                    {item.title}
                  </Card.Header>
                  <Card.Img
                    src={item.thumbUrl}
                    alt={item.title}
                    variant="top"
                    style={{ cursor: "crosshair" }}
                    onClick={() => {
                      addMark(
                        createCss3dLabel(
                          item.title,
                          "geo-alt",
                          {
                            id: item.id,
                            title: item.title,
                          },
                          dispatchTourWindow
                        )
                      );
                    }}
                  ></Card.Img>
                </Card>
              );
            })}
        </Col>
      </Row>
    </Container>
  );
}
