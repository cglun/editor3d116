import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";

import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";

import { getButtonColor, getThemeByScene, setClassName } from "../../app/utils";
import { useUpdateScene } from "../../app/hooks";
import { RecordItem } from "../../app/type";

// 定义一个接口来描述 list 数组中元素的类型
interface SearchableItem {
  name: string;
}

export function Serch3d({
  list,
  setFilterList,
  type = "模型",
}: {
  // 将 list 的类型从 any 改为 SearchableItem[]
  list: RecordItem[];
  setFilterList: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        name: string;
        des: string;
        cover: string;
      }[]
    >
  >;
  type: string;
}) {
  const [name, setName] = useState("");
  const placeholder = `请输入${type}名称`;

  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
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
              const newList = list.filter((item: SearchableItem) => {
                return item.name
                  .toLocaleLowerCase()
                  .includes(value.toLocaleLowerCase());
                // return item.name.toLowerCase().includes(name.toLowerCase());
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
            const newList = list.filter((item: SearchableItem) => {
              return item.name
                .toLocaleLowerCase()
                .includes(name.toLocaleLowerCase());
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
