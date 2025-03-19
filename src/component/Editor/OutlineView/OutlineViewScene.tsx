import ListGroup from "react-bootstrap/esm/ListGroup";

import { getScene, setSelectedObject } from "../../../three/init3dEditor";
import { setClassName } from "../../../app/utils";
import { getObjectNameByName } from "../../../three/utils";
import { SPACE } from "../../../app/utils";

import { useUpdateScene } from "../../../app/hooks";

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
          <i className={setClassName("box2")}></i>
          {SPACE + getObjectNameByName(object3D)}
        </div>
      </ListGroup.Item>
    )
  );
}
