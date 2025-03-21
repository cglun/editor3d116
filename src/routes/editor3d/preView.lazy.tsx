import { createLazyFileRoute } from "@tanstack/react-router";
import Viewer3d from "../../viewer3d/Viewer3d";
import React, { useEffect } from "react";
import { setEnableScreenshot } from "../../three/config3d";
import _axios from "../../app/http";
import { testData2 } from "../../app/testData";
import { Button, ButtonGroup, ListGroup, ListGroupItem } from "react-bootstrap";
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
      }
    });
  }, []);

  setEnableScreenshot(true);
  return (
    <>
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
      <Viewer3d item={_item} />;
    </>
  );
}
