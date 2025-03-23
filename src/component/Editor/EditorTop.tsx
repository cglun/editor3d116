import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  Offcanvas,
  Image,
  Navbar,
  Nav,
  Badge,
  Stack,
  Container,
} from "react-bootstrap";
import {
  fixedEditorLleft,
  getThemeByScene,
  setClassName,
} from "../../app/utils";

import ListCard from "./ListCard";
import { testData1 } from "../../app/testData";
import Toast3d from "../common/Toast3d";
import ModalConfirm3d from "../common/ModalConfirm3d";
import { Color } from "three";
import { APP_COLOR } from "../../app/type";
import {
  getScene,
  sceneSerialization,
  setScene,
} from "../../three/init3dEditor";
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
          Toast3d("保存成功");
          updateScene(getScene());
        } else {
          Toast3d(res.data.message, "提示", APP_COLOR.Warning);
        }
      })
      .catch((error) => {
        console.error(error);

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
    <Container fluid>
      <div style={{ height: "2rem" }}> </div>
      <Navbar
        expand="lg"
        fixed="top"
        className="bg-body-tertiary"
        style={{ padding: 0 }}
      >
        <Navbar.Brand style={{ padding: 0, marginRight: "0" }}>
          <Image src="/editor3d/static/images/logo.png" title="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <ButtonGroup size="sm">
              <Button
                variant={themeColor}
                onClick={handleShow}
                onMouseEnter={() => {
                  fixedEditorLleft();
                  // handleShow();
                }}
                onMouseLeave={() => {
                  fixedEditorLleft(false);
                }}
              >
                <i className={setClassName("badge-3d")}></i> 切换场景
              </Button>
            </ButtonGroup>{" "}
            {scene.payload.userData.sceneName && (
              <Stack direction="horizontal" gap={2}>
                <Badge bg={APP_COLOR.Secondary}>
                  当前：{scene.payload.userData.sceneName}
                </Badge>
              </Stack>
            )}
          </Nav>
          <Nav className="me-2">
            <ButtonGroup aria-label="Basic example" size="sm">
              <Button
                variant={themeColor}
                onClick={() => {
                  const newScene = createNewScene();
                  setScene(newScene);
                  updateScene(newScene);
                }}
              >
                <i className={setClassName("plus-square")}></i> 新建场景
              </Button>
              <Button
                variant={themeColor}
                disabled={!sceneCanSave}
                onClick={() => {
                  saveScene();
                }}
              >
                <i className={setClassName("floppy")}></i> 保存场景
              </Button>
              <Button
                variant={themeColor}
                onClick={() => {
                  saveAsNewScene();
                }}
              >
                <i className={setClassName("floppy2")}></i> 场景另存
              </Button>
              <Button
                as="div"
                variant={themeColor}
                style={{ paddingLeft: "0", paddingRight: "0" }}
              >
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
                    主题
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {themeColor === APP_COLOR.Dark ? (
                      <Dropdown.Item
                        onClick={() => {
                          setThemeByBtn(APP_COLOR.Light);
                          const scene = getScene();
                          const enableColor = scene.background instanceof Color;
                          if (enableColor) {
                            scene.background = new Color("#eee");
                          }
                        }}
                      >
                        <i className={setClassName("sun")}></i> 白天模式
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item
                        onClick={() => {
                          setThemeByBtn(APP_COLOR.Dark);
                          const scene = getScene();
                          // const { asBackground } = scene.userData.backgroundHDR;
                          const enableColor = scene.background instanceof Color;
                          if (enableColor) {
                            scene.background = new Color("#000116");
                          }
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
                        <i className={"bi bi-emoji-expressionless"}></i>{" "}
                        空心图标
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item
                        onClick={() => {
                          setThemeIcons("-fill");
                        }}
                      >
                        <i className={"bi bi-emoji-expressionless-fill"}></i>
                        填充图标
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Button>
              <Button
                variant={themeColor}
                onClick={() => {
                  Toast3d("待续", "提示", APP_COLOR.Warning);
                  window.open(
                    "https://pan.xunlei.com/s/VOM1WYs9m_wKSBf8MM7ZhKMjA1?pwd=76k8#",
                    "_blank"
                  );
                }}
              >
                <i className={setClassName("camera-video")}></i> 教程
              </Button>
            </ButtonGroup>
          </Nav>
        </Navbar.Collapse>
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
              />
            </Offcanvas.Body>
          </Offcanvas>
        )}
      </Navbar>
    </Container>
  );
}
