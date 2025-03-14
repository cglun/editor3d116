import { useState } from "react";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { Euler, Vector3 } from "three";

export function Input3d({
  transform,
  title = "位置",
  step = 0.1,
}: {
  transform: Vector3 | Euler;
  title: string;
  step: number;
}) {
  if (!transform) {
    return;
  }

  const [checked, setChecked] = useState(true);
  const [lockValue, setLockValue] = useState(0);
  const _isScale = isScale(title);
  function setValue(value: number) {
    if (checked && _isScale) {
      setLockValue(value);
      transform.x = value;
      transform.y = value;
      transform.z = value;
      return;
    }
  }
  function isScale(title: string) {
    return "缩放" === title ? true : false;
  }
  const [transformX, setTransformX] = useState(transform.x);
  const [transformY, setTransformY] = useState(transform.y);
  const [transformZ, setTransformZ] = useState(transform.z);
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <span>{title}</span>
        {_isScale && (
          <Form>
            <Form.Check // prettier-ignore
              type="switch"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
            />
          </Form>
        )}
      </Card.Header>
      <Card.Body className="d-flex">
        <InputGroup size="sm">
          <InputGroup.Text>X</InputGroup.Text>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            placeholder={transform.x.toString()}
            type="number"
            step={step}
            value={transformX.toString()}
            title={transformX.toString()}
            onChange={(e) => {
              const x = parseFloat(e.target.value);
              setValue(x);
              setTransformX(x);
              transform.x = x;
            }}
          />
        </InputGroup>
        <InputGroup size="sm">
          <InputGroup.Text>Y</InputGroup.Text>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            placeholder={transform.y.toString()}
            type="number"
            step={step}
            value={transformY.toString()}
            disabled={_isScale && checked}
            title={
              _isScale && checked
                ? lockValue.toString()
                : transform.y.toString()
            }
            onChange={(e) => {
              const y = parseFloat(e.target.value);
              setValue(y);
              setTransformY(y);
              transform.y = y;
            }}
          />
        </InputGroup>
        <InputGroup size="sm">
          <InputGroup.Text>Z</InputGroup.Text>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            placeholder={transform.z.toString()}
            type="number"
            value={transformZ.toString()}
            step={step}
            disabled={_isScale && checked}
            title={
              _isScale && checked
                ? lockValue.toString()
                : transform.z.toString()
            }
            onChange={(e) => {
              const z = parseFloat(e.target.value);
              setValue(z);
              setTransformZ(z);
              transform.z = z;
            }}
          />
        </InputGroup>
      </Card.Body>
    </Card>
  );
}
