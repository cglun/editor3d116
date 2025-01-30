/**
 * 工具类
 */

import { iconIsFill } from "./config";

export function setClassName(className: string): string {
  if (iconIsFill) {
    return `bi bi-${className}-fill`;
  }
  return `bi bi-${className}`;
}
