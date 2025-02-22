import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { setClassName } from "../../app/utils";
import { getThemeColor } from "../../app/config";

import { APP_COLOR } from "../../app/type";
import AlertBase from "../../component/common/AlertBase";

export const Route = createLazyFileRoute("/editor3d/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div style={{ height: "100vh" }}>
      <iframe
        src="/editor3d/static/about.html"
        width={"100%"}
        height={"100%"}
      ></iframe>
    </div>
  );
  return (
    // <Button onClick={handleTest} variant={getThemeColor()}>
    //   测试
    // </Button>
    <ListGroup>
      <ListGroupItem>
        <a href="https://github.com/cglun/editor3d116" target="_blank">
          <Button variant={getThemeColor()}>
            <i className="bi bi-github"></i> 源代码
          </Button>
        </a>
        <a href="https://3d.oklun.com" className="ms-2" target="_blank">
          <Button variant={getThemeColor()}>
            <i className={setClassName("eye")}></i> 预览APP
          </Button>
        </a>
      </ListGroupItem>
      <ListGroupItem>
        <AlertBase
          type={APP_COLOR.Warning}
          text={"修改about页面，请到：/editor3d/static/about.html"}
        ></AlertBase>
        <AlertBase
          type={APP_COLOR.Success}
          text={
            "【名称：3d116】【版本：1.1.6】【制作：李论】【先定个小目标，活个116岁】"
          }
        ></AlertBase>
      </ListGroupItem>
    </ListGroup>
  );
}
