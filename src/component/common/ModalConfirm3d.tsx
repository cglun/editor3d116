import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getThemeColor } from "../../app/config";
import { setClassName } from "../../app/utils";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";

export interface ModalConfirm {
  title: string;
  body: string | JSX.Element;
  show: boolean;
}
export const modalConfirm: ModalConfirm = {
  title: "标题",
  body: "内容",
  show: false,
};

let container = document.getElementById("toast");
if (container === null) {
  container = document.createElement("div");
  document.body.appendChild(container);
}
const root = createRoot(container);

function ModalConfirm({
  modalConfirm,
  callback,
  update,
}: {
  modalConfirm: ModalConfirm;
  callback: Function;
  update: number;
}) {
  const themeColor = getThemeColor();
  const { title, body } = modalConfirm;

  const [show, setShow] = useState(modalConfirm.show);
  useEffect(() => {
    setShow(modalConfirm.show);
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
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <i className={setClassName("info-circle")}></i> {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
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
      </Modal>
    )
  );
}

export default function ModalConfirm3d(
  modalConfirm: ModalConfirm = {
    title: "title",
    body: "body",
    show: false,
  },
  callback: Function
) {
  const update = new Date().getTime();
  root.render(
    <ModalConfirm
      modalConfirm={modalConfirm}
      callback={callback}
      update={update}
    />
  );
}
