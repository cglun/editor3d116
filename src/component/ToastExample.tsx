import { Toast } from 'react-bootstrap';
import { initToast, MyContext } from '../app/MyContext';
import { useContext, memo } from 'react';
import { APP_COLOR } from '../type';
import { setClassName } from '../app/utils';
/**
 * 消息提示, 全局使用
 * @returns
 */

function ToastExample() {
  const { toast, dispatchToast } = useContext(MyContext);
  const { toastBody } = toast;

  let iconClassName = setClassName('info-circle');
  if (toastBody.type === APP_COLOR.Success) {
    iconClassName = setClassName('check-circle');
  }

  return (
    toastBody.show && (
      <div className="fixed-top py-2">
        <Toast
          className="mx-auto"
          onClose={() => {
            dispatchToast({
              type: 'toast',
              toastBody: {
                ...initToast.toastBody,
                title: 'title',
                content: 'content',
              },
            });
          }}
          show={toastBody.show}
          delay={toastBody.delay}
          bg={toastBody.type}
          autohide
        >
          <Toast.Header>
            <i className={setClassName('info-circle') + ' me-1'}></i>
            <strong className="me-auto ">{toastBody.title}</strong>
          </Toast.Header>
          <Toast.Body
            className={toastBody.type.toString() === 'Dark' ? 'text-white' : ''}
          >
            {toastBody.content}
          </Toast.Body>
        </Toast>
      </div>
    )
  );
}
export default memo(ToastExample);
