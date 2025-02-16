import { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  ButtonGroup,
  Dropdown,
  Offcanvas,
  Image,
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
  addGridHelper,
  getScene,
  sceneSerialization,
  setScene,
} from "../../three/init3dEditor";
import { MyContext } from "../../app/MyContext";
import _axios from "../../app/http";
import InputBase from "../common/InputBase";

export default function EditorTop() {
  initThemeColor();
  const themeColor = getThemeColor();
  //打开场景列表
  const [showScene, setShowScene] = useState(false);
  const handleClose = () => setShowScene(false);
  const handleShow = () => setShowScene(true);

  const [appTheme, setAppTheme] = useState(themeColor);
  const { dispatchScene } = useContext(MyContext);
  const [sceneIsSave, setSceneIsSave] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  function saveScene() {
    //移除辅助 TransformHelper
    // scene.children.forEach((item) => {
    //   if (item.userData.type === UserDataType.TransformHelper) {
    //     item.removeFromParent();
    //   }
    // });
    // scene.toJSON();
    // const c = getCamera().toJSON();

    // localStorage.setItem("scene", JSON.stringify(scene));
    // localStorage.setItem("camera", JSON.stringify(c));

    // private Long id;
    // private String name;
    // private String des;
    // private LocalDateTime createTime;
    // private LocalDateTime updateTime;
    // @TableLogic
    // private int deleted;
    // private String dataJson;
    // private String cover;
    // @TableField(exist = false)
    // private MultipartFile file;

    // _axios.post("/material/insert", {
    //   scene: scene.toJSON(),
    //   camera: getCamera().toJSON(),
    // });
    const dataJson = sceneSerialization();

    _axios
      .post("/project/create/", {
        name: "新场景",
        des: "0",
        dataJson: dataJson,
      })
      .catch((res) => {
        Toast3d(res.message);
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
        scene.userData.isSave = true;

        const dataJson = sceneSerialization();
        _axios
          .post("/project/create/", {
            name: scene.userData.sceneName,
            des: "Scene",
            dataJson: dataJson,
          })
          .then((res) => {
            if (res.data.code === 200) {
              setSceneIsSave(false);
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
  useEffect(() => {
    setIsLoading(true);
    _axios.post("/project/pageList/", { size: 1000 }).then((res) => {
      if ((res.data.code = 200)) {
        const list = res.data.data.records;
        const sceneList = list.filter((item: any) => {
          if (item.des === "Scene") {
            return item;
          }
        });
        setList(sceneList);
        setIsLoading(false);
      }
    });
  }, [showScene]);

  return (
    <>
      <Row>
        <Col>
          <Image src="/editor3d/static/images/logo.png" />
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
                localStorage.removeItem("camera");
                localStorage.removeItem("scene");
                const newScene = new Scene();
                setScene(newScene);
                addGridHelper();
                dispatchScene({
                  type: "setScene",
                  payload: newScene,
                });
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
            <ListCard
              list={list}
              setList={setList}
              isLoading={isLoading}
            ></ListCard>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </>
  );
}
