import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { setClassName } from "../app/utils";
import { getThemeColor } from "../app/config";
import AlertBase from "../component/common/AlertBase";
import { APP_COLOR } from "../type";
export const Route = createLazyFileRoute("/about")({
  component: RouteComponent,
});
function RouteComponent() {
  // const handleTest = () => {
  //   const sceneJson = scene.toJSON();

  //   localStorage.setItem('scene', JSON.stringify(sceneJson));
  // };
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
        <div>
          <AlertBase
            type={APP_COLOR.Success}
            text={
              "【名称：3d116】【版本：1.1.6】【制作：李论】【先定个小目标，活个116岁】"
            }
          ></AlertBase>
        </div>
      </ListGroupItem>
      <ListGroupItem>
        <Button
          onClick={() => {
            fetch("/api", (result: any): any => {
              return result.text();
            }).then((result) => {
              console.log(result.body);
            });
          }}
        >
          测试
        </Button>
      </ListGroupItem>
    </ListGroup>
  );
}
