/**
 * 工具类
 */
import { APP_COLOR } from '../type';
import { iconIsFill } from './config';

function setClassName(className: string): string {
  if (iconIsFill) {
    return `bi bi-${className}-fill`;
  }
  return `bi bi-${className}`;
}
export { setClassName };

export function getClassNameByType(type = APP_COLOR.Success) {
  return type === APP_COLOR.Success
    ? setClassName('check-circle')
    : setClassName('info-circle');
}
