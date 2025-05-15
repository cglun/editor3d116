import { createLazyFileRoute } from "@tanstack/react-router";
import Viewer3d from "../../viewer3d/Viewer3d";
import { useEffect, useRef, useState } from "react";
import { setEnableScreenshot } from "../../three/config3d";
import _axios from "../../app/http";

import {
  Button,
  ButtonGroup,
  Container,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import { useUpdateScene } from "../../app/hooks";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import {
  ActionItemMap,
  APP_COLOR,
  Context116,
  RecordItem,
} from "../../app/type";
import { getAll } from "../../three/init3dViewer";

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
  const [listAction, setListAction] = useState<ActionItemMap[]>();

  const { scene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);
  const [_item, _setItem] = useState<RecordItem>();

  const [manyoulist, setmanyoulist] = useState([]);

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
    // 检查 getActionListByButtonMap 方法是否存在
    setListAction(instance.getActionListByButtonMap || []);
  }
  //@ts-expect-error
  function callBackError(error: unknown) {
    // console.log("加载失败----------------", error);
  }
  //@ts-expect-error
  function getProgress(progress: number) {
    // console.log("加载进度----------------", progress);
  }

  const [show, setShow] = useState(false);
  function handleClose() {
    setShow(false);
  }
  useEffect(() => {
    setShow(true);
  }, []);
  const modalBody = useRef<HTMLDivElement>(null);
  const beishu = 1080 / 1920;
  const w = 1100;
  const h = w * beishu;

  return (
    <ListGroup>
      <ListGroupItem>
        <ButtonGroup size="sm">
          <Button
            variant={buttonColor}
            onClick={() => {
              setShow(true);
            }}
          >
            预览场景
          </Button>
        </ButtonGroup>
        <Modal size="xl" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>场景预览</Modal.Title>
          </Modal.Header>
          <Container>
            <ButtonGroup size="sm" className="mt-2">
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
          <Modal.Body ref={modalBody}>
            {_item && (
              <Viewer3d
                canvasStyle={{
                  width: w + "px",
                  height: h + "px",
                }}
                item={_item}
                callBack={callBack}
                callBackError={callBackError}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <ButtonGroup size="sm" className="ms-2">
              {listAction?.map((item: ActionItemMap, index: number) => {
                return (
                  <Button
                    variant={buttonColor}
                    key={index}
                    onClick={() => {
                      if (item.handler) {
                        item.handler();
                      }
                    }}
                  >
                    {item.name}
                  </Button>
                );
              })}
              <Button variant={APP_COLOR.Danger} onClick={handleClose}>
                关闭
              </Button>
              <Button
                variant={APP_COLOR.Primary}
                onClick={() => {
                  const { actionMixerList } = getAll().parameters3d;
                  console.log(actionMixerList);

                  for (let index = 0; index < actionMixerList.length; index++) {
                    const element = actionMixerList[index];

                    element.play();
                  }
                }}
              >
                漫游
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal>
      </ListGroupItem>
    </ListGroup>
  );
}
