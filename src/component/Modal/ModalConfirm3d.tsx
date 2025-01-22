import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getThemeColor } from '../../app/config';
import { setClassName } from '../../app/utils';
import { memo } from 'react';
import { APP_COLOR } from '../../type';
import AlertBase from '../AlertBase';

export interface ModalConfirm {
  title: string;
  show: boolean;
  type: APP_COLOR;
  onOk(): void;
}
export const ModalConfirmDefault: ModalConfirm = {
  title: '标题',

  show: false,
  type: APP_COLOR.Danger,

  onOk: function (): void {},
};

function ModalConfirm3d({
  modalConfirm = ModalConfirmDefault,
  setModalConfirm = (_ModalConfirmDefault: ModalConfirm): void => {},
  children = <AlertBase type={APP_COLOR.Warning} text={'---'} />,
}) {
  const { title, show, onOk } = modalConfirm;
  const themeColor = getThemeColor();
  const onClose = () => {
    setModalConfirm({ ...ModalConfirmDefault });
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
            <i className={setClassName('info-circle')}></i> {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={themeColor}
            onClick={() => setModalConfirm({ ...ModalConfirmDefault })}
          >
            <i className={setClassName('x-circle')}></i> 取消
          </Button>
          <Button variant={themeColor} onClick={onOk}>
            <i className={setClassName('check-circle')}></i> 确定
          </Button>
        </Modal.Footer>
      </Modal>
    )
  );
}

export default memo(ModalConfirm3d);
