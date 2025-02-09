import { j as jsxRuntimeExports, s as setScene, b as getScene } from './__federation_expose_Viewer3d-DuFPoqtD.js';
import { b as createLazyFileRoute, B as Button, e as getThemeColor } from './index-EAKGt_3N.js';
import { S as Scene } from './__federation_expose_Init3dViewer-U8DSWyuG.js';

const Route = createLazyFileRoute("/editor3d/mark")({
  component: RouteComponent
});
function RouteComponent() {
  function moveBy() {
    const cube = getScene().children[0];
    cube.position.x++;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: getThemeColor(),
        onClick: () => {
          moveBy();
        },
        children: "移动立方体"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: getThemeColor(),
        onClick: () => {
          localStorage.removeItem("camera");
          localStorage.removeItem("scene");
          setScene(new Scene());
        },
        children: "移除场景"
      }
    )
  ] });
}

export { Route };
