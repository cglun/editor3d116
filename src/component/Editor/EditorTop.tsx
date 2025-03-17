import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  ButtonGroup,
  Dropdown,
  Offcanvas,
  Image,
  Container,
} from "react-bootstrap";
import { getThemeByScene, setClassName } from "../../app/utils";

import ListCard from "./ListCard";
import { testData1 } from "../../app/testData";
import Toast3d from "../common/Toast3d";
import ModalConfirm3d from "../common/ModalConfirm3d";
import { Color } from "three";
import { APP_COLOR } from "../../app/type";
import { getScene, sceneSerialization } from "../../three/init3dEditor";
import _axios from "../../app/http";
import InputBase from "../common/InputBase";
import { useUpdateScene } from "../../app/hooks";
import { Serch3d } from "./Serch3d";

import { createNewScene } from "../../three/factory3d";

export default function EditorTop() {
  //打开场景列表
  const [showScene, setShowScene] = useState(false);
  const handleClose = () => setShowScene(false);
  const handleShow = () => setShowScene(true);
  const { scene, updateScene } = useUpdateScene();
  let { themeColor, iconFill, sceneCanSave } = getThemeByScene(scene);
  document.body.setAttribute("data-bs-theme", themeColor);
  function saveScene() {
    const dataJson = sceneSerialization();
    _axios
      .post("/project/update/", {
        id: getScene().userData.projectId,
        dataJson: dataJson,
      })
      .then((res) => {
        if (res.data.code === 200) {
          // setSceneIsSave(false);
          Toast3d("保存成功");
        } else {
          Toast3d(res.data.message, "提示", APP_COLOR.Warning);
        }
      })
      .catch((error) => {
        Toast3d("错误:" + error, "提示", APP_COLOR.Warning);
      });
  }
  function setThemeByBtn(color: APP_COLOR) {
    document.body.setAttribute("data-bs-theme", color);
    const scene = getScene();
    const { APP_THEME } = scene.userData;
    APP_THEME.themeColor = color;
    updateScene(scene);
  }
  function setThemeIcons(color: string) {
    const scene = getScene();
    const { APP_THEME } = scene.userData;
    APP_THEME.iconFill = color;
    updateScene(scene);
  }

  function saveAsNewScene() {
    const scene = getScene();
    scene.userData.APP_THEME.sceneCanSave = true;
    function getValue(sceneName: string, des: string) {
      scene.userData.sceneName = sceneName;
      scene.userData.des = des;
    }

    ModalConfirm3d(
      {
        title: "另存场景",
        body: (
          <InputBase
            getValue={getValue}
            name={scene.userData.sceneName}
            des={"Scene"}
          ></InputBase>
        ),
      },
      function () {
        const dataJson = sceneSerialization();
        _axios
          .post("/project/create/", {
            name: scene.userData.sceneName,
            des: "Scene",
            dataJson: dataJson,
          })
          .then((res) => {
            if (res.data.code === 200) {
              // setSceneIsSave(false);
              Toast3d("保存成功");
            } else {
              Toast3d(res.data.message, "提示", APP_COLOR.Warning);
            }
          })
          .catch((error) => {
            Toast3d(error, "提示", APP_COLOR.Warning);
          });
      }
    );
  }

  const [list, setList] = useState(testData1);
  const [error, setError] = useState("");
  const [filterList, setFilterList] = useState(testData1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    _axios
      .post("/project/pageList/", { size: 1000 })
      .then((res) => {
        if ((res.data.code = 200)) {
          const message = res.data.message;
          if (message) {
            setError(message);
            return;
          }
          const list = res.data.data.records;
          const sceneList = list.filter((item: any) => {
            if (item.des === "Scene") {
              return item;
            }
          });
          setList(sceneList);
          setIsLoading(false);
          setFilterList(sceneList);
        }
      })
      .catch((error) => {
        console.log(error);

        Toast3d("error", error, APP_COLOR.Danger);
      });
  }, [showScene]);

  return (
    <Container
      fluid
      className="fixed-top"
      style={{ backgroundColor: "var(--bs-body-bg)" }}
    >
      <Row>
        <Col>
          <Image src="/editor3d/static/images/logo.png" title="logo" />
          <Button variant={themeColor} size="sm" onClick={handleShow}>
            <i className={setClassName("bi me-1 bi-badge-3d")}></i>切换场景
          </Button>
        </Col>

        <Col className="d-flex justify-content-end">
          <ButtonGroup aria-label="Basic example">
            <Button
              variant={themeColor}
              size="sm"
              onClick={() => {
                const newScene = createNewScene();
                updateScene(newScene);
              }}
            >
              <i className={setClassName("plus-square")}></i> 新建场景
            </Button>
            <Button
              variant={themeColor}
              size="sm"
              disabled={!sceneCanSave}
              onClick={() => {
                saveScene();
              }}
            >
              <i className={setClassName("floppy")}></i> 保存场景
            </Button>
            <Button
              variant={themeColor}
              size="sm"
              onClick={() => {
                saveAsNewScene();
              }}
            >
              <i className={setClassName("floppy2")}></i> 场景另存
            </Button>

            <Button variant={themeColor} size="sm">
              <i className={setClassName("dash-circle")}></i> 待续
            </Button>
          </ButtonGroup>
          <>
            <Dropdown className="d-inline">
              <Dropdown.Toggle
                id="dropdown-autoclose-true"
                variant={themeColor}
                size="sm"
              >
                {themeColor === "light" ? (
                  <i className={setClassName("sun")}></i>
                ) : (
                  <i className={setClassName("moon-stars")}></i>
                )}
                模式
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {themeColor === APP_COLOR.Dark ? (
                  <Dropdown.Item
                    onClick={() => {
                      setThemeByBtn(APP_COLOR.Light);
                      const scene = getScene();
                      scene.background = new Color("#eee");
                    }}
                  >
                    <i className={setClassName("sun")}></i> 白天模式
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item
                    onClick={() => {
                      setThemeByBtn(APP_COLOR.Dark);
                      const scene = getScene();
                      scene.background = new Color("#000116");
                    }}
                  >
                    <i className={setClassName("moon-stars")}></i> 黑夜模式
                  </Dropdown.Item>
                )}
                {iconFill === "-fill" ? (
                  <Dropdown.Item
                    onClick={() => {
                      setThemeIcons("");
                    }}
                  >
                    <i className={"bi bi-emoji-expressionless"}></i> 空心图标
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item
                    onClick={() => {
                      setThemeIcons("-fill");
                    }}
                  >
                    <i className={"bi bi-emoji-expressionless-fill"}></i>{" "}
                    填充图标
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </>
        </Col>
      </Row>
      {showScene && (
        <Offcanvas show={showScene} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <i className={setClassName("badge-3d")}></i> 所有场景
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Serch3d list={list} setFilterList={setFilterList} type="场景" />
            <ListCard
              list={filterList}
              setList={setFilterList}
              isLoading={isLoading}
              error={error}
            ></ListCard>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </Container>
  );
}
