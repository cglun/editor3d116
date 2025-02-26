/**
 *
 * 动画
 */
import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D } from "three";
import { Tween } from "three/examples/jsm/libs/tween.module.js";
import { getScene } from "./init3dEditor";

export function test() {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  getScene().add(cube);
  cube.name = "立方体";
  const { position } = cube;
  return new Tween(position, false)
    .to({ x: 100, y: 100, z: 100 }, 100000)
    .start();
}
