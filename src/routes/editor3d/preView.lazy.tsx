import { createLazyFileRoute } from "@tanstack/react-router";
import Viewer3d from "../../viewer3d/Viewer3d";
import { useEffect, useState } from "react";
import { setEnableScreenshot } from "../../three/config3d";
import _axios from "../../app/http";
import { testData2 } from "../../app/testData";
import { Button, ButtonGroup } from "react-bootstrap";
import { useUpdateScene } from "../../app/hooks";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import { ActionItem, EditorExportObject } from "../../app/type";

// 定义响应数据的类型
interface PageListResponse {
  code: number;
  message: string;
  data: {
    records: {
      id: number;
      name: string;
      des: string;
      cover: string;
    }[];
  };
}

export const Route = createLazyFileRoute("/editor3d/preView")({
  component: RouteComponent,
});

function RouteComponent() {
  const [list, setList] =
    useState<{ id: number; name: string; des: string; cover: string }[]>(
      testData2
    );
  const [_item, _setItem] = useState({
    id: 296,
    name: "立方体",
    des: "Scene",
    cover: "",
  });
  const [actionList, setActionList] = useState<ActionItem[]>([]);
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const btnColor = getButtonColor(themeColor);

  useEffect(() => {
    setEnableScreenshot(true);
    // 指定响应数据的类型
    _axios
      .post<PageListResponse>("/project/pageList/", { size: 1000 })
      .then((res) => {
        if (res.data.code === 200) {
          const message = res.data.message;
          if (message) {
            return;
          }
          const records = res.data.data.records;
          const sceneList = records.filter((item) => {
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

  function callBack(instance: EditorExportObject) {
    const actionList = instance.getActionList();

    setActionList(actionList);
  }

  return (
    <div
      onMouseLeave={() => {
        const element = document.getElementById("root");
        element?.scrollIntoView();
      }}
    >
      <div
        id="pre-view-top"
        style={{ height: "2rem", scrollBehavior: "smooth" }}
      ></div>

      <ButtonGroup size="sm">
        {list.map(
          (item: { id: number; name: string; des: string; cover: string }) => {
            return (
              <Button
                variant={btnColor}
                key={item.id}
                disabled={item.id === _item.id}
                onClick={() => {
                  _setItem(item);
                }}
              >
                id_{item.id}_{item.name}
              </Button>
            );
          }
        )}
      </ButtonGroup>

      <ButtonGroup size="sm" className="ms-2">
        {actionList &&
          actionList.map((item: ActionItem) => {
            return (
              <Button
                variant={btnColor}
                key={item.id}
                onClick={() => {
                  item.handler();
                }}
              >
                {item.name}
              </Button>
            );
          })}
      </ButtonGroup>
      <div
        onMouseEnter={() => {
          const element = document.getElementById("pre-view-top");
          element?.scrollIntoView();
        }}
      >
        <Viewer3d item={_item} callBack={callBack} />
      </div>
    </div>
  );
}
