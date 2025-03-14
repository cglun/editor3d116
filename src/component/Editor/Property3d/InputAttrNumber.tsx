import { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { Object3D } from "three";

export function InputAttrNumber({
  title,
  selectedObject,
  attr,
}: {
  title: string;
  selectedObject: Object3D | any;
  attr: string;
}) {
  const [value, setValue] = useState(0);
  const step = 0.01;

  useEffect(() => {
    if (selectedObject) {
      setValue(selectedObject[attr]);
    }
  }, [selectedObject]);

  return (
    selectedObject &&
    selectedObject.hasOwnProperty(attr) && (
      <InputGroup size="sm">
        <InputGroup.Text>{title}</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={selectedObject[attr].toString()}
          type="number"
          step={step}
          value={value}
          title={selectedObject[attr].toString()}
          onChange={(e) => {
            selectedObject[attr] = parseFloat(e.target.value);
            setValue(parseFloat(e.target.value));
          }}
        />
      </InputGroup>
    )
  );
}
