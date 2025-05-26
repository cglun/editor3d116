import ListGroup from "react-bootstrap/esm/ListGroup";

import { getScene, setSelectedObject } from "../../../three/init3dEditor";

import { useUpdateScene } from "../../../app/hooks";
import Icon from "../../common/Icon";
import { styleBody } from "./fontColor";

export function OutlineViewScene() {
  const { scene, updateScene } = useUpdateScene();
  const object3D = scene.payload;
  return (
    object3D && (
      <ListGroup.Item
        className={"d-flex justify-content-between"}
        style={styleBody}
        onClick={() => {
          // object3D.userData.isSelected = !object3D.userData.isSelected;
          setSelectedObject(object3D);
          updateScene(getScene());
        }}
      >
        <div>
          <Icon iconName="box2" gap={1} color={styleBody.color} />
          场景
        </div>
      </ListGroup.Item>
    )
  );
}
