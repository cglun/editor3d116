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
import { setClassName, strToJson } from "../../app/utils";
import { APP_COLOR, GlbModel, UserDataType } from "../../app/type";
import ModalConfirm3d from "../common/ModalConfirm3d";
import Toast3d from "../common/Toast3d";
import EditorForm from "../common/EditorForm";
import _axios, { loadAssets } from "../../app/http";
import {
  setCamera,
  setScene,
  getScene,
  glbLoader,
  addGridHelper,
  setBoxHelper,
} from "../../three/init3dEditor";
import { Group, Scene } from "three";
import { MyContext } from "../../app/MyContext";

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
}
function ItemInfoCard(props: Props) {
  const { list, setList, isLoading } = props;
  const { dispatchScene } = useContext(MyContext);

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
    const { id, name } = item;
    const newScene = new Scene();
    _axios.get(`/project/getProjectData/${id}`).then((res) => {
      if (res.data.data) {
        const data = res.data.data;
        const { scene, camera, models, loader } = strToJson(data);

        loader.parse(scene, function (object: Scene | any) {
          const { children, fog, background } = object;
          newScene.children = children;
          newScene.fog = fog;
          newScene.background = background;
          newScene.userData = {
            projectName: name,
            projectId: id,
            canSave: true,
          };

          setScene(newScene);
          addGridHelper();
          setBoxHelper();
          dispatchScene({
            type: "setScene",
            payload: getScene(),
          });
        });

        loader.parse(camera, function (object) {
          setCamera(object);
        });

        models.forEach((item: GlbModel) => {
          loadModelByUrl(item);
        });
      }
    });
  }
  function loadMesh(item: ItemInfo) {
    _axios.get(`/project/getProjectData/${item.id}`).then((res) => {
      if (res.data.data) {
        const data = res.data.data;
        const _data = JSON.parse(data);
        loadModelByUrl(_data);
      }
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

        const { position, rotation, scale } = model;

        const group = new Group();
        group.name = model.name;
        group.add(...gltf.scene.children);
        group.userData = {
          ...model.userData,
          type: UserDataType.GlbModel,
        };
        group.position.set(position.x, position.y, position.z);

        group.position.set(position.x, position.y, position.z);

        // group.rotation.set(rotation._x, rotation._y, rotation._z, "XYZ");
        group.setRotationFromEuler(rotation);
        group.scale.set(scale.x, scale.y, scale.z);

        getScene().add(group);
        dispatchScene({
          type: "setScene",
          payload: getScene(),
        });
        //  gltfToScene(group);
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
