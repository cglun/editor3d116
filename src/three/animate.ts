/**
 *
 * 动画
 */
import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { Tween } from "three/addons/libs/tween.module.js";
export function cameraTween(
  camera: PerspectiveCamera | Object3D<any>,
  target: Vector3,
  time: number = 1000
) {
  return new Tween(camera.position).to(target, time);
}
