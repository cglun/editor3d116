import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, ButtonGroup } from "react-bootstrap";
import { getAll, getCamera, getScene } from "../../three/init3dEditor";
import { Scene } from "three";
import { cameraTween } from "../../three/animate";
import Toast3d from "../../component/common/Toast3d";
import { getButtonColor, getThemeByScene } from "../../app/utils";
import { useUpdateScene } from "../../app/hooks";

export const Route = createLazyFileRoute("/editor3d/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene } = useUpdateScene();
  if (scene.payload.userData.config3d === undefined) {
    return;
  }
  const { useTween } = getScene().userData.config3d;
  const { themeColor } = getThemeByScene(scene);
  const btnColor = getButtonColor(themeColor);

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
        onClick={() => {
          const { actionMixerList } = getAll().parameters3d;

          for (let index = 0; index < actionMixerList.length; index++) {
            const element = actionMixerList[index];
            element.play();
          }
          console.log(actionMixerList);
        }}
      >
        XX
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
