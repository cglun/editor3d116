import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getThemeByScene, setClassName } from "../../app/utils";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { useUpdateScene } from "../../app/hooks";
import { getButtonColor } from "../../app/config";
import { ButtonGroup } from "react-bootstrap";
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
  const { scene } = useUpdateScene();
  let { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

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
            <ButtonGroup>
              <Button variant={buttonColor} onClick={onClose}>
                <i className={setClassName("x-circle")}></i> 取消
              </Button>
              <Button
                variant={buttonColor}
                onClick={() => {
                  callback();
                  onClose();
                }}
              >
                <i className={setClassName("check-circle")}></i> 确定
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
