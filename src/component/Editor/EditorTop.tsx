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
import { setClassName } from "../../app/utils";
import { getThemeColor, initThemeColor, setThemeColor } from "../../app/config";
import ListCard from "./ListCard";
import { testData1 } from "../../app/testData";
import Toast3d from "../common/Toast3d";
import ModalConfirm3d from "../common/ModalConfirm3d";
import { Scene } from "three";
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
import { userData } from "../../three/config3d";
import {
  createDirectionalLight,
  createGridHelper,
} from "../../three/factory3d";

export default function EditorTop() {
  initThemeColor();
  const themeColor = getThemeColor();
  //打开场景列表
  const [showScene, setShowScene] = useState(false);
  const handleClose = () => setShowScene(false);
  const handleShow = () => setShowScene(true);

  const [appTheme, setAppTheme] = useState(themeColor);
  const { updateScene } = useUpdateScene();
  const [sceneIsSave, setSceneIsSave] = useState(true);

  useEffect(() => {
    const scene = getScene();

    if (scene?.userData.canSave) {
      setSceneIsSave(!scene.userData.canSave);
    }
  }, [getScene()]);

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
  function setTheme(color: string) {
    document.body.setAttribute("data-bs-theme", color);
    localStorage.setItem("app_theme", color);
    setThemeColor(color);
    setAppTheme(color);
  }

  function saveAsNewScene() {
    const scene = getScene();

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
                const newScene = new Scene();
                newScene.userData = userData;
                newScene.add(createGridHelper());
                newScene.add(createDirectionalLight());
                setScene(newScene);
                setSceneIsSave(true);
                updateScene(newScene);
              }}
            >
              <i className={setClassName("plus-square")}></i> 新建场景
            </Button>
            <Button
              variant={themeColor}
              size="sm"
              disabled={sceneIsSave}
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
                {appTheme === "light" ? (
                  <i className={setClassName("sun")}></i>
                ) : (
                  <i className={setClassName("moon-stars")}></i>
                )}
                模式
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setTheme("light");
                  }}
                >
                  <i className={setClassName("sun")}></i>白天
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setTheme("dark");
                  }}
                >
                  <i className={setClassName("moon-stars")}></i>黑夜
                </Dropdown.Item>
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
