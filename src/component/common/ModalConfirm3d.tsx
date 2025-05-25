import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { ButtonGroup } from "react-bootstrap";
import { getScene } from "../../three/init3dEditor";
import { ConfirmButton } from "../../app/type";
// 从新文件中引入常量
import { _confirmButton } from "./ModalConfirmUtils";
import { getButtonColor } from "../../app/utils";
import Icon from "./Icon";

let container = document.getElementById("toast");
if (container === null) {
  container = document.createElement("div");
  document.body.appendChild(container);
}
const root = createRoot(container);
function ModalConfirm({
  title,
  body,
  confirmButton,
  callback,
  update,
}: {
  title: string;
  body: JSX.Element | string;
  confirmButton: ConfirmButton;
  callback: () => void;
  update: number;
}) {
  const scene = getScene();

  const { themeColor } = scene.userData.APP_THEME;
  const buttonColor = getButtonColor(themeColor);
  const [show, setShow] = useState(confirmButton.show);
  // 修复：添加 confirmButton.show 到依赖项数组
  useEffect(() => {
    setShow(confirmButton.show);
  }, [update, confirmButton.show]);
  const onClose = () => {
    setShow(false);
  };
  return (
    show && (
      <Modal
        show={show}
        onHide={onClose}
        animation={true}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton={confirmButton.closeButton}>
          <Modal.Title id="contained-modal-title-vcenter">
            <Icon iconName="info-circle" />
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        {confirmButton.hasButton && (
          <Modal.Footer>
            <ButtonGroup>
              <Button variant={buttonColor} onClick={onClose}>
                <Icon iconName="x-circle" title="取消" gap={0} />
              </Button>
              <Button
                variant={buttonColor}
                onClick={() => {
                  callback();
                  onClose();
                }}
              >
                <Icon iconName="check-circle" title="确定" gap={0} />
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        )}
      </Modal>
    )
  );
}

export default function ModalConfirm3d(
  {
    title = "提示",
    body = "内容",
    confirmButton = _confirmButton,
  }: {
    title: string;
    body: JSX.Element | string;
    confirmButton?: ConfirmButton;
  },
  callback = () => {}
) {
  const update = new Date().getTime();
  root.render(
    <ModalConfirm
      title={title}
      body={body}
      confirmButton={confirmButton}
      callback={callback}
      update={update}
    />
  );
}
