import { useEffect, useState } from "react";
import { Object3D } from "three";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { SelectedObject } from "../../../app/type";

export function InputAttrText({
  title,
  selected3d,
  attr,
}: {
  title: string;
  selected3d: SelectedObject;
  attr: keyof typeof Object3D.prototype;
}) {
  const [value, setValue] = useState("");
  useEffect(() => {
    // 先检查 selected3d 是否为 null 或 undefined
    if (
      selected3d != null &&
      Object.prototype.hasOwnProperty.call(selected3d, attr)
    ) {
      setValue(selected3d[attr] as string);
    }
  }, [selected3d, attr]); // 添加 'attr' 到依赖项数组

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
            const _value = e.target.value;
            //@ts-expect-error
            selected3d[attr] = _value;
            setValue(_value);
          }}
        />
      </InputGroup>
    )
  );
}
