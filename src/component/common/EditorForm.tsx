import { useState } from "react";
import { ItemInfo } from "../ListCard";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";

interface EditorFormProps {
  item: ItemInfo;
  getNewItem: (item: ItemInfo) => void;
}

export default function EditorForm(editorFormProps: EditorFormProps) {
  const { item, getNewItem } = editorFormProps;
  const [_item, _setItem] = useState<ItemInfo>({ ...item });
  return (
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
  );
}
