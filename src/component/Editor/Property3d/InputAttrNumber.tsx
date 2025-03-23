import { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { Fog, Light, Object3D, PerspectiveCamera, Scene } from "three";
import { fixedEditorLleft } from "../../../app/utils";

export function InputAttrNumber({
  title,
  selected3d,
  attr,
  min,
  max,
  step = 0.1,
  disabled = false,
}: {
  title: string;
  selected3d: Object3D | any;
  min?: number;
  max?: number;
  attr:
    | keyof typeof Scene.prototype
    | keyof typeof Fog.prototype
    | keyof typeof Light.prototype
    | keyof typeof PerspectiveCamera.prototype;
  step: number;
  disabled?: boolean;
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
          min={min}
          max={max}
          disabled={disabled}
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
