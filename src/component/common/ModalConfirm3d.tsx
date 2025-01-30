import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getThemeColor } from "../../app/config";
import { setClassName } from "../../app/utils";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
export interface ModalConfirm {
  show?: boolean;
  hasButton?: boolean;
  closeButton?: boolean;
}
export const modalConfirm: ModalConfirm = {
  show: true,
  hasButton: true,
  closeButton: true,
};
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
  confirmButton: ModalConfirm;
  callback: () => void;
  update: number;
}) {
  const themeColor = getThemeColor();
  const [show, setShow] = useState(confirmButton.show);
  useEffect(() => {
    setShow(confirmButton.show);
  }, [update]);
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
            <i className={setClassName("info-circle")}></i> {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        {confirmButton.hasButton && (
          <Modal.Footer>
            <Button variant={themeColor} onClick={onClose}>
              <i className={setClassName("x-circle")}></i> 取消
            </Button>
            <Button
              variant={themeColor}
              onClick={() => {
                callback();
                onClose();
              }}
            >
              <i className={setClassName("check-circle")}></i> 确定
            </Button>
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
    confirmButton = modalConfirm,
  }: {
    title: string;
    body: JSX.Element | string;
    confirmButton?: ModalConfirm;
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
