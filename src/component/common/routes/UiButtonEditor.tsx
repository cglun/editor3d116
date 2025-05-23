import {
  Badge,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import {
  ActionItemMap,
  APP_COLOR,
  CustomButtonListType,
  CustomButtonType,
} from "../../../app/type";
import { setClassName } from "../../../app/utils";

export default function UiButtonEditor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  let customButtonList: CustomButtonListType | null = null;
  try {
    // 尝试解析 JSON 字符串
    customButtonList = JSON.parse(value);
  } catch (error) {
    console.log("解析JSON 字符串", error);
  }
  if (customButtonList === null) {
    return null; // 返回 null 避免潜在警告
  }
  const toggleButtonGroup = customButtonList.toggleButtonGroup?.listGroup || [];
  const roamButtonGroup = customButtonList.roamButtonGroup?.listGroup || [];

  // 更新按钮组数据的通用函数
  function updateButtonGroup(
    buttonGroupKey: "toggleButtonGroup" | "roamButtonGroup",
    index: number,
    updateFn: (item: ActionItemMap) => ActionItemMap
  ) {
    // 创建 customButtonList 的副本
    const newCustomButtonList = { ...customButtonList };

    // 创建按钮组列表的副本
    const newListGroup = [...newCustomButtonList[buttonGroupKey]!.listGroup];
    // 创建当前按钮项的副本并更新
    newListGroup[index] = updateFn({ ...newListGroup[index] });
    // 更新副本中的按钮组列表
    newCustomButtonList[buttonGroupKey]!.listGroup = newListGroup;
    return newCustomButtonList;
  }

  function buttonGroupDiv(
    buttonGroup: ActionItemMap[],
    buttonGroupKey: "toggleButtonGroup" | "roamButtonGroup"
  ) {
    return buttonGroup?.map((item, index) => {
      return (
        <ListGroupItem key={index} style={{ padding: 0, border: 0 }}>
          <InputGroup>
            <InputGroup.Text id={item.NAME_ID} title="显示或隐藏按钮">
              {item.showButton ? (
                <i
                  className={setClassName("eye")}
                  onClick={() => {
                    const newCustomButtonList = updateButtonGroup(
                      buttonGroupKey,
                      index,
                      (item) => ({ ...item, showButton: !item.showButton })
                    );
                    setValue(JSON.stringify(newCustomButtonList));
                  }}
                ></i>
              ) : (
                <i
                  className={setClassName("eye-slash")}
                  onClick={() => {
                    const newCustomButtonList = updateButtonGroup(
                      buttonGroupKey,
                      index,
                      (item) => ({ ...item, showButton: !item.showButton })
                    );
                    setValue(JSON.stringify(newCustomButtonList));
                  }}
                ></i>
              )}
            </InputGroup.Text>
            {Array.isArray(item.showName)
              ? item.showName.map((_item, innerIndex) => {
                  return (
                    <Form.Control
                      key={innerIndex}
                      placeholder={_item}
                      aria-label={_item}
                      aria-describedby={_item}
                      value={_item}
                      onChange={(e) => {
                        const newCustomButtonList = updateButtonGroup(
                          buttonGroupKey,
                          index,
                          (item) => {
                            const newShowName = [
                              ...(item.showName as string[]),
                            ];
                            newShowName[innerIndex] = e.target.value;
                            return { ...item, showName: newShowName };
                          }
                        );
                        setValue(JSON.stringify(newCustomButtonList));
                      }}
                    />
                  );
                })
              : renderSingleShowName(item, index, buttonGroupKey)}
          </InputGroup>
        </ListGroupItem>
      );
    });
  }

  function renderSingleShowName(
    item: ActionItemMap,
    index: number,
    buttonGroupKey: "toggleButtonGroup" | "roamButtonGroup"
  ) {
    return (
      <Form.Control
        placeholder={item.NAME_ID}
        aria-label={item.NAME_ID}
        aria-describedby={item.NAME_ID}
        value={item.showName}
        onChange={(e) => {
          const newCustomButtonList = updateButtonGroup(
            buttonGroupKey,
            index,
            (item) => ({ ...item, showName: e.target.value })
          );
          setValue(JSON.stringify(newCustomButtonList));
        }}
      />
    );
  }
  function getBadgeByType(buttonGroup: CustomButtonType) {
    if (buttonGroup === "TOGGLE") {
      return "切换";
    }
    if (buttonGroup === "DRAWER") {
      return "抽屉";
    }
    if (buttonGroup === "STRETCH") {
      return "拉伸";
    }
  }

  return (
    <>
      {toggleButtonGroup.length > 0 && (
        <Badge bg={APP_COLOR.Primary}>
          {getBadgeByType(customButtonList.toggleButtonGroup!.type)}
        </Badge>
      )}

      <ListGroup horizontal className="mt-2 d-flex flex-wrap">
        {buttonGroupDiv(toggleButtonGroup, "toggleButtonGroup")}
      </ListGroup>
      {roamButtonGroup.length > 0 && (
        <Badge bg={APP_COLOR.Primary}>漫游按钮组</Badge>
      )}
      <ListGroup horizontal className="mt-2 d-flex flex-wrap">
        {buttonGroupDiv(roamButtonGroup, "roamButtonGroup")}
      </ListGroup>
    </>
  );
}
