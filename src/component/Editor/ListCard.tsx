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
import { getThemeColor } from "../../app/config";
import { setClassName } from "../../app/utils";
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
} from "../../three/utils";
import { useUpdateScene } from "../../app/hooks";

import { MyContext } from "../../app/MyContext";
import { runScript } from "../../three/scriptDev";
import { createGridHelper } from "../../three/common3d";

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
  const { updateScene } = useUpdateScene();
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

  function loadScene(item: ItemInfo) {
    getProjectData(item.id)
      .then((data: any) => {
        const { scene, camera, modelList } = sceneDeserialize(data, item);
        scene.add(createGridHelper());
        setScene(scene);
        setCamera(camera);

        // 加载完成后，设置标签
        setLabel(scene, dispatchTourWindow);
        modelList.forEach((item: GlbModel) => {
          loadModelByUrl(item);
        });
      })
      .catch((error) => {
        Toast3d(error, "提示", APP_COLOR.Danger);
      })
      .finally(() => {
        updateScene(getScene());
        const { javascript } = getScene().userData;
        if (javascript) {
          getScene();
          getControls();
          getCamera();
          eval(javascript);
        }
        runScript();
      });
  }
  function loadMesh(item: ItemInfo) {
    getProjectData(item.id)
      .then((res: any) => {
        loadModelByUrl(JSON.parse(res));
      })
      .catch((error) => {
        Toast3d(error, "提示", APP_COLOR.Danger);
      });
  }

  function loadModelByUrl(model: GlbModel | any) {
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
        const group = getModelGroup(model, gltf);
        getScene().add(group);
        updateScene(getScene());
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
        return (
          <Card className="ms-2 mt-2" key={index}>
            <Card.Header style={{ width: "6rem" }} title={item.name}>
              {item.name.trim() === "" ? (
                <span className="text-warning"> 未命名</span>
              ) : (
                item.name
              )}
            </Card.Header>
            <Card.Body className="d-flex flex-column text-center">
              {item.cover?.trim().length > 0 ? (
                <Card.Img
                  src={loadAssets(item.cover)}
                  variant="top"
                  style={{ cursor: "crosshair" }}
                  onClick={() => {
                    item.des === "Scene" ? loadScene(item) : loadMesh(item);
                  }}
                />
              ) : (
                <i
                  className="bi bi-image"
                  style={{ fontSize: "4rem" }}
                  onClick={() => {
                    item.des === "Scene" ? loadScene(item) : loadMesh(item);
                  }}
                ></i>
              )}

              <ButtonGroup aria-label="Basic example" className="mt-2">
                <Button
                  variant={getThemeColor()}
                  size="sm"
                  onClick={() => editorBtn(item, index)}
                >
                  <i className={setClassName("pencil")} title="编辑"></i>
                </Button>
                <Button
                  variant={getThemeColor()}
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
