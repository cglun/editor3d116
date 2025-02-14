import { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";

export default function InputBase({
  name = "新场景",
  des = "场景描述",
  placeholder = "场景名",
  getValue = function (_name: string, _des: string) {},
}) {
  const [sceneName, setSceneName] = useState(name);
  const [sceneDes, setSceneDes] = useState(des);
  useEffect(() => {
    getValue(sceneName, sceneDes);
  }, [sceneDes, sceneName]);

  return (
    <>
      <InputGroup size="sm">
        <InputGroup.Text id="inputGroup-sizing-sm">名称</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={placeholder}
          type="text"
          value={sceneName}
          onChange={(e) => {
            setSceneName(() => e.target.value);
          }}
        />
      </InputGroup>
      <InputGroup size="sm" className="mt-2">
        <InputGroup.Text id="inputGroup-sizing-sm">类型</InputGroup.Text>
        <Form.Control
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder={placeholder}
          type="text"
          disabled={true}
          value={sceneDes}
          onChange={(e) => {
            setSceneDes(() => e.target.value);
          }}
        />
      </InputGroup>
    </>
  );
}
