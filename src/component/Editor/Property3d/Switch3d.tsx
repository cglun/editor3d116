import { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import { Object3D } from "three";

export function Switch3d({
  title,
  selected3d,
  attr,
}: {
  title: string;
  selected3d: Object3D | any;
  attr: string;
}) {
  const [checked, setChecked] = useState(selected3d[attr]);
  useEffect(() => {
    setChecked(selected3d[attr]);
  }, [selected3d]);

  return (
    selected3d.hasOwnProperty(attr) && (
      <div className=" d-flex justify-content-between flex-wrap p-1">
        <span>{title}</span>
        <Form className="ms-2">
          <Form.Check
            type="switch"
            checked={checked}
            onChange={() => {
              selected3d[attr] = !checked;
              setChecked(!checked);
            }}
          />
        </Form>
      </div>
    )
  );
}
