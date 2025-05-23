import { Object3D, Object3DEventMap } from "three";
export function hasValueString(
  item: Object3D<Object3DEventMap>,
  value: string
) {
  return item.name.includes(value);
}
