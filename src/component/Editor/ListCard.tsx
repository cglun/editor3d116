import { memo, useContext } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Container,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import AlertBase from "../common/AlertBase";

import { getThemeByScene, setClassName } from "../../app/utils";
import { APP_COLOR, GlbModel } from "../../app/type";
import ModalConfirm3d from "../common/ModalConfirm3d";
import Toast3d from "../common/Toast3d";
import EditorForm from "../common/EditorForm";
import _axios, { loadAssets } from "../../app/http";
import {
  setCamera,
  setScene,
  getScene,
  getControls,
  getCamera,
} from "../../three/init3dEditor";

import {
  glbLoader,
  getProjectData,
  sceneDeserialize,
  setLabel,
  getModelGroup,
  createGroupIfNotExist,
} from "../../three/utils";
import { useUpdateScene } from "../../app/hooks";

import { MyContext } from "../../app/MyContext";
import { runScript } from "../../three/scriptDev";
import { createGridHelper, createNewScene } from "../../three/factory3d";
import { enableShadow } from "../../three/common3d";
import Trigger3d from "../common/fdsfafda";

export interface ItemInfo {
  id: number;
  name: string;
  des: string;
  cover: string;
}

interface Props {
  list: ItemInfo[];
  setList: (list: ItemInfo[]) => void;
  isLoading: boolean;
  error: string;
}
function ItemInfoCard(props: Props) {
  const { list, setList, isLoading, error } = props;
  const { scene, updateScene } = useUpdateScene();
  const { themeColor } = getThemeByScene(scene);

  const { dispatchTourWindow } = useContext(MyContext);

  //错误提示
  if (error.trim().length > 0) {
    return <AlertBase type={APP_COLOR.Warning} text={error} />;
  }

  //加载中……
  if (isLoading) {
    return <Spinner animation="grow" />;
  }

  //无数据
  if (list.length === 0) {
    return <AlertBase type={APP_COLOR.Warning} text={"无数据"} />;
  }

  function deleteBtn(item: ItemInfo, index: number) {
    ModalConfirm3d(
      {
        title: "删除",
        body: <AlertBase type={APP_COLOR.Danger} text={item.name} />,
      },
      () => {
        _axios
          .get(`/project/del/${item.id}`)
          .then((res) => {
            if (res.data.code === 200) {
              const newList = list.filter((_, i) => i !== index);
              setList(newList);
              Toast3d(`【${item.name}】已删除`);
              const { projectId } = getScene().userData;
              if (item.id === projectId) {
                const newScene = createNewScene();
                setScene(newScene);
                updateScene(newScene);
              }
            } else {
              Toast3d(res.data, "提示", APP_COLOR.Warning);
            }
          })
          .catch((error) => {
            Toast3d(error, "提示", APP_COLOR.Warning);
          });
      }
    );
  }

  function editorBtn(item: ItemInfo, _index: number) {
    let newI = { ...item };
    function getNewItem(_newItem: ItemInfo) {
      const newList = list.map((item, index) => {
        if (index === _index) {
          newI = _newItem;
          return _newItem;
        }
        return item;
      });
      setList(newList);
    }

    ModalConfirm3d(
      {
        title: "编辑",
        body: <EditorForm item={item} getNewItem={getNewItem} />,
      },
      () => {
        _axios
          .post(`/project/update/`, {
            id: item.id,
            name: newI.name,
            des: newI.des,
            cover: loadAssets(newI.cover),
          })
          .then((res) => {
            if (res.data.data) {
              Toast3d(`【${item.name}】已修改`);
            } else {
              Toast3d(res.data, "提示", APP_COLOR.Warning);
            }
          })
          .catch((error) => {
            Toast3d(error, "提示", APP_COLOR.Warning);
          });

        Toast3d(`【${item.name}】已修改 `);
      }
    );
  }

  let modelNum = 0;
  function loadScene(item: ItemInfo) {
    getProjectData(item.id)
      .then((data) => {
        const { scene, camera, modelList } = sceneDeserialize(data, item);
        const HELPER_GROUP = createGroupIfNotExist(scene, "HELPER_GROUP");
        HELPER_GROUP?.add(createGridHelper());
        if (HELPER_GROUP) {
          scene.add(HELPER_GROUP);
        }
        setScene(scene);
        setCamera(camera);

        // 加载完成后，设置标签
        setLabel(scene, dispatchTourWindow);

        modelNum = modelList.length;
        if (modelNum === 0) {
          runScript(); // 运行脚本
        }
        modelList.forEach((item: GlbModel) => {
          loadModelByUrl(item);
        });
      })
      .catch((error) => {
        Toast3d(error, "提示", APP_COLOR.Danger);
      });
  }
  function loadMesh(item: ItemInfo) {
    getProjectData(item.id)
      .then((res: string) => {
        loadModelByUrl(JSON.parse(res));
      })
      .catch((error) => {
        Toast3d(error, "提示", APP_COLOR.Danger);
      });
  }

  function loadModelByUrl(model: GlbModel) {
    const loader = glbLoader();
    let progress = 0;

    loader.load(
      model.userData.modelUrl,
      function (gltf) {
        ModalConfirm3d({
          title: "提示",
          body: "加载完成",
          confirmButton: {
            show: false,
          },
        });

        const group = getModelGroup(model, gltf, getScene());
        enableShadow(group, getScene());
        getScene().add(group);

        if (modelNum <= 1) {
          updateScene(getScene());
          // 移除无意义的函数调用
          // getScene();
          getControls();
          getCamera();
          runScript();
          const { javascript } = getScene().userData;
          if (javascript) {
            eval(javascript);
          }
        }
        modelNum--;
      },
      function (xhr) {
        progress = parseFloat(
          ((xhr.loaded / model.userData.modelTotal) * 100).toFixed(2)
        );

        ModalConfirm3d({
          title: "提示",
          body: <ProgressBar now={progress} label={`${progress}%`} />,
          confirmButton: {
            show: true,
            closeButton: false,
            hasButton: false,
          },
        });
      },
      function (error) {
        ModalConfirm3d({
          title: "提示",
          body: " An error happened" + error,
          confirmButton: {
            show: true,
            closeButton: true,
            hasButton: true,
          },
        });
      }
    );
  }

  return (
    <Container fluid className="d-flex flex-wrap">
      {list.map((item: ItemInfo, index: number) => {
        const selectStyle =
          item.des === "Scene" && scene.payload.userData.projectId === item.id
            ? "bg-success"
            : "";
        const cardBodyImg = (
          <Card.Img
            src={loadAssets(item.cover)}
            variant="top"
            style={{ cursor: "crosshair", width: "6rem" }}
          />
        );

        const cardBody =
          item.cover?.trim().length > 0 ? (
            cardBodyImg
          ) : (
            <i className="bi bi-image" style={{ fontSize: "4rem" }}></i>
          );

        return (
          <Card className="ms-2 mt-2" key={index}>
            <Card.Header style={{ width: "6rem" }} className={selectStyle}>
              {item.name.trim() === "" ? (
                <span className="text-warning"> 未命名</span>
              ) : (
                <Trigger3d title={item.name} />
              )}
            </Card.Header>
            <Card.Body
              className="d-flex flex-column text-center"
              style={{ padding: "0" }}
              onClick={() => {
                item.des === "Scene" ? loadScene(item) : loadMesh(item);
              }}
            >
              {cardBody}

              <ButtonGroup aria-label="Basic example" className="mt-2">
                <Button
                  variant={themeColor}
                  size="sm"
                  onClick={() => editorBtn(item, index)}
                >
                  <i className={setClassName("pencil")} title="编辑"></i>
                </Button>
                <Button
                  variant={themeColor}
                  size="sm"
                  onClick={() => deleteBtn(item, index)}
                >
                  <i className={setClassName("trash")} title="删除"></i>
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
}
export default memo(ItemInfoCard);
