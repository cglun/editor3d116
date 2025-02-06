import { useState } from "react";
import { ItemInfo } from "../Editor/ListCard";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { Button } from "react-bootstrap";

import Viewer3d from "../../viewer3d/Viewer3d";

import Toast3d from "./Toast3d";
import { getButtonColor } from "../../app/config";
import { setClassName } from "../../app/utils";
import { takeScreenshot } from "../../three/init3d105";

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
  return (
    <>
      <InputGroup size="sm">
        <InputGroup.Text id="inputGroup-sizing-sm">{item.type}</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={_item.name}
          type="text"
          value={_item.name}
          onChange={(e) => {
            const _item = { ...item, name: e.target.value };
            _setItem(_item);
            getNewItem(_item);
          }}
        />
      </InputGroup>

      <div className="mt-2 d-flex flex-column align-items-center">
        <Viewer3d canvasStyle={{ height: "300px", width: "300px" }}></Viewer3d>
        <Button
          className="mt-2"
          variant={getButtonColor()}
          onClick={() => {
            const imgBase64 = takeScreenshot(300, 300);
            const _item = { ...item, imgUrl: imgBase64 };
            _setItem(_item);
            getNewItem(_item);
            Toast3d("截图成功");
          }}
        >
          <i className={setClassName("camera")}></i> 设为封面
        </Button>
      </div>
    </>
  );
}
