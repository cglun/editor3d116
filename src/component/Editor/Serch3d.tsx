import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";

import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";

import { getButtonColor } from "../../app/config";

export function Serch3d({
  list,
  setFilterList,
}: {
  list: any;
  setFilterList: any;
}) {
  const [name, setName] = useState("");

  const color = getButtonColor();
  return (
    <ListGroup.Item>
      <InputGroup>
        <Form.Control
          placeholder="请输入模型名称"
          aria-label="请输入模型名称"
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
          variant={color}
          id="button-addon2"
          onClick={() => {
            const newList = list.filter((item: any) => {
              return item.name.includes(name);
            });
            setFilterList(newList);
          }}
        >
          搜索
        </Button>
      </InputGroup>
    </ListGroup.Item>
  );
}
