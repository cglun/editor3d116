import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ButtonGroup } from "react-bootstrap";
import { getCamera, getScene } from "../../three/init3dEditor";
import { Scene } from "three";
import { cameraTween } from "../../three/animate";
import Toast3d from "../../component/common/Toast3d";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import { useUpdateScene } from "../../app/hooks";
import { styleBody } from "../../component/Editor/OutlineView/fontColor";

export const Route = createLazyFileRoute("/editor3d/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene } = useUpdateScene();
  if (scene.payload.userData.config3d === undefined) {
    return;
  }
  const { userData } = scene.payload;
  const { useTween } = userData.config3d;
  const { themeColor } = getThemeByScene(scene);
  const btnColor = getButtonColor(themeColor);

  return (
    <ButtonGroup className="mt-2 ms-2" size="sm">
      <ButtonXX />
      <ButtonXX attr="children" />
      <ButtonXX attr="userData" />
      <Button
        style={{
          borderColor: styleBody.color,
        }}
        variant={btnColor}
        disabled={!useTween}
        onClick={() => {
          const { fixedCameraPosition } = getScene().userData;
          const c = getCamera();

          c.position.set(8, 8, 8);
          cameraTween(c, fixedCameraPosition).start();
          console.log(getScene().userData);
        }}
      >
        相机动画
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
        style={{
          borderColor: styleBody.color,
        }}
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
