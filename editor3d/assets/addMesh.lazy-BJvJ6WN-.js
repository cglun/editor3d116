import { importShared } from './__federation_fn_import-DkmQLHYr.js';
import { j as jsxRuntimeExports, m as addGlb, b as getScene, t as takeScreenshot } from './__federation_expose_Viewer3d-BCRozzVR.js';
import { c as createLazyFileRoute, M as MyContext, C as Card, s as setClassName, a as ButtonGroup, B as Button, I as Image, g as getThemeColor } from './index-CyFBSHEy.js';
import { B as BoxGeometry, t as MeshLambertMaterial, f as Mesh, u as AmbientLight, P as PlaneGeometry, v as Group, o as DirectionalLight } from './__federation_expose_Init3dViewer-BtTbt1Ug.js';

const {useContext,useState} = await importShared('react');
const Route = createLazyFileRoute("/addMesh")({
  component: RouteComponent
});
function RouteComponent() {
  const color = getThemeColor();
  const scene = getScene();
  const { dispatchScene } = useContext(MyContext);
  function setSelected(object3D) {
    object3D.userData.isSelected = true;
  }
  function addBox() {
    const cubeGeometry = new BoxGeometry(1, 1, 1);
    const cubeMaterial = new MeshLambertMaterial();
    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.name = "cube1";
    cube.position.set(0, 0.5, 0);
    setSelected(cube);
    scene.add(cube);
    dispatchScene({
      type: "setScene",
      payload: scene
    });
  }
  function addAmbientLight() {
    const light = new AmbientLight(16777215, 0.5);
    scene.add(light);
    setSelected(light);
    dispatchScene({
      type: "setScene",
      payload: scene
    });
  }
  function addPlane() {
    const planeGeometry = new PlaneGeometry(10, 10);
    const planeMaterial = new MeshLambertMaterial({ color: 14540253 });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.castShadow = true;
    plane.rotation.x = -Math.PI / 2;
    setSelected(plane);
    scene.add(plane);
    dispatchScene({
      type: "setScene",
      payload: scene
    });
  }
  function addGroup() {
    const group = new Group();
    setSelected(group);
    scene.add(group);
    dispatchScene({
      type: "setScene",
      payload: scene
    });
  }
  function addDirectionalLight() {
    const directionalLight = new DirectionalLight(16777215, 0.5);
    scene.add(directionalLight);
    setSelected(directionalLight);
    directionalLight.position.set(3, 3, 3);
    directionalLight.lookAt(0, 0, 0);
    dispatchScene({
      type: "setScene",
      payload: scene
    });
  }
  const [xx, setXx] = useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "d-flex flex-wrap pt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card.Header, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("box") }),
        " 几何体"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card.Body, { className: "pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonGroup, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: color,
            onClick: () => {
              addBox();
            },
            children: "立方体"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: color,
            onClick: () => {
              addPlane();
            },
            children: "平面"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: color,
            onClick: () => {
              addGroup();
            },
            children: "组"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "ms-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card.Header, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("lightbulb") }),
        " 灯光"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card.Body, { className: "pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonGroup, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: color,
            title: "可以投射阴影",
            onClick: () => {
              addDirectionalLight();
            },
            children: "面光"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: color,
            title: "不能投射阴影",
            onClick: () => {
              addAmbientLight();
            },
            children: "环境光"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: color,
            title: "添加glb模型",
            onClick: () => {
              addGlb(
                dispatchScene({
                  type: "setScene",
                  payload: getScene()
                })
              );
            },
            children: "glb模型"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: color,
            title: "序列化",
            onClick: () => {
            },
            children: "序列化"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: color,
            onClick: () => {
              fetch("/api");
            },
            children: "测试"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: color,
            onClick: () => {
              const xx2 = takeScreenshot();
              setXx(xx2);
            },
            children: "截图"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { src: xx })
      ] }) })
    ] })
  ] });
}

export { Route };
