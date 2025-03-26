/**
 *
 * 动画
 */
import { OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { Tween } from "three/addons/libs/tween.module.js";
export function cameraTween(
  camera: PerspectiveCamera | OrthographicCamera,
  target: Vector3,
  time: number = 1000
) {
  return new Tween(camera.position).to(target, time);
}
