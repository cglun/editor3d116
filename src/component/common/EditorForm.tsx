import { useState } from "react";
import { ItemInfo } from "../Editor/ListCard";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { Button, Image } from "react-bootstrap";

import Viewer3d from "../../viewer3d/Viewer3d";
import { takeScreenshot } from "../../three/init3d116";
import Toast3d from "./Toast3d";
import { getButtonColor, getThemeColor } from "../../app/config";
import { setClassName } from "../../app/utils";

interface EditorFormProps {
  item: ItemInfo;
  getNewItem: (item: ItemInfo) => void;
  getScreenShot: (imgUrl: string) => void;
}

export default function EditorForm(editorFormProps: EditorFormProps) {
  const { item, getNewItem, getScreenShot } = editorFormProps;
  const [_item, _setItem] = useState<ItemInfo>({ ...item });

  return (
    <>
      <InputGroup size="sm">
        <InputGroup.Text id="inputGroup-sizing-sm">{item.type}</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={item.name}
          type="text"
          value={_item.name}
          onChange={(e) => {
            const xx = { ..._item, name: e.target.value };
            _setItem(xx);
            getNewItem(xx);
          }}
        />
      </InputGroup>

      <Viewer3d canvasStyle={{ height: "300px", width: "300px" }}></Viewer3d>

      <Button
        className="mt-2"
        variant={getButtonColor()}
        onClick={() => {
          const imgBase64 = takeScreenshot();
          getScreenShot(imgBase64);
          Toast3d("截图成功");
        }}
      >
        <i className={setClassName("camera")}></i> 设为封面
      </Button>
    </>
  );
}
