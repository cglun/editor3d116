import { useContext, useState } from "react";
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

import ListCard, { ItemInfo } from "./ListCard";

import { testData1 } from "../../app/testData";
import Toast3d from "../common/Toast3d";
import ModalConfirm3d from "../common/ModalConfirm3d";
import EditorForm from "../common/EditorForm";
import { Scene } from "three";
import { UserDataType } from "../../app/type";
import {
  addGridHelper,
  getCamera,
  getScene,
  setScene,
} from "../../three/init3dEditor";
import { MyContext } from "../../app/MyContext";

export default function EditorTop() {
  initThemeColor();
  const themeColor = getThemeColor();
  //打开场景列表
  const [showScene, setShowScene] = useState(false);
  const handleClose = () => setShowScene(false);
  const handleShow = () => setShowScene(true);

  const [appTheme, setAppTheme] = useState(themeColor);
  const { dispatchScene } = useContext(MyContext);
  function saveScene() {
    const scene = getScene();
    //移除辅助 TransformHelper
    scene.children.forEach((item) => {
      if (item.userData.type === UserDataType.TransformHelper) {
        item.removeFromParent();
      }
    });
    scene.toJSON();
    const c = getCamera().toJSON();

    localStorage.setItem("scene", JSON.stringify(scene));
    localStorage.setItem("camera", JSON.stringify(c));

    Toast3d("保存成功");
  }
  function setTheme(color: string) {
    document.body.setAttribute("data-bs-theme", color);
    localStorage.setItem("app_theme", color);
    setThemeColor(color);
    setAppTheme(color);
  }

  function saveAsNewScene() {
    const item: ItemInfo = {
      id: 0,
      name: "新建场景",
      type: "场景",
      desc: "无",
      imgUrl: "",
    };
    const getNewItem = (newItem: ItemInfo) => {
      item.name = newItem.name;
    };
    ModalConfirm3d(
      {
        title: "另存场景",
        body: <EditorForm item={item} getNewItem={getNewItem} />,
      },
      function () {
        Toast3d("保存成功" + item.name);
      }
    );
  }

  const [list, setList] = useState(testData1);
  return (
    <>
      <Row>
        <Col>
          <Image src="/common/images/logo.png" />
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
              getType={{
                isLoading: false,
                error: false,
              }}
            ></ListCard>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </>
  );
}
