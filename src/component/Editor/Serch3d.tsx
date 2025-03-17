import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";

import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";

import { getButtonColor } from "../../app/config";
import { getThemeByScene, setClassName } from "../../app/utils";
import { useUpdateScene } from "../../app/hooks";

export function Serch3d({
  list,
  setFilterList,
  type = "模型",
}: {
  list: any;
  setFilterList: any;
  type: string;
}) {
  const [name, setName] = useState("");
  const placeholder = `请输入${type}名称`;

  const { scene } = useUpdateScene();
  let { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

  return (
    <ListGroup.Item>
      <InputGroup>
        <Form.Control
          placeholder={placeholder}
          aria-label={placeholder}
          aria-describedby="basic-addon2"
          value={name}
          onChange={(e) => {
            const value = e.target.value;
            setName(value);
            if (value.trim() === "") {
              setFilterList(list);
            } else {
              const newList = list.filter((item: any) => {
                return item.name.includes(value);
              });

              setFilterList(newList);
            }
          }}
        />
        <Button
          variant={buttonColor}
          id="button-addon2"
          title="搜索"
          onClick={() => {
            const newList = list.filter((item: any) => {
              return item.name.includes(name);
            });
            setFilterList(newList);
          }}
        >
          <i className={setClassName("search-heart")}></i>
        </Button>
      </InputGroup>
    </ListGroup.Item>
  );
}
