import { useEffect, useState } from "react";
import { ItemInfo } from "../Editor/ListCard";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { Button, ButtonGroup } from "react-bootstrap";

import Viewer3d from "../../viewer3d/Viewer3d";

import Toast3d from "./Toast3d";
import { getButtonColor } from "../../app/config";
import { base64ToBlob, blobToFile, setClassName } from "../../app/utils";
import { takeScreenshot } from "../../three/init3dViewer";
import _axios from "../../app/http";
import { APP_COLOR } from "../../app/type";

// interface EditorFormProps {
//   item: ItemInfo;
//   getNewItem: (item: ItemInfo) => void;
//   getScreenShot: (imgUrl: string) => void;
// }

export default function EditorForm({
  item,
  getNewItem,
}: {
  item: ItemInfo;
  getNewItem: (item: ItemInfo) => void;
}) {
  const [_item, _setItem] = useState<ItemInfo>({ ...item });
  const [imgBase64, setImgBase64] = useState("");
  useEffect(() => {
    getNewItem(_item);
  }, [_item]);

  return (
    <>
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

      <div className="mt-2 d-flex flex-column align-items-center">
        <Viewer3d canvasStyle={{ height: "300px", width: "300px" }}></Viewer3d>
        <ButtonGroup className="mt-2">
          <Button
            variant={getButtonColor()}
            onClick={() => {
              const imgBase64 = takeScreenshot(300, 300);
              setImgBase64(imgBase64);

              Toast3d("截图成功");
            }}
          >
            <i className={setClassName("camera")}></i> 截图
          </Button>
          <Button
            variant={getButtonColor()}
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
            上传截图
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}
