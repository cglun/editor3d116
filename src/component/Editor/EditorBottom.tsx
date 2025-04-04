import { useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import { Container, Nav } from "react-bootstrap";
import { setClassName } from "../../app/utils";
export default function EditorBottom() {
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.BASE_URL;
  function handleSelect(eventKey: string | null) {
    if (eventKey !== null) {
      navigate({ to: eventKey });
    }
  }
  return (
    <Container fluid style={{ minHeight: "30vh" }}>
      <Nav
        variant="tabs"
        // activeKey={import.meta.env.BASE_URL}
        defaultActiveKey={location.href}
        onSelect={(eventKey) => handleSelect(eventKey)}
      >
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL}>
            <i className={setClassName("box")}></i> 模型
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={BASE_URL + "addMesh"}>
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
