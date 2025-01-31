import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Color, Euler, Fog, Object3D, Vector3 } from "three";
import { getThemeColor } from "../../app/config";
import Card from "react-bootstrap/esm/Card";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { getObjectNameByName } from "../../three/utils";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import { getScene } from "../../three/init3d116";
import { MyContext } from "../../app/MyContext";
import AlertBase from "../common/AlertBase";
import { APP_COLOR } from "../../app/type";
const step = 0.1;
export function Switch3d({
  title,
  curObj3d,
  attr,
}: {
  title: string;
  curObj3d: Object3D | any;
  attr: string;
}) {
  const [checked, setChecked] = useState(curObj3d[attr]);
  useEffect(() => {
    setChecked(curObj3d[attr]);
  }, [curObj3d]);

  return (
    curObj3d.hasOwnProperty(attr) && (
      <div className=" d-flex justify-content-between flex-wrap p-1">
        <span>{title}</span>
        <Form className="ms-2">
          <Form.Check
            type="switch"
            checked={checked}
            onChange={() => {
              curObj3d[attr] = !checked;
              setChecked(!checked);
            }}
          />
        </Form>
      </div>
    )
  );
}

export function Object3dInput({
  transform,
  title = "位置",
}: {
  transform: Vector3 | Euler;
  title?: string;
}) {
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
            title={transform.x.toString()}
            onChange={(e) => {
              setValue(parseFloat(e.target.value));
              transform.x = parseFloat(e.target.value);
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
            disabled={_isScale && checked}
            title={
              _isScale && checked
                ? lockValue.toString()
                : transform.y.toString()
            }
            onChange={(e) => {
              setValue(parseFloat(e.target.value));
              transform.y = parseFloat(e.target.value);
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
            step={step}
            disabled={_isScale && checked}
            title={
              _isScale && checked
                ? lockValue.toString()
                : transform.z.toString()
            }
            onChange={(e) => {
              setValue(parseFloat(e.target.value));
              transform.z = parseFloat(e.target.value);
            }}
          />
        </InputGroup>
      </Card.Body>
    </Card>
  );
}
export function AttrInputNumber({
  title,
  curObj3d,
  attr,
}: {
  title: string;
  curObj3d: Object3D | any;
  attr: string;
}) {
  return (
    curObj3d &&
    curObj3d.hasOwnProperty(attr) && (
      <InputGroup size="sm">
        <InputGroup.Text>{title}</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={curObj3d[attr].toString()}
          type="number"
          step={step}
          title={curObj3d[attr].toString()}
          onChange={(e) => {
            curObj3d[attr] = parseFloat(e.target.value);
          }}
        />
      </InputGroup>
    )
  );
}

export function AttrInputText({
  title,
  curObj3d,
  attr,
}: {
  title: string;
  curObj3d: Object3D;
  attr: string;
}) {
  const [value, setValue] = useState(getObjectNameByName(curObj3d));
  useEffect(() => {
    setValue(getObjectNameByName(curObj3d));
  }, [curObj3d]);

  return (
    curObj3d &&
    curObj3d.hasOwnProperty(attr) && (
      <InputGroup size="sm">
        <InputGroup.Text>{title}</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={value}
          type="text"
          value={value}
          title={value}
          onChange={(e) => {
            curObj3d.name = e.target.value;
            setValue(e.target.value);
          }}
        />
      </InputGroup>
    )
  );
}

function sceneProperty(curObj3d: Object3D | any) {
  const { dispatchScene } = useContext(MyContext);
  const backgroundColor = curObj3d.background?.getHexString()
    ? curObj3d.background?.getHexString()
    : "000000";
  const fogColor = curObj3d.fog?.color.getHexString()
    ? curObj3d.background?.getHexString()
    : "000000";
  return (
    <>
      <InputGroup size="sm">
        <InputGroup.Text>背景色</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          type="color"
          value={"#" + backgroundColor}
          onChange={(e) => {
            curObj3d.background = new Color(e.target.value);
            dispatchScene({
              type: "setScene",
              payload: getScene(),
            });
          }}
        />
      </InputGroup>
      <InputGroup size="sm">
        <InputGroup.Text>雾气色</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          type="color"
          value={"#" + fogColor}
          onChange={(e) => {
            if (curObj3d.fog === null) {
              curObj3d.fog = new Fog(e.target.value, 0, 20);
            } else {
              curObj3d.fog.color = new Color(e.target.value);
            }
            dispatchScene({
              type: "setScene",
              payload: getScene(),
            });
          }}
        />
      </InputGroup>
      <AttrInputNumber
        title={"雾气近端"}
        curObj3d={curObj3d.fog}
        attr={"near"}
      ></AttrInputNumber>
      <AttrInputNumber
        title={"雾气远端"}
        curObj3d={curObj3d.fog}
        attr={"far"}
      ></AttrInputNumber>
      <Button
        variant={getThemeColor()}
        onClick={() => {
          curObj3d.fog = null;
        }}
      >
        重置雾气
      </Button>
    </>
  );
}

function commonProperty(curObj3d: Object3D | any) {
  return (
    curObj3d && (
      <>
        <Object3dInput
          transform={curObj3d.position}
          title={"位置"}
        ></Object3dInput>
        <Object3dInput
          transform={curObj3d.rotation}
          title={"旋转"}
        ></Object3dInput>
        <Object3dInput
          transform={curObj3d.scale}
          title={"缩放"}
        ></Object3dInput>

        <Card>
          <Card.Header>其他属性</Card.Header>
          <Card.Body>
            <AttrInputText
              title={"名称"}
              curObj3d={curObj3d}
              attr={"name"}
            ></AttrInputText>
            <AttrInputNumber
              title="亮度"
              curObj3d={curObj3d}
              attr={"intensity"}
            />
            {!curObj3d.isAmbientLight && (
              <ButtonGroup className=" d-flex justify-content-between flex-wrap">
                <Switch3d
                  title={"投射阴影"}
                  curObj3d={curObj3d}
                  attr={"castShadow"}
                ></Switch3d>

                <Switch3d
                  title={"接收阴影"}
                  curObj3d={curObj3d}
                  attr={"receiveShadow"}
                />
              </ButtonGroup>
            )}
          </Card.Body>
        </Card>
      </>
    )
  );
}

export default function ObjectPropertyChild({
  curObj3d,
}: {
  curObj3d: Object3D | any;
}) {
  if (curObj3d) {
    if (curObj3d.isScene) {
      return sceneProperty(curObj3d);
    }
    if (curObj3d.isCamera) {
      return cameraProperty();
    }
    return commonProperty(curObj3d);
  }
}

function cameraProperty() {
  return <AlertBase type={APP_COLOR.Info} text={"默认属性"} />;
}

function isScale(title: string) {
  return "缩放" === title ? true : false;
}
