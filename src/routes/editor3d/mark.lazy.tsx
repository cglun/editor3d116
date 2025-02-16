import { Scene } from "three";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "react-bootstrap";
import { addLocalModel, getScene, setScene } from "../../three/init3dEditor";
import { getThemeColor } from "../../app/config";

export const Route = createLazyFileRoute("/editor3d/mark")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Button
        variant={getThemeColor()}
        onClick={() => {
          const scene = getScene();
          const blender = scene.getObjectByName("blender");
          if (blender) {
            blender.rotation.y += 0.3;
          } else {
            addLocalModel();
          }
        }}
      >
        旋转猴头
      </Button>
    </div>
  );
}
