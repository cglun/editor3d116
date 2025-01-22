import { Scene } from 'three';
import { Camera } from 'three/src/cameras/Camera.js';

interface Props {
  camera: Camera;
  scene: Scene;
}
//脚本开发在这里进行调试
export function runScript(props: Props) {
  console.log(props);
  //const { camera, scene } = props;
  //===============开始==================//
  // const cube = scene.getObjectByName('cube');
  // if (cube !== undefined) {
  // cube.position.y += 3;
  //   setInterval(() => {
  //     cube.rotation.y += 0.5;
  //
  //   }, 50);
  // }
  //===============结束==================//
}
