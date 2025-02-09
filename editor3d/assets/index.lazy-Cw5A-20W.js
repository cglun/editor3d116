import { importShared } from './__federation_fn_import-DkmQLHYr.js';
import { j as jsxRuntimeExports } from './__federation_expose_Viewer3d-DuFPoqtD.js';
import { u as useBootstrapPrefix, c as classNames, m as map, g as getButtonColor, L as ListGroup, I as InputGroup, F as Form, B as Button, s as setClassName, a as ButtonGroup, T as Toast3d, b as createLazyFileRoute, t as testData2, d as ListCard } from './index-EAKGt_3N.js';

const React$1 = await importShared('react');

const {cloneElement} = await importShared('react');
const ROUND_PRECISION = 1000;
function getPercentage(now, min, max) {
  const percentage = (now - min) / (max - min) * 100;
  return Math.round(percentage * ROUND_PRECISION) / ROUND_PRECISION;
}
function renderProgressBar({
  min,
  now,
  max,
  label,
  visuallyHidden,
  striped,
  animated,
  className,
  style,
  variant,
  bsPrefix,
  ...props
}, ref) {
  return /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ref: ref,
    ...props,
    role: "progressbar",
    className: classNames(className, `${bsPrefix}-bar`, {
      [`bg-${variant}`]: variant,
      [`${bsPrefix}-bar-animated`]: animated,
      [`${bsPrefix}-bar-striped`]: animated || striped
    }),
    style: {
      width: `${getPercentage(now, min, max)}%`,
      ...style
    },
    "aria-valuenow": now,
    "aria-valuemin": min,
    "aria-valuemax": max,
    children: visuallyHidden ? /*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: "visually-hidden",
      children: label
    }) : label
  });
}
const ProgressBar = /*#__PURE__*/React$1.forwardRef(({
  isChild = false,
  ...rest
}, ref) => {
  const props = {
    min: 0,
    max: 100,
    animated: false,
    visuallyHidden: false,
    striped: false,
    ...rest
  };
  props.bsPrefix = useBootstrapPrefix(props.bsPrefix, 'progress');
  if (isChild) {
    return renderProgressBar(props, ref);
  }
  const {
    min,
    now,
    max,
    label,
    visuallyHidden,
    striped,
    animated,
    bsPrefix,
    variant,
    className,
    children,
    ...wrapperProps
  } = props;
  return /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ref: ref,
    ...wrapperProps,
    className: classNames(className, bsPrefix),
    children: children ? map(children, child => /*#__PURE__*/cloneElement(child, {
      isChild: true
    })) : renderProgressBar({
      min,
      now,
      max,
      label,
      visuallyHidden,
      striped,
      animated,
      bsPrefix,
      variant
    }, ref)
  });
});
ProgressBar.displayName = 'ProgressBar';

const {useState: useState$1} = await importShared('react');
function Serch3d({
  list,
  setFilterList
}) {
  const [name, setName] = useState$1("");
  const color = getButtonColor();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ListGroup.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Form.Control,
      {
        placeholder: "请输入模型名称",
        "aria-label": "请输入模型名称",
        "aria-describedby": "basic-addon2",
        value: name,
        onChange: (e) => {
          const value = e.target.value;
          setName(value);
          if (value.trim() === "") {
            setFilterList(list);
          } else {
            const newList = list.filter((item) => {
              return item.name.includes(value);
            });
            setFilterList(newList);
          }
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: color,
        id: "button-addon2",
        onClick: () => {
          const newList = list.filter((item) => {
            return item.name.includes(name);
          });
          setFilterList(newList);
        },
        children: "搜索"
      }
    )
  ] }) });
}

const {useRef,useState} = await importShared('react');
function UploadModel() {
  const color = getButtonColor();
  let fileRef = useRef(null);
  const [curFile, setCurFile] = useState(null);
  const [btn, setBtn] = useState(true);
  const [upload, setUpload] = useState(false);
  function handleUpload() {
    if (upload) {
      Toast3d("上传中……");
      return;
    }
    if (curFile) {
      setUpload(true);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "d-flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ListGroup.Item, { children: btn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Form.Group, { controlId: "formFile", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Form.Label, { className: "custom-file-upload d-flex align-items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "i",
          {
            style: { fontSize: "1.4rem" },
            className: setClassName("cloud-plus")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ms-1", children: "模型" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Form.Control,
        {
          as: "input",
          style: { display: "none" },
          type: "file",
          ref: fileRef,
          accept: ".glb,.gltf,.png,.jpg",
          onChange: () => {
            if (fileRef.current.files.length > 0) {
              const curFile2 = fileRef.current.files[0];
              setCurFile(curFile2);
              setBtn(false);
            } else {
              setBtn(true);
            }
          }
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Text, { children: curFile?.name }),
      upload && /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { now: 60 })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ListGroup.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonGroup, { size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: color,
          id: "button-addon1",
          disabled: btn,
          onClick: () => {
            if (upload) {
              Toast3d("上传中……");
              return;
            }
            setBtn(true);
          },
          children: "清空"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: color,
          id: "button-addon2",
          onClick: () => {
            handleUpload();
          },
          disabled: btn,
          children: "上传"
        }
      )
    ] }) })
  ] });
}

const React = await importShared('react');
const Route = createLazyFileRoute("/editor3d/")({
  component: ModelList
});
function ModelList() {
  const [list] = React.useState(testData2);
  const [filterList, setFilterList] = React.useState(testData2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "d-flex ", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ListGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Serch3d, { list, setFilterList }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(UploadModel, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ListCard,
      {
        list: filterList,
        setList: setFilterList,
        getType: {
          isLoading: false,
          error: false
        }
      }
    )
  ] });
}

export { Route };
