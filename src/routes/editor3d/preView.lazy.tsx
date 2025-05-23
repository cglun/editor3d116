import {
  Button,
  ButtonGroup,
  Container,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import { createLazyFileRoute } from "@tanstack/react-router";
import Viewer3d from "../../viewer3d/Viewer3d";
import { useEffect, useRef, useState } from "react";
import { setEnableScreenshot } from "../../three/config3d";
import _axios from "../../app/http";

import { useUpdateScene } from "../../app/hooks";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import {
  ActionItemMap,
  APP_COLOR,
  Context116,
  RecordItem,
} from "../../app/type";
import { getCamera } from "../../three/init3dViewer";
import { resetListGroupIsClick } from "../../viewer3d/buttonList/buttonGroup";

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
  const [listScene, setListScene] = useState<RecordItem[]>([]);
  const [toggleButtonList, setToggleButtonList] = useState<ActionItemMap[]>();
  const [roamButtonList, setRoamButtonList] = useState<ActionItemMap[]>([]);

  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
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
          const records: RecordItem[] = res.data.data.records;
          const sceneList = records.filter((item) => {
            if (item.des === "Scene") {
              item.id = parseInt(item.id.toString());
              return item;
            }
          });

          setListScene(sceneList);
          //获取url的参数 值
          const urlParams = new URLSearchParams(window.location.search);
          const sceneId = urlParams.get("sceneId");
          if (sceneId) {
            _setItem({
              id: parseInt(sceneId),
              name: "场景预览",
              des: "Scene",
              cover: "",
            });
            return;
          }
          _setItem(sceneList[0]);
        }
      });
  }, []);

  function callBack(instance: Context116) {
    // 检查 getToggleButtonGroup 方法是否存在
    setToggleButtonList(instance.getToggleButtonGroup || []);
    setRoamButtonList(instance.getRoamListByRoamButtonMap || []);
  }

  function callBackError(error: unknown) {
    console.log("加载失败", error);
  }
  //@ts-expect-error 忽略类型检查，暂时不清楚 progress 相关完整类型定义
  function getProgress(progress: number) {
    // console.log("加载进度----------------", progress);
  }

  const [show, setShow] = useState(false);
  function handleClose() {
    setShow(false);
  }
  const modalBody = useRef<HTMLDivElement>(null);
  const beishu = window.innerHeight / window.innerWidth; // 将 beishu 计算移到这里
  const [size3d, setSize3d] = useState({
    w: 1138,
    h: 1138 * beishu,
  });

  useEffect(() => {
    setShow(true);
    function handleResize3d() {
      if (modalBody.current) {
        const _w = modalBody.current?.clientWidth || 1138;
        const _h =
          modalBody.current?.clientHeight ||
          modalBody.current?.clientWidth * beishu;

        setSize3d({ w: _w, h: _h });
      }
    }
    window.addEventListener("resize", handleResize3d);
    handleResize3d();

    return () => {
      window.removeEventListener("resize", handleResize3d);
    };
  }, []);

  // 点击按钮后，将其他按钮的 isClick 置为 false
  function handleClickResize(
    index: number,
    buttonList: ActionItemMap[],
    setToggleButtonList: (value: ActionItemMap[]) => void
  ) {
    const newListGroup = resetListGroupIsClick(buttonList);
    newListGroup[index].isClick = !newListGroup[index].isClick;
    setToggleButtonList(newListGroup);
  }

  return (
    <ListGroup>
      <ListGroupItem>
        <ButtonGroup size="sm">
          {!show && (
            <Button
              variant={buttonColor}
              onClick={() => {
                setShow(true);
              }}
            >
              预览场景
            </Button>
          )}
        </ButtonGroup>
        <Modal size="xl" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>场景预览</Modal.Title>
          </Modal.Header>
          <Container>
            <ButtonGroup size="sm">
              {listScene.map((item: RecordItem) => {
                return (
                  <Button
                    variant={buttonColor}
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
              })}
            </ButtonGroup>
          </Container>
          <Modal.Body ref={modalBody} style={{ padding: 0 }}>
            {_item && (
              <Viewer3d
                canvasStyle={{
                  width: size3d.w + "px",
                  height: size3d.h + "px",
                }}
                item={_item}
                callBack={callBack}
                callBackError={callBackError}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <ButtonGroup size="sm">
              {toggleButtonList?.map((item: ActionItemMap, index: number) => {
                return (
                  <Button
                    variant={buttonColor}
                    key={index}
                    onClick={() => {
                      if (item.handler) {
                        item.handler();
                        handleClickResize(
                          index,
                          toggleButtonList,
                          setToggleButtonList
                        );
                      }
                    }}
                  >
                    {item.showName} {/* 显示按钮的名称 */}
                  </Button>
                );
              })}

              {roamButtonList.map((item: ActionItemMap, index: number) => {
                const isStart = item.NAME_ID.includes("START");
                return (
                  <Button
                    variant={buttonColor}
                    key={index}
                    onClick={() => {
                      if (item.handler) {
                        // handleClickResize(
                        //   index,
                        //   roamButtonList,
                        //   setRoamButtonList
                        // );
                        const name = item.NAME_ID.split("_AN_")[0];
                        item.handler(item.NAME_ID);
                        const nameId = isStart
                          ? `${name}_AN_STOP`
                          : `${name}_AN_START`;
                        setRoamButtonList((prevList) => {
                          return prevList.map((prevItem) => {
                            if (prevItem.NAME_ID === item.NAME_ID) {
                              return {
                                ...prevItem,
                                NAME_ID: nameId,
                              };
                            }
                            return prevItem;
                          });
                        });
                      }
                    }}
                  >
                    {isStart ? item.showName[0] : item.showName[1]}
                  </Button>
                );
              })}
            </ButtonGroup>
            <ButtonGroup size="sm" className="mt-2">
              <Button
                variant={APP_COLOR.Primary}
                onClick={() => {
                  const { x, y, z } = getCamera().position;
                  const cameraX = x.toFixed(2);
                  const cameraY = y.toFixed(2);
                  const cameraZ = z.toFixed(2);

                  alert(
                    `"cameraPosition":{"x":${cameraX},"y":${cameraY},"z":${cameraZ}}                        `
                  );
                }}
              >
                当前相机位置
              </Button>
              <Button variant={APP_COLOR.Danger} onClick={handleClose}>
                关闭
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal>
      </ListGroupItem>
    </ListGroup>
  );
}
