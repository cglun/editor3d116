import { useEffect, useState } from "react";
import { Object3D } from "three";
import { getObjectNameByName } from "../../../three/utils";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { EditorObject3d } from "../../../app/type";

export function InputAttrText({
  title,
  selected3d,
}: {
  title: string;
  selected3d: EditorObject3d;
  attr: keyof typeof Object3D.prototype;
}) {
  const [value, setValue] = useState(getObjectNameByName(selected3d));

  useEffect(() => {
    setValue(getObjectNameByName(selected3d));
  }, [selected3d]);

  return (
    selected3d && (
      <InputGroup size="sm">
        <InputGroup.Text>{title}</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          type="text"
          placeholder={value}
          value={value}
          title={value}
          onChange={(e) => {
            selected3d.name = e.target.value;
            setValue(e.target.value);
          }}
        />
      </InputGroup>
    )
  );
}
