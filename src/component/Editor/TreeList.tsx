import React, { memo } from "react";
import { Button, Container, ListGroupItem } from "react-bootstrap";

import { getObjectNameByName } from "../../three/utils";

import { APP_COLOR, UserDataType } from "../../app/type";
import { Group, Light, Mesh, Object3D, Object3DEventMap } from "three";
import ModalConfirm3d from "../common/ModalConfirm3d";
import AlertBase from "../common/AlertBase";
import Toast3d from "../common/Toast3d";
import {
  getScene,
  getTransfControls,
  setSelectedObject,
  setTransformControls,
} from "../../three/init3dEditor";

import { useUpdateScene } from "../../app/hooks";
import Icon from "../common/Icon";

function TreeNode({
  node,
  onToggle,
  resetTextWarning,
}: {
  node: Object3D;
  onToggle: (uuid: string, isExpanded: boolean) => void;
  resetTextWarning: (targetItem: Object3D) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  // 确保所有的 useState 调用和 useUpdateScene 调用都在条件返回之前
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [delBtn, setDelBtn] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(false);
  const { updateScene } = useUpdateScene();

  if (node.userData.isHelper) {
    return null;
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    resetTextWarning(node);
    setIsSelected(!isSelected);
    setSelectedObject(node);
    updateScene(getScene());
    setTransformControls(node);
    onToggle(node.uuid, !isExpanded);
  };

  const delMesh = (e: React.MouseEvent<HTMLButtonElement>, item: Object3D) => {
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
        const transfControls = getTransfControls();
        if (transfControls) {
          transfControls.detach();
        }
        updateScene(scene);
        Toast3d(`【${getObjectNameByName(item)}】已删除`);
      }
    );
    // 删除提示
  };
  function getLogo(item: Object3D) {
    let logo = "hexagon";
    // 修改为使用 instanceof 检查类型
    if (item instanceof Mesh) logo = "box";
    if (item instanceof Group) logo = "collection";
    if (item instanceof Light) logo = "lightbulb";

    return <Icon iconName={logo} />;
  }

  const light = `d-flex justify-content-between ${node.userData.isSelected ? "text-warning" : ""}`;
  if (node.userData.type === UserDataType.TransformHelper) {
    return;
  }

  return (
    <ListGroupItem>
      <Container
        fluid
        className={light}
        onClick={handleToggle}
        onMouseEnter={() => setDelBtn(true)}
        onMouseLeave={() => setDelBtn(false)}
      >
        <div>
          {getLogo(node)}
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
              <Icon iconName="trash" />
            </Button>
          ) : (
            ""
          )}
          {hasChildren ? (
            isExpanded ? (
              <Icon iconName="dash-square" />
            ) : (
              <Icon iconName="plus-square" />
            )
          ) : (
            ""
          )}
        </div>
      </Container>
      {isExpanded && hasChildren && (
        <>
          {node.children.map((child) => (
            <TreeNode
              key={child.uuid}
              node={child}
              onToggle={onToggle}
              resetTextWarning={resetTextWarning}
            />
          ))}
        </>
      )}
    </ListGroupItem>
  );
}

function TreeList({
  data,
  resetTextWarning,
}: {
  data: Object3D[];
  resetTextWarning: (targetItem: Object3D) => void;
}) {
  return (
    <>
      {data.map((node: Object3D<Object3DEventMap>) => (
        <TreeNode
          key={node.uuid}
          node={node}
          onToggle={() => {}}
          resetTextWarning={resetTextWarning}
        />
      ))}
    </>
  );
}

export default memo(TreeList);
