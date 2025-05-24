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
import { getThemeByScene } from "../../app/utils";

import ListCard from "./ListCard";
import Toast3d from "../common/Toast3d";
import ModalConfirm3d from "../common/ModalConfirm3d";
import { Color } from "three";
import { APP_COLOR, RecordItem } from "../../app/type";
import {
  getScene,
  sceneSerialization,
  setScene,
} from "../../three/init3dEditor";
import axios from "../../app/http";
import InputBase from "../common/InputBase";
import { useUpdateScene } from "../../app/hooks";
import { Serch3d } from "./Serch3d";

import { createNewScene } from "../../three/factory3d";
import { useLocation, useNavigate } from "@tanstack/react-router";
import Icon from "../common/Icon";

export default function EditorTop() {
  //打开场景列表
  const [showScene, setShowScene] = useState(false);
  const handleClose = () => setShowScene(false);
  const handleShow = () => setShowScene(true);
  const { scene, updateScene } = useUpdateScene();
  const [list, setList] = useState<RecordItem[]>([]);
  const [error, setError] = useState("");
  const [filterList, setFilterList] = useState<RecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { themeColor, iconFill, sceneCanSave } = getThemeByScene(scene);
  document.body.setAttribute("data-bs-theme", themeColor);
  const logoUrl = new URL("/static/images/logo.png", import.meta.url).href;
  const navigate = useNavigate();
  const location = useLocation();

  function notJavascript() {
    const userData = getScene().userData;
    if (!userData || !userData.javascript) {
      return false;
    }
    try {
      // eval(userData.javascript);
    } catch (error) {
      Toast3d("查看控制台!", "脚本错误", APP_COLOR.Danger);
      console.error(error);
      return true;
    }
  }

  function saveScene() {
    const dataJson = sceneSerialization();
    if (notJavascript()) {
      return;
    }

    axios
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
    if (notJavascript()) {
      return;
    }
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
        axios
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

  useEffect(() => {
    setIsLoading(true);

    axios
      .post("/project/pageList/", { size: 1000 })
      .then((res) => {
        if (res.data.code === 200) {
          const message = res.data.message;
          if (message) {
            setError(message);
            return;
          }
          const list = res.data.data.records;
          const sceneList = list.filter((item: RecordItem) => {
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
        <Navbar.Brand
          className="d-flex"
          style={{ padding: 0, marginRight: "0" }}
        >
          <Image style={{ width: "1.6rem" }} src={logoUrl} title="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <ButtonGroup size="sm">
              <Button variant={themeColor} onClick={handleShow}>
                <Icon iconName="badge-3d" />
                切换场景
              </Button>
            </ButtonGroup>{" "}
            {scene.payload.userData.sceneName && (
              <Stack direction="horizontal" gap={2}>
                <Badge bg={APP_COLOR.Secondary}>
                  {scene.payload.userData.sceneName}【id:
                  {scene.payload.userData.projectId}】
                </Badge>
              </Stack>
            )}
          </Nav>
          <Nav className="me-2">
            <ButtonGroup aria-label="Basic example" size="sm">
              <Button
                variant={themeColor}
                onClick={() => {
                  navigate({
                    to: location.pathname,
                  });
                  const newScene = createNewScene();
                  Toast3d("场景已新建");
                  setScene(newScene);
                  updateScene(newScene);
                }}
              >
                <Icon iconName="plus-square" />
                新建场景
              </Button>
              <Button
                variant={themeColor}
                disabled={!sceneCanSave}
                onClick={() => {
                  saveScene();
                }}
              >
                <Icon iconName="floppy" />
                保存场景
              </Button>
              <Button
                variant={themeColor}
                onClick={() => {
                  saveAsNewScene();
                }}
              >
                <Icon iconName="floppy2" />
                场景另存
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
                      <Icon iconName="sun" />
                    ) : (
                      <Icon iconName="moon-stars" />
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
                        <Icon iconName="sun" />
                        白天模式
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
                        <Icon iconName="moon-stars" />
                        黑夜模式
                      </Dropdown.Item>
                    )}
                    {iconFill === "-fill" ? (
                      <Dropdown.Item
                        onClick={() => {
                          setThemeIcons("");
                        }}
                      >
                        <Icon iconName="bi bi-emoji-expressionless" />
                        空心图标
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item
                        onClick={() => {
                          setThemeIcons("-fill");
                        }}
                      >
                        <Icon iconName="bi bi-emoji-expressionless-fill" />
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
                <Icon iconName="camera-video" />
                教程
              </Button>
            </ButtonGroup>
          </Nav>
        </Navbar.Collapse>
        {showScene && (
          <Offcanvas show={showScene} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                <Icon iconName="badge-3d" />
                所有场景
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
