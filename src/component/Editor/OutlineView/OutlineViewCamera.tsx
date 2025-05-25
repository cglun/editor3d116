import ListGroup from "react-bootstrap/esm/ListGroup";
import { Camera, OrthographicCamera, PerspectiveCamera } from "three";
import {
  getPerspectiveCamera,
  getScene,
  setSelectedObject,
} from "../../../three/init3dEditor";
import Button from "react-bootstrap/esm/Button";
import { APP_COLOR } from "../../../app/type";
import Toast3d from "../../common/Toast3d";
import { cameraTween } from "../../../three/animate";
import { useUpdateScene } from "../../../app/hooks";
import Icon from "../../common/Icon";

export function OutlineViewCamera({
  object3D,
  _setCamera,
}: {
  object3D: PerspectiveCamera | OrthographicCamera | Camera;
  _setCamera: (camera: PerspectiveCamera | OrthographicCamera) => void;
}) {
  const { updateScene } = useUpdateScene();
  return (
    object3D && (
      <ListGroup.Item
        className={"d-flex justify-content-between"}
        style={{ cursor: "pointer" }}
        onClick={() => {
          // object3D.userData.isSelected = !object3D.userData.isSelected;
          if (
            object3D instanceof PerspectiveCamera ||
            object3D instanceof OrthographicCamera
          ) {
            _setCamera(object3D);
          }
          setSelectedObject(object3D);
          updateScene(getScene());
        }}
      >
        <Icon iconName="camera-reels" />
        <div>
          <Button
            className="me-1"
            size="sm"
            variant={APP_COLOR.Secondary}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const _scene = getScene();
              _scene.userData.fixedCameraPosition =
                getPerspectiveCamera().position.clone();
              Toast3d("初始位置已设置");
            }}
          >
            <Icon
              iconName="pin-angle"
              gap={0}
              title="固定相机位置"
              fontSize={0.8}
            />
          </Button>
          <Button
            size="sm"
            title="到初始位置"
            variant={APP_COLOR.Secondary}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const _scene = getScene();
              const camera = getPerspectiveCamera();
              const { fixedCameraPosition } = _scene.userData;
              cameraTween(camera, fixedCameraPosition, 500).start();
            }}
          >
            <Icon
              iconName="display"
              gap={0}
              title="到初始位置"
              fontSize={0.8}
            />
          </Button>
        </div>
      </ListGroup.Item>
    )
  );
}
