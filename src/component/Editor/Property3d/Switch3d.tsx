import { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import { Object3D } from "three";

export function Switch3d({
  title,
  selectedObject,
  attr,
}: {
  title: string;
  selectedObject: Object3D | any;
  attr: string;
}) {
  const [checked, setChecked] = useState(selectedObject[attr]);
  useEffect(() => {
    setChecked(selectedObject[attr]);
  }, [selectedObject]);

  return (
    selectedObject.hasOwnProperty(attr) && (
      <div className=" d-flex justify-content-between flex-wrap p-1">
        <span>{title}</span>
        <Form className="ms-2">
          <Form.Check
            type="switch"
            checked={checked}
            onChange={() => {
              selectedObject[attr] = !checked;
              setChecked(!checked);
            }}
          />
        </Form>
      </div>
    )
  );
}
