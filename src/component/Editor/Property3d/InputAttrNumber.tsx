import { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { Fog, Light, Object3D, PerspectiveCamera, Scene } from "three";

export function InputAttrNumber({
  title,
  selected3d,
  attr,
  step = 0.1,
}: {
  title: string;
  selected3d: Object3D | any;
  attr:
    | keyof typeof Scene.prototype
    | keyof typeof Fog.prototype
    | keyof typeof Light.prototype
    | keyof typeof PerspectiveCamera.prototype;
  step: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (selected3d && selected3d.hasOwnProperty(attr)) {
      setValue(selected3d[attr]);
    }
  }, [selected3d]);

  return (
    selected3d &&
    selected3d.hasOwnProperty(attr) && (
      <InputGroup size="sm">
        <InputGroup.Text>{title}</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={selected3d[attr].toString()}
          type="number"
          step={step}
          title={"属性：" + attr}
          value={value}
          onChange={(e) => {
            const _value = parseFloat(e.target.value);
            if (Number.isNaN(_value)) {
              return;
            }
            selected3d[attr] = _value;
            setValue(_value);
          }}
        />
      </InputGroup>
    )
  );
}
