import { createLazyFileRoute } from "@tanstack/react-router";
import Viewer3d from "../../viewer3d/Viewer3d";
import { useEffect, useState } from "react";
import { setEnableScreenshot } from "../../three/config3d";
import _axios from "../../app/http";

import { Button, ButtonGroup } from "react-bootstrap";
import { useUpdateScene } from "../../app/hooks";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import { ActionItem, Context116, RecordItem } from "../../app/type";

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
  const [list, setList] = useState<RecordItem[]>([]);
  const [actionList, setActionList] = useState<ActionItem[]>([]);
  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const btnColor = getButtonColor(themeColor);
  const [_item, _setItem] = useState<RecordItem>();

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

  function callBack(instance: Context116) {
    const actionList = instance.getActionList();

    setActionList(actionList);
  }
  function callBackError(error: unknown) {
    console.log("加载失败----------------", error);
  }
  //@ts-expect-error
  function getProgress(progress: number) {
    console.log("加载进度----------------", progress);
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
        className="sticky-top"
        style={{ height: "2rem", scrollBehavior: "smooth" }}
      >
        —————————————————鼠标滑到下面画布—————————————————
      </div>

      <ButtonGroup size="sm">
        {list.map(
          (item: { id: number; name: string; des: string; cover: string }) => {
            return (
              <Button
                variant={btnColor}
                key={item.id}
                // Bug 修复：添加 _item 判空检查
                disabled={_item && item.id === _item.id}
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
        {_item && (
          <Viewer3d
            item={_item}
            callBack={callBack}
            callBackError={callBackError}
          />
        )}
      </div>
    </div>
  );
}
