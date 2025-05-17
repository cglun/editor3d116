/**
 *
 * 动画
 */
import {
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Vector3,
} from "three";
import { Tween } from "three/addons/libs/tween.module.js";
export function cameraTween(
  camera: PerspectiveCamera | OrthographicCamera,
  target: Vector3,
  time: number = 1000
) {
  return new Tween(camera.position).to(target, time);
}

export function meshTween(
  mesh: Object3D,
  target: Vector3,
  time: number = 1000
) {
  return new Tween(mesh.position).to(target, time);
}
