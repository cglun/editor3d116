import ListGroup from "react-bootstrap/esm/ListGroup";

import { getScene, setSelectedObject } from "../../../three/init3dEditor";

import { useUpdateScene } from "../../../app/hooks";
import Icon from "../../common/Icon";

export function OutlineViewScene() {
  const { scene, updateScene } = useUpdateScene();
  const object3D = scene.payload;
  return (
    object3D && (
      <ListGroup.Item
        className={"d-flex justify-content-between"}
        style={{ cursor: "pointer" }}
        onClick={() => {
          // object3D.userData.isSelected = !object3D.userData.isSelected;
          setSelectedObject(object3D);
          updateScene(getScene());
        }}
      >
        <div>
          <Icon iconName="box2" gap={2} />
          场景
        </div>
      </ListGroup.Item>
    )
  );
}
