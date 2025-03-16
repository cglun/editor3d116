import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ButtonGroup } from "react-bootstrap";
import { getCamera, getScene } from "../../three/init3dEditor";
import { Scene } from "three";
import { cameraTween } from "../../three/animate";
import Toast3d from "../../component/common/Toast3d";
import { getButtonColor } from "../../app/config";
export const Route = createLazyFileRoute("/editor3d/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const btnColor = getButtonColor();
  const { useTween } = getScene().userData.config3d;

  return (
    <ButtonGroup className="mt-2 ms-2" size="sm">
      <ButtonXX />
      <ButtonXX attr="children" />
      <ButtonXX attr="userData" />
      <Button
        variant={btnColor}
        disabled={!useTween}
        onClick={() => {
          const { perspectiveCameraPosition } = getScene().userData;
          const c = getCamera();
          c.position.set(8, 8, 8);
          cameraTween(c, perspectiveCameraPosition).start();
          console.log(getScene().userData);
        }}
      >
        相机动画
      </Button>

      <Button
        variant={btnColor}
        onClick={() => {
          const scene = getScene();
          scene.traverse((child: any) => {
            if (child.isMesh) {
              child.visible = true;
            }
          });
        }}
      >
        显示
      </Button>
      <Button
        variant={btnColor}
        onClick={() => {
          const scene = getScene();
          scene.traverse((child: any) => {
            if (child.isMesh) {
              child.visible = false;
            }
          });
        }}
      >
        隐藏
      </Button>
    </ButtonGroup>
  );

  function ButtonXX({ attr }: { attr?: keyof typeof Scene.prototype }) {
    let title = "scene";
    if (attr) {
      title = "scene." + attr;
    }
    return (
      <Button
        variant={btnColor}
        onClick={() => {
          const scene = getScene();
          if (attr !== undefined) {
            console.log(scene[attr]);
          } else {
            console.log(scene);
          }
          Toast3d("查看控制台");
        }}
      >
        {title}
      </Button>
    );
  }
}
