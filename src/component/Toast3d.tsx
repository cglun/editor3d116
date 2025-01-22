import { Toast } from 'react-bootstrap';

import { memo } from 'react';
import { APP_COLOR, DELAY } from '../type';
import { getClassNameByType, setClassName } from '../app/utils';
/**
 * 消息提示，子组件
 * @returns
 */
export interface Toast {
  title: string;
  content: string;
  type: APP_COLOR;
  delay: DELAY;
  show: boolean;
}
export const ToastDefault: Toast = {
  title: '标题',
  content: '内容',
  type: APP_COLOR.Success,
  delay: DELAY.SHORT,
  show: false,
};

function Toast3d({
  toast = ToastDefault,
  setToast = (_toast: Toast): void => {},
}) {
  const { show, delay, type, title, content } = toast;

  return (
    show && (
      <div className="fixed-top py-2">
        <Toast
          className="mx-auto"
          onClose={() => setToast({ ...ToastDefault })}
          show={show}
          delay={delay}
          bg={type}
          autohide
        >
          <Toast.Header>
            <i className={setClassName(getClassNameByType(type)) + ' me-1'}></i>
            <strong className="me-auto ">{title}</strong>
          </Toast.Header>
          <Toast.Body
            className={type.toString() === 'Dark' ? 'text-white' : ''}
          >
            {content}
          </Toast.Body>
        </Toast>
      </div>
    )
  );
}
export default memo(Toast3d);
