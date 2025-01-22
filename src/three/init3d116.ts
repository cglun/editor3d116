import {
  BoxGeometry,
  Camera,
  DirectionalLight,
  DirectionalLightHelper,
  GridHelper,
  Group,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene: Scene = new Scene();

let camera: PerspectiveCamera, controls: OrbitControls;

let renderer: WebGLRenderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;

function animate() {
  requestAnimationFrame(animate);
  if (controls !== undefined) {
    controls.update();
  }

  renderer.render(scene, camera);
}

let cube: Mesh;
let light: DirectionalLight;
function addCube() {
  // 创建立方体
  const cubeGeometry = new BoxGeometry(1, 1, 1);
  const cubeMaterial = new MeshLambertMaterial();
  cube = new Mesh(cubeGeometry, cubeMaterial);
  cube.name = 'cube1';
  cube.castShadow = true; // 立方体投射阴影

  // 创建立方体
  const cubeGeometry2 = new BoxGeometry(1, 1, 1);
  const cubeMaterial2 = new MeshLambertMaterial();
  const cube2 = new Mesh(cubeGeometry2, cubeMaterial2);
  cube2.name = 'cube2';
  cube2.castShadow = true; // 立方体投射阴影

  // 创建立方体
  const cubeGeometry3 = new BoxGeometry(1, 1, 1);
  const cubeMaterial3 = new MeshLambertMaterial();
  const cube3 = new Mesh(cubeGeometry3, cubeMaterial3);
  cube3.name = 'cube3';
  cube3.castShadow = true; // 立方体投射阴影

  cube2.add(cube3);

  const g = new Group();
  g.name = '立方体组';
  g.add(cube);
  g.add(cube2);
  scene.add(g);
}

function addLight() {
  // 添加正交光源
  const light = new DirectionalLight(0xffffff, 2.16);
  light.position.set(3, 3, 3);
  light.castShadow = true; // 开启投射阴影
  light.lookAt(0, 0, 0);
  scene.add(light);
  const dh = new DirectionalLightHelper(light);
  dh.name = '灯光辅助';
  scene.add(dh);

  // 设置阴影参数
  light.shadow.mapSize.width = 2048; // 阴影图的宽度
  light.shadow.mapSize.height = 2048; // 阴影图的高度
  light.shadow.camera.near = 0.5; // 阴影摄像机的近剪裁面
  light.shadow.camera.far = 5000; // 阴影摄像机的远剪裁面
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  light.shadow.camera.bottom = -10;

  const size = 10;
  const divisions = 10;

  const gridHelper = new GridHelper(size, divisions);
  scene.add(gridHelper);
}

function createScene(node: HTMLDivElement) {
  camera = new PerspectiveCamera(
    75,
    node.offsetWidth / node.offsetHeight,
    0.1,
    1000,
  );
  camera.name = '透视相机';

  renderer.setSize(node.offsetWidth, node.offsetHeight);
  camera.position.set(-5, 5, 8);
  scene.userData.isSelected = false;
  node.appendChild(renderer.domElement);
  addOrbitControls();
  addGlb();
  animate();
}
function addOrbitControls(): void {
  controls = new OrbitControls(camera, renderer.domElement);
}
function setScene(newScene: any) {
  scene = newScene;
}
function setCamera(camera1: Object3D<Object3DEventMap>) {
  camera.position.x = camera1.position.x;
  camera.position.y = camera1.position.y;
  camera.position.z = camera1.position.z;
}
function getCamera(): Camera {
  return camera;
}
function getScene(): Scene {
  return scene;
}
function getCube() {
  console.log(cube);

  return cube;
}

function addGlb() {
  // const load = new GLTFLoader(new LoadingManager());
  // load.load('/assets/models/blender.glb', (data) => {
  //   scene.add(data.scene);
  // });
}

export default scene;
export {
  createScene,
  renderer,
  getCube,
  camera,
  addOrbitControls,
  cube,
  light,
  setScene,
  getScene,
  addCube,
  addLight,
  setCamera,
  getCamera,
};
