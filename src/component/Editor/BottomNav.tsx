import { useNavigate, Outlet, useLocation } from "@tanstack/react-router";

import { Container, Nav } from "react-bootstrap";
import { setClassName } from "../../app/utils";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  function handleSelect(eventKey: string | null) {
    if (eventKey !== null) {
      navigate({ to: eventKey });
    }
  }
  return (
    <Container fluid style={{ height: "100vh" }}>
      <Nav
        variant="tabs"
        // activeKey="/editor3d"
        defaultActiveKey={location.href}
        onSelect={(eventKey) => handleSelect(eventKey)}
      >
        <Nav.Item>
          <Nav.Link eventKey="/editor3d">
            <i className={setClassName("box")}></i> 模型列表
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/editor3d/addMesh">
            <i className={setClassName("patch-plus")}></i> 添加网格
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/editor3d/mark">
            <i className={setClassName("pin-map")}></i> 点位标注
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/editor3d/config">
            <i className={setClassName("gear")}></i> 配置
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/editor3d/script">
            <i className="bi bi-code"></i> 脚本
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/editor3d/document">
            <i className={setClassName("file-code")}></i> 文档
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/editor3d/test">
            <i className={setClassName("triangle")}></i> 测试
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/editor3d/about">
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
