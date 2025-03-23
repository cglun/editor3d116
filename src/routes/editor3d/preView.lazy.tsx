import { createLazyFileRoute } from "@tanstack/react-router";
import Viewer3d from "../../viewer3d/Viewer3d";
import React, { useEffect } from "react";
import { setEnableScreenshot } from "../../three/config3d";
import _axios from "../../app/http";
import { testData2 } from "../../app/testData";
import { Button, ButtonGroup } from "react-bootstrap";
import { fixedEditorLleft, setClassName } from "../../app/utils";
import AlertBase from "../../component/common/AlertBase";
import { APP_COLOR } from "../../app/type";

export const Route = createLazyFileRoute("/editor3d/preView")({
  component: RouteComponent,
});

function RouteComponent() {
  const [list, setList] = React.useState(testData2);
  const [_item, _setItem] = React.useState({
    id: 242,
    name: "立方体",
    des: "Scene",
    cover: "",
  });

  useEffect(() => {
    setEnableScreenshot(true);
    _axios.post("/project/pageList/", { size: 1000 }).then((res) => {
      if ((res.data.code = 200)) {
        const message = res.data.message;
        if (message) {
          return;
        }
        const list = res.data.data.records;
        const sceneList = list.filter((item: any) => {
          if (item.des === "Scene") {
            return item;
          }
        });
        setList(sceneList);
        _setItem(sceneList[0]);
        const element = document.getElementById("pre-view-top");
        element?.scrollIntoView();
      }
    });
  }, []);

  return (
    <>
      {/* <AlertBase type={APP_COLOR.Secondary} text={"测试"} /> */}
      <div
        id="pre-view-top"
        style={{ height: "2rem", scrollBehavior: "smooth" }}
      ></div>

      <ButtonGroup size="sm">
        <Button
          variant={APP_COLOR.Info}
          onClick={() => {
            const element = document.getElementById("root");
            element?.scrollIntoView();
          }}
        >
          <i
            className={setClassName("arrow-up-circle")}
            style={{ fontSize: "1.16rem" }}
          ></i>
        </Button>
        <Button
          variant={APP_COLOR.Info}
          onClick={() => {
            const element = document.getElementById("pre-view-top");
            element?.scrollIntoView();
          }}
        >
          <i
            className={setClassName("arrow-down-circle")}
            style={{ fontSize: "1.16rem" }}
          ></i>
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm">
        {list.map((item) => {
          return (
            <Button
              variant="dark"
              key={item.id}
              disabled={item.id === _item.id}
              onClick={() => {
                _setItem(item);
              }}
            >
              {item.name}【{item.id}】
            </Button>
          );
        })}
      </ButtonGroup>
      <Viewer3d item={_item} />
      <div
        id="pre-view-bottom"
        style={{ height: "2rem", scrollBehavior: "smooth" }}
      ></div>
    </>
  );
}
