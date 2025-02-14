import React, { useContext, useState } from "react";
import { Button, ListGroupItem } from "react-bootstrap";
import { setClassName } from "../../app/utils";
import { getObjectNameByName } from "../../three/utils";
import { SPACE } from "../../app/config";
import { APP_COLOR, UserDataType } from "../../app/type";
import { Object3D, Object3DEventMap } from "three";
import ModalConfirm3d from "../common/ModalConfirm3d";
import AlertBase from "../common/AlertBase";
import Toast3d from "../common/Toast3d";
import { getScene, setTransformControls } from "../../three/init3dEditor";
import { MyContext } from "../../app/MyContext";

const TreeNode = ({
  node,
  setCurObj3d,
  onToggle,
  resetTextWarning,
}: {
  node: Object3D;
  setCurObj3d: (obj: Object3D) => void;

  onToggle: (uuid: string, isExpanded: boolean) => void;
  resetTextWarning: (targetItem: Object3D) => void;
}) => {
  if (node.userData.isHelper) {
    return;
  }
  const hasChildren = node.children && node.children.length > 0;
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [delBtn, setDelBtn] = React.useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const { dispatchScene } = useContext(MyContext);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    resetTextWarning(node);
    setIsSelected(!isSelected);
    setCurObj3d(node);
    setTransformControls([node]);
    onToggle(node.uuid, !isExpanded);
  };

  const delMesh = (e: Event | any, item: Object3D) => {
    e.stopPropagation();
    e.preventDefault();

    ModalConfirm3d(
      {
        title: "删除",
        body: (
          <AlertBase type={APP_COLOR.Danger} text={getObjectNameByName(item)} />
        ),
      },
      () => {
        const scene = getScene();
        const targetItem = scene.getObjectByProperty("uuid", item.uuid);
        if (targetItem === undefined) {
          return;
        }
        if (targetItem.parent == null) {
          return;
        }

        targetItem.parent.remove(targetItem);

        dispatchScene({
          type: "setScene",
          payload: scene,
        });
        Toast3d(`【${getObjectNameByName(item)}】已删除`);
      }
    );
    // 删除提示
  };
  function getLogo(item: Object3D | any) {
    let logo = "hexagon";
    if (item.isMesh) logo = "box";

    if (item.isGroup) logo = "collection";

    if (item.isLight) logo = "lightbulb";

    return <i className={setClassName(logo)}></i>;
  }

  const light = `d-flex justify-content-between ${node.userData.isSelected ? "text-warning" : ""}`;
  if (node.userData.type === UserDataType.TransformHelper) {
    return;
  }

  return (
    <>
      <ListGroupItem>
        <div
          className={light}
          onClick={handleToggle}
          onMouseEnter={() => setDelBtn(true)}
          onMouseLeave={() => setDelBtn(false)}
        >
          <div>
            {getLogo(node)} {SPACE}
            {getObjectNameByName(node)}
          </div>
          <div>
            {delBtn ? (
              <Button
                size="sm"
                variant={APP_COLOR.Dark}
                className="me-1"
                onClick={(e) => delMesh(e, node)}
              >
                <i className={setClassName("trash")}></i>
              </Button>
            ) : (
              ""
            )}
            {hasChildren ? (
              isExpanded ? (
                <i className={setClassName("dash-square")}></i>
              ) : (
                <i className={setClassName("plus-square")}></i>
              )
            ) : (
              ""
            )}
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.uuid}
                node={child}
                setCurObj3d={setCurObj3d}
                onToggle={onToggle}
                resetTextWarning={resetTextWarning}
              />
            ))}
          </div>
        )}
      </ListGroupItem>
    </>
  );
};

const TreeList = ({
  data,
  setCurObj3d,
  resetTextWarning,
}: {
  data: Object3D[];
  setCurObj3d: (obj: Object3D) => void;
  resetTextWarning: (targetItem: Object3D) => void;
}) => {
  return (
    <>
      {data.map((node: Object3D<Object3DEventMap>) => (
        <TreeNode
          key={node.uuid}
          node={node}
          onToggle={() => {}}
          setCurObj3d={setCurObj3d}
          resetTextWarning={resetTextWarning}
        />
      ))}
    </>
  );
};

export default TreeList;
