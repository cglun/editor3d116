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
import { useContext, useEffect, useState } from "react";
import { getButtonColor, getThemeByScene, setClassName } from "../../app/utils";
import { clearOldLabel, createGroupIfNotExist } from "../../three/utils";
import { getScene } from "../../three/init3dEditor";
import { CSS2DObject, CSS3DSprite } from "three/examples/jsm/Addons.js";
import Toast3d from "../../component/common/Toast3d";
import { APP_COLOR, TourItem } from "../../app/type";
import { useUpdateScene } from "../../app/hooks";
import { ConfigCheck } from "../../component/common/ConfigCheck";
import _axios from "../../app/http";

import { MyContext } from "../../app/MyContext";
import { createCss2dLabel, createCss3dLabel } from "../../three/factory3d";

export const Route = createLazyFileRoute("/editor3d/mark")({
  component: RouteComponent,
});

function RouteComponent() {
  const [markName, setMarkName] = useState("mark");
  const [logo, setLogo] = useState<string>("geo-alt");
  const [listTour, setListTour] = useState([]);
  const { dispatchTourWindow } = useContext(MyContext);
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  if (scene.payload.userData.config3d === undefined) {
    return;
  }

  function addMark(label: CSS3DSprite | CSS2DObject) {
    const scene = getScene();
    const MARK_LABEL_GROUP = createGroupIfNotExist(scene, "MARK_LABEL_GROUP");

    if (!MARK_LABEL_GROUP) return;

    MARK_LABEL_GROUP.add(label);
    scene.add(MARK_LABEL_GROUP);
  }
  useEffect(() => {
    _axios.get("/pano/page?size=1000").then((res) => {
      if (res.data.code === 200) {
        const { records } = res.data.result;
        setListTour(records);
      } else {
        Toast3d(res.data.message, "提示", APP_COLOR.Danger);
      }
    });
  }, []);

  const { config3d } = scene.payload.userData;

  return (
    <Container fluid className="ms-2 mt-2">
      <Row>
        <Col xl={12}>
          <ListGroup horizontal>
            <ListGroup.Item>
              <ConfigCheck
                label="2D标签"
                configKey="css2d"
                callBack={clearOldLabel}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <ConfigCheck
                label="3D标签"
                configKey="css3d"
                callBack={clearOldLabel}
              />
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col xl={8}>
          <InputGroup>
            <div className="d-flex ">
              <i
                className={setClassName(logo)}
                style={{ fontSize: "1.4rem" }}
              ></i>
              <Form.Select
                size="sm"
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
              size="sm"
              placeholder="名称"
              onChange={(e) => {
                setMarkName(e.target.value);
              }}
            />
            <ButtonGroup size="sm">
              <Button
                variant={getButtonColor(themeColor)}
                disabled={!config3d.css2d}
                onClick={() => {
                  addMark(createCss2dLabel(markName, logo));
                  updateScene(getScene());
                }}
              >
                添加2d标记
              </Button>
              <Button
                variant={getButtonColor(themeColor)}
                disabled={!config3d.css2d}
                onClick={() => {
                  Toast3d("待续", "提示", APP_COLOR.Danger);
                }}
              >
                一键2d标记
              </Button>
              <Button
                variant={getButtonColor(themeColor)}
                disabled={!config3d.css3d}
                onClick={() => {
                  addMark(createCss3dLabel(markName, logo));
                  updateScene(getScene());
                }}
              >
                添加3d标记
              </Button>
              <Button
                variant={getButtonColor(themeColor)}
                disabled={!config3d.css3d}
                onClick={() => {
                  Toast3d("待续", "提示", APP_COLOR.Danger);
                }}
              >
                一键3d标记
              </Button>
            </ButtonGroup>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex   flex-wrap">
          {listTour &&
            config3d.css3d &&
            // 修改为明确指定 TourItem 类型
            listTour.map((item: TourItem, index: number) => {
              return (
                <Card className="ms-2" style={{ width: "6rem" }} key={index}>
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
                            id: item.id.toString(),
                            title: item.title,
                          },
                          dispatchTourWindow
                        )
                      );
                      updateScene(getScene());
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
