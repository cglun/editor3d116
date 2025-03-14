import ListGroup from "react-bootstrap/esm/ListGroup";
import { Object3D } from "three";
import {
  getPerspectiveCamera,
  getScene,
  setScene,
  setSelectedObject,
} from "../../../three/init3dEditor";
import { setClassName } from "../../../app/utils";
import { getObjectNameByName } from "../../../three/utils";
import { SPACE } from "../../../app/config";

import { useUpdateScene } from "../../../app/hooks";

export function OutlineViewScene() {
  const { scene, updateScene } = useUpdateScene();
  const object3D = scene.payload;
  return (
    object3D && (
      <ListGroup.Item
        className={`d-flex justify-content-between ${object3D.userData.isSelected ? "text-warning" : ""} `}
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
