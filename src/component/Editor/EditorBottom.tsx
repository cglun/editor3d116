import { useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import { Container, Nav } from "react-bootstrap";
import { setClassName } from "../../app/utils";
export default function EditorBottom() {
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.BASE_URL;
  function handleSelect(eventKey: string | null) {
    console.log("handleSelect", eventKey);
    if (eventKey !== null) {
      navigate({
        to: eventKey + location.searchStr,
      });
    }
  }
  let defaultActiveKey = location.href;

  if (location.href.includes("sceneId=")) {
    defaultActiveKey = location.pathname;
    // navigate({ to: location.href });
  }
  const xx = [
    {
      title: "首页",
      url: "",
      icon: "house-door",
    },
    {
      title: "模型",
      url: "model",
      icon: "box",
    },
    {
      title: "几何体",
      url: "mesh",
      icon: "patch-plus",
    },
    {
      title: "标注",
      url: "mark",
      icon: "pin-map",
    },
    {
      title: "脚本",
      url: "script",
      icon: "bi bi-filetype-js",
    },
    {
      title: "特效",
      url: "effects",
      icon: "bi bi-stars",
    },
    {
      title: "配置",
      url: "config",
      icon: "gear",
    },
    {
      title: "文档",
      url: "document",
      icon: "file-code",
    },
    {
      title: "预览",
      url: "preView",
      icon: "eye",
    },
    {
      title: "测试",
      url: "test",
      icon: "triangle",
    },
    {
      title: "关于",
      url: "about",
      icon: "info-circle",
    },
  ];
  return (
    <Container fluid style={{ minHeight: "30vh" }}>
      <Nav
        variant="tabs"
        // activeKey={import.meta.env.BASE_URL}
        defaultActiveKey={defaultActiveKey}
        onSelect={(eventKey) => handleSelect(eventKey)}
      >
        {xx.map((item, index) => {
          const { title, url, icon } = item;
          return (
            <Nav.Item key={index}>
              <Nav.Link eventKey={BASE_URL + url}>
                <i
                  className={icon.includes("bi-") ? icon : setClassName(icon)}
                ></i>{" "}
                {title}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
      <Container fluid>
        <Outlet />
      </Container>
    </Container>
  );

  return (
    <Container fluid style={{ minHeight: "30vh" }}>
      <Nav
        variant="tabs"
        // activeKey={import.meta.env.BASE_URL}
        defaultActiveKey={defaultActiveKey}
        onSelect={(eventKey) => handleSelect(eventKey)}
      >
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL}>
            <i className={setClassName("box")}></i> 首页
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "model"}>
            <i className={setClassName("box")}></i> 模型
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "mesh"}>
            <i className={setClassName("patch-plus")}></i> 几何体
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "mark"}>
            <i className={setClassName("pin-map")}></i> 标注
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "script"}>
            <i className="bi bi-filetype-js"></i> 脚本
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "effects"}>
            <i className={"bi bi-stars"}></i> 特效
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "config"}>
            <i className={setClassName("gear")}></i> 配置
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "document"}>
            <i className={setClassName("file-code")}></i> 文档
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "preView"}>
            <i className={setClassName("eye")}></i> 预览
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "test"}>
            <i className={setClassName("triangle")}></i> 测试
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "about"}>
            <i className={setClassName("info-circle")}></i> 关于
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Container fluid>
        <Outlet />
      </Container>
    </Container>
  );
}
