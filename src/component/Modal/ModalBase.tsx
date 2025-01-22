import { useContext } from 'react';
import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal';
import { MyContext } from '../../app/MyContext';

import { getThemeColor } from '../../app/config';
import { setClassName } from '../../app/utils';
import { ACTION_TYPE, APP_COLOR, DELAY } from '../../type';

function ModalBase() {
  const { state, dispatch } = useContext(MyContext);
  const themeColor = getThemeColor();
  const handleClose = () => {
    dispatch({
      type: 'modal',
      modal: {
        title: 'title',
        show: false,
        body: '',
        action: null,
      },
    });
  };

  function submit() {
    let toast = '';
    switch (state.modal.action?.type) {
      case ACTION_TYPE.ADD:
        toast = '增加';
        break;

      case ACTION_TYPE.DELETE:
        toast = '删除';
        break;
      case ACTION_TYPE.UPDATE:
        toast = '更新';
        break;
      default:
        toast = '';
    }

    dispatch({
      type: 'toast',
      toast: {
        title: toast + '---' + state.modal.action?.targetId,
        content: '成功',
        type: APP_COLOR.Success,
        delay: DELAY.MIDDLE,
        show: true,
      },
    });
    handleClose();
  }
  return (
    state.modal.show && (
      <Modal
        show={state.modal.show}
        onHide={handleClose}
        animation={true}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <i className={setClassName('info-circle')}></i> {state.modal.title}
            【{state.modal.action?.targetId}】
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{state.modal.body}</Modal.Body>
        <Modal.Footer>
          <Button variant={themeColor} onClick={handleClose}>
            <i className={setClassName('x-circle')}></i> 取消
          </Button>
          <Button variant={themeColor} onClick={() => submit()}>
            <i className={setClassName('check-circle')}></i> 确定
          </Button>
        </Modal.Footer>
      </Modal>
    )
  );
}
export default ModalBase;
