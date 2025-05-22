import { Form, InputGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import { ActionItemMap, CustomButtonListType } from "../../../app/type";
import { setClassName } from "../../../app/utils";

export default function UiButtonEditor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const v: CustomButtonListType = JSON.parse(value);
  const toggleButtonGroup = v.toggleButtonGroup?.listGroup || [];
  const roamButtonGroup = v.roamButtonGroup?.listGroup || [];

  function buttonGroupDiv(buttonGroup: ActionItemMap[]) {
    return buttonGroup?.map((item, index) => {
      return (
        <ListGroupItem key={index} style={{ padding: 0, border: 0 }}>
          <InputGroup>
            <InputGroup.Text id={item.NAME_ID} title="显示或隐藏按钮">
              {item.showButton ? (
                <i
                  className={setClassName("eye")}
                  onClick={() => {
                    buttonGroup[index].showButton =
                      !buttonGroup[index].showButton;
                    setValue(JSON.stringify(v));
                  }}
                ></i>
              ) : (
                <i
                  className={setClassName("eye-slash")}
                  onClick={() => {
                    buttonGroup[index].showButton =
                      !buttonGroup[index].showButton;
                    setValue(JSON.stringify(v));
                  }}
                ></i>
              )}
            </InputGroup.Text>
            {/* <InputGroup.Checkbox
              aria-label={item.NAME_ID}
              checked={buttonGroup[index].showButton}
              onChange={() => {
                buttonGroup[index].showButton = !buttonGroup[index].showButton;
                setValue(JSON.stringify(v));
              }}
            /> */}
            {Array.isArray(item.showName)
              ? item.showName.map((_item, innerIndex) => {
                  return (
                    <Form.Control
                      placeholder={_item}
                      aria-label={_item}
                      aria-describedby={_item}
                      value={_item}
                      onChange={(e) => {
                        // 复制 showName 数组
                        const newShowName = [...item.showName];
                        // 修改复制后的数组
                        newShowName[innerIndex] = e.target.value;
                        // 更新原始数据中的 showName
                        buttonGroup[index].showName = newShowName;
                        setValue(JSON.stringify(v));
                      }}
                    />
                  );
                })
              : fffffssss(item, index, buttonGroup)}
          </InputGroup>
        </ListGroupItem>
      );
    });
  }

  function fffffssss(
    item: ActionItemMap,
    index: number,
    buttonGroup: ActionItemMap[]
  ) {
    return (
      <Form.Control
        placeholder={item.NAME_ID}
        aria-label={item.NAME_ID}
        aria-describedby={item.NAME_ID}
        value={item.showName}
        onChange={(e) => {
          buttonGroup[index].showName = e.target.value;
          setValue(JSON.stringify(v));
        }}
      />
    );
  }

  return (
    <ListGroup horizontal className="mt-2 d-flex flex-wrap">
      {buttonGroupDiv(toggleButtonGroup)}
      <div
        className="custom-separator"
        style={{
          width: "100%",
          borderBottom: " 1px solid #ccc",
          margin: " 10px 0",
        }}
      ></div>
      {buttonGroupDiv(roamButtonGroup)}
    </ListGroup>
  );
}
