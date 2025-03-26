import { useEffect, useState } from "react";
import { ItemInfo } from "../Editor/ListCard";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { Button, ButtonGroup, Card, Container } from "react-bootstrap";
import Viewer3d from "../../viewer3d/Viewer3d";
import Toast3d from "./Toast3d";
import {
  base64ToBlob,
  blobToFile,
  getButtonColor,
  setClassName,
} from "../../app/utils";
import { takeScreenshot } from "../../three/init3dViewer";
import _axios, { loadAssets } from "../../app/http";
import { APP_COLOR } from "../../app/type";

import { getScene } from "../../three/init3dEditor";

import { setEnableScreenshot } from "../../three/config3d";

export default function EditorForm({
  item,
  getNewItem,
}: {
  item: ItemInfo;
  getNewItem: (item: ItemInfo) => void;
}) {
  const [_item, _setItem] = useState<ItemInfo>({ ...item });
  const [imgBase64, setImgBase64] = useState("");
  const scene = getScene();
  //const { themeColor } = getThemeByScene(scene);
  const { themeColor } = scene.userData.APP_THEME;
  const buttonColor = getButtonColor(themeColor);
  const [loadScene, setLoadScene] = useState<boolean>(false);
  useEffect(() => {
    getNewItem(_item);
    return () => {
      setEnableScreenshot(false);
    };
  }, [_item, getNewItem]); // 添加 getNewItem 到依赖项数组

  return (
    <Container fluid>
      <InputGroup size="sm">
        <InputGroup.Text id="inputGroup-sizing-sm">名称</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={_item.name}
          type="text"
          value={_item.name}
          onChange={(e) => {
            const item = { ..._item, name: e.target.value };
            _setItem(item);
          }}
        />
      </InputGroup>
      <InputGroup size="sm" className="mt-2">
        <InputGroup.Text id="inputGroup-sizing-sm">类型</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={_item.des}
          type="text"
          disabled={true}
          value={_item.des}
          onChange={(e) => {
            const item = { ..._item, des: e.target.value };
            _setItem(item);
          }}
        />
      </InputGroup>

      <div className="mt-2 d-flex flex-column align-items-center ">
        {loadScene ? (
          <Viewer3d
            canvasStyle={{ height: "300px", width: "300px" }}
            item={item}
          />
        ) : _item.cover?.trim().length > 0 ? (
          <Card.Img
            style={{ height: "300px", width: "300px" }}
            src={loadAssets(item.cover)}
            variant="top"
          />
        ) : (
          <i className="bi bi-image" style={{ fontSize: "11.6rem" }}></i>
        )}
        <ButtonGroup className="mt-2" size="sm">
          <Button
            variant={buttonColor}
            onClick={() => {
              setLoadScene(true);
              setEnableScreenshot(true);
            }}
          >
            <i className={setClassName("box")}></i> 使用场景
          </Button>

          <Button
            variant={buttonColor}
            disabled={!loadScene}
            onClick={() => {
              const imgBase64 = takeScreenshot(300, 300);
              setImgBase64(imgBase64);
              Toast3d("截图成功");
            }}
          >
            <i className={setClassName("camera")}></i> 截图
          </Button>

          <Button
            variant={buttonColor}
            disabled={imgBase64.trim() === ""}
            onClick={() => {
              const blob = base64ToBlob(imgBase64, "image/png");
              const file = blobToFile(blob, "截图.png");
              const formData = new FormData();
              formData.append("file", file);
              _axios
                .post("/material/upload/116", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then((res) => {
                  if (res.data.code !== 200) {
                    Toast3d(res.data.message, "提示", APP_COLOR.Warning);
                    return;
                  }
                  const item = { ..._item, cover: res.data.result.url };
                  _setItem(item);
                  Toast3d(res.data.message, "提示", APP_COLOR.Success);
                })
                .catch((err) => {
                  Toast3d(err.message, "错误", APP_COLOR.Danger);
                });
            }}
          >
            <i className={setClassName("cloud-arrow-up")}></i>
            上传截图
          </Button>
        </ButtonGroup>
      </div>
    </Container>
  );
}
