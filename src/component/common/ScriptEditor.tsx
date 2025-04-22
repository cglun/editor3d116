import { useRef, useState } from "react";
import { CodeHighlight } from "@mantine/code-highlight";
import { FloatingLabel, Form } from "react-bootstrap";
import { MantineProvider } from "@mantine/core";

export default function ScriptEditor({
  code,
  setCode,
  callback,
}: {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  callback: () => void;
}) {
  const [editable, setEditable] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 创建一个引用
  return (
    <>
      {editable ? (
        <FloatingLabel controlId="floatingTextarea2" label="编辑中……">
          <Form.Control
            as="textarea"
            ref={textareaRef} // 将引用绑定到文本框
            style={{ height: "100vh" }}
            value={code}
            onMouseLeave={() => {
              setEditable(!editable);
              callback();
            }}
            onMouseEnter={() => {
              // 聚焦到文本框内容最后面
              if (textareaRef.current) {
                const length = textareaRef.current.value.length;
                textareaRef.current.setSelectionRange(length, length);
                textareaRef.current.focus();
              }
            }}
            onChange={(e) => {
              setCode(e.target.value);
              //getScene().userData.javascript = e.target.value;
            }}
          />
        </FloatingLabel>
      ) : (
        <MantineProvider>
          <CodeHighlight
            code={code.trim().length > 0 ? code : "//编辑代码"}
            style={{
              padding: "2px 10px ",
              minHeight: "30vh",
              cursor: "text",
              borderWidth: "1px",
              borderStyle: "dashed",
              borderColor: "var(--bs-card-border-color)",
              borderRadius: "4px",
            }}
            language="javascript"
            withCopyButton={false}
            onClick={() => {
              setEditable(!editable);
            }}
          />
        </MantineProvider>
      )}
    </>
  );
}
