/**
 *
 * 动画
 */
import { PerspectiveCamera, Vector3 } from "three";
import TWEEN, { Tween } from "three/addons/libs/tween.module.js";
export function cameraTween(
  camera: PerspectiveCamera | any,
  target: Vector3,
  time: number = 1000
) {
  return new Tween(camera.position)
    .to(target, time)
    .easing(TWEEN.Easing.Exponential.InOut);
}
