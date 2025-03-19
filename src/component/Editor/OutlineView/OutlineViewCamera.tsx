import ListGroup from "react-bootstrap/esm/ListGroup";
import { Object3D } from "three";
import {
  getPerspectiveCamera,
  getScene,
  setSelectedObject,
} from "../../../three/init3dEditor";
import { setClassName } from "../../../app/utils";
import { getObjectNameByName } from "../../../three/utils";
import { SPACE } from "../../../app/utils";
import Button from "react-bootstrap/esm/Button";
import { APP_COLOR } from "../../../app/type";
import Toast3d from "../../common/Toast3d";
import { cameraTween } from "../../../three/animate";
import { useUpdateScene } from "../../../app/hooks";

export function OutlineViewCamera({
  object3D,
  _setCamera,
}: {
  object3D: Object3D | any;
  resetTextWarning: any;
  _setCamera: any;
}) {
  const { updateScene } = useUpdateScene();
  return (
    object3D && (
      <ListGroup.Item
        className={"d-flex justify-content-between"}
        style={{ cursor: "pointer" }}
        onClick={() => {
          // object3D.userData.isSelected = !object3D.userData.isSelected;
          _setCamera(object3D);
          setSelectedObject(object3D);
          updateScene(getScene());
        }}
      >
        <div>
          <i className={setClassName("camera-reels")}></i>
          {SPACE + getObjectNameByName(object3D)}

          <Button
            className="ms-2"
            size="sm"
            title="相机初始位置"
            variant={APP_COLOR.Secondary}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const _scene = getScene();
              _scene.userData.fiexedCameraPosition =
                getPerspectiveCamera().position.clone();
              Toast3d("初始位置已设置");
            }}
          >
            固定
          </Button>
          <Button
            className="ms-2"
            size="sm"
            title="到初始位置"
            variant={APP_COLOR.Secondary}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const _scene = getScene();
              const camera = getPerspectiveCamera();
              const { fiexedCameraPosition } = _scene.userData;
              cameraTween(camera, fiexedCameraPosition, 500).start();
            }}
          >
            初始
          </Button>
        </div>
      </ListGroup.Item>
    )
  );
}
