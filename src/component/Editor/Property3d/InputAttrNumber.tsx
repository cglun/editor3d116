import { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";

// 严格约束泛型 T，确保 T 的所有属性值类型为 number
export function InputAttrNumber<T>({
  title,
  selected3d,
  attr,
  min,
  max,
  step = 0.1,
  disabled = false,
}: {
  title: string;
  selected3d: T;
  min?: number;
  max?: number;
  attr: keyof T;
  step: number;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    // 修改为使用 Object.prototype.hasOwnProperty.call
    if (selected3d && Object.prototype.hasOwnProperty.call(selected3d, attr)) {
      setValue(selected3d[attr] as number);
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
          placeholder={"属性：" + attr.toString()}
          type="number"
          step={step}
          title={"属性：" + attr.toString()}
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(e) => {
            const _value = parseFloat(e.target.value);
            if (Number.isNaN(_value)) {
              return;
            }
            // 创建一个新对象来避免直接修改原始对象
            //@ts-ignore
            selected3d[attr] = _value;
            setValue(_value);
          }}
        />
      </InputGroup>
    )
  );
}
