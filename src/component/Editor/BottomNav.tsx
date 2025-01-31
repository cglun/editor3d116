import { Link, Outlet } from "@tanstack/react-router";

import { Nav } from "react-bootstrap";
import { setClassName } from "../../app/utils";

export default function BottomNav() {
  return (
    <>
      <Nav variant="tabs" defaultActiveKey="/">
        <Nav.Item>
          <Link to="/" className="nav-link">
            <i className={setClassName("box")}></i> 模型列表
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/addMesh" className="nav-link">
            <i className={setClassName("patch-plus")}></i> 添加网格
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/mark" className="nav-link">
            <i className={setClassName("pin-map")}></i> 点位标注
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/about" className="nav-link">
            {/* <i className={setClassName('dash-circle')}></i> 关于 */}
            <i className={setClassName("info-circle")}></i> 关于
          </Link>
        </Nav.Item>
      </Nav>
      <Outlet />
    </>
  );
}
