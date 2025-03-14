import { useEffect, useState } from "react";
import { Object3D } from "three";
import { getObjectNameByName } from "../../../three/utils";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";

export function InputAttrText({
  title,
  selectedObject,
  attr,
}: {
  title: string;
  selectedObject: Object3D;
  attr: string;
}) {
  const [value, setValue] = useState(getObjectNameByName(selectedObject));

  useEffect(() => {
    setValue(getObjectNameByName(selectedObject));
  }, [selectedObject]);

  return (
    selectedObject &&
    selectedObject.hasOwnProperty(attr) && (
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
            selectedObject.name = e.target.value;
            setValue(e.target.value);
          }}
        />
      </InputGroup>
    )
  );
}
