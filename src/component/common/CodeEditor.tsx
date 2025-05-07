import Editor from "@monaco-editor/react";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import ModalConfirm3d from "./ModalConfirm3d";
import { useUpdateScene } from "../../app/hooks";
import { getThemeByScene } from "../../app/utils";

interface CodeEditorProps {
  language?: string;
  code: string;
  show: boolean;
  tipsTitle?: string;
  callback?: (value: string) => void;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  isValidate: boolean;
  children?: React.ReactNode;
}

// 使用 forwardRef 高阶函数
const CodeEditor = (props: CodeEditorProps) => {
  const {
    language,
    show,
    setShow,
    children,
    code,
    tipsTitle,
    callback,
    isValidate,
  } = props;
  const [error, setError] = useState(false);
  const [value, setValue] = useState<string>(code);
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);

  useEffect(() => {
    setValue(code);
  }, [code]);

  function handleClose() {
    if (!isValidate) {
      setShow(false);
      return;
    }
    if (error) {
      ModalConfirm3d(
        {
          title: "提示",
          body: "有语法错误，将不会保存到数据库中!",
          confirmButton: {
            show: true,
            closeButton: true,
            hasButton: true,
          },
        },
        () => {
          setShow(false);
          setError(false);
        }
      );
      return;
    }

    if (callback) {
      callback(value.replace(/'/g, '"'));
    }

    setShow(false);
  }
  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setValue(value);
    }
  }

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{tipsTitle ? tipsTitle : "代码编辑器"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Editor
          height="76vh"
          defaultLanguage={language || "javascript"}
          defaultValue={"[]"}
          value={value}
          onChange={handleEditorChange}
          theme={themeColor ? `vs-${themeColor}` : "vs-dark"}
          onValidate={(e) => {
            setError(e.length > 0);
          }}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: true,
            fontSize: 14,
            wordWrap: "on",
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          关闭
        </Button>
        {children}
      </Modal.Footer>
    </Modal>
  );
};

export default CodeEditor;
