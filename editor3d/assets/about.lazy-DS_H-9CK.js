import { j as jsxRuntimeExports } from './__federation_expose_Viewer3d-DuFPoqtD.js';
import { b as createLazyFileRoute, L as ListGroup, h as ListGroupItem, B as Button, e as getThemeColor, s as setClassName, A as AlertBase } from './index-EAKGt_3N.js';
import { A as APP_COLOR } from './__federation_expose_Init3dViewer-U8DSWyuG.js';

const Route = createLazyFileRoute("/editor3d/about")({
  component: RouteComponent
});
function RouteComponent() {
  return (
    // <Button onClick={handleTest} variant={getThemeColor()}>
    //   测试
    // </Button>
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ListGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(ListGroupItem, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com/cglun/editor3d116", target: "_blank", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: getThemeColor(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "bi bi-github" }),
          " 源代码"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://3d.oklun.com", className: "ms-2", target: "_blank", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: getThemeColor(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("eye") }),
          " 预览APP"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ListGroupItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertBase,
        {
          type: APP_COLOR.Success,
          text: "【名称：3d116】【版本：1.1.6】【制作：李论】【先定个小目标，活个116岁】"
        }
      ) }) })
    ] })
  );
}

export { Route };
