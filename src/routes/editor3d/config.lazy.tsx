import { createLazyFileRoute } from "@tanstack/react-router";
import { Form, InputGroup, ListGroup } from "react-bootstrap";
import { getScene } from "../../three/init3dEditor";
import { ConfigCheck } from "../../component/common/ConfigCheck";
import { enableShadow } from "../../three/common3d";
import { config3d } from "../../three/config3d";
import { useUpdateScene } from "../../app/hooks";
import Toast3d from "../../component/common/Toast3d";

export const Route = createLazyFileRoute("/editor3d/config")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene();
  const { FPS } = scene.payload.userData.config3d;

  return (
    <ListGroup horizontal className="mt-2">
      <ListGroup.Item>
        <ConfigCheck label="启用Tween" configKey="useTween" />
      </ListGroup.Item>
      <ListGroup.Item>
        <InputGroup size="sm">
          <ConfigCheck
            label="投射阴影"
            configKey="useShadow"
            callBack={() => enableShadow(getScene())}
          />
        </InputGroup>
      </ListGroup.Item>
      <ListGroup.Item>
        <InputGroup size="sm">
          <InputGroup.Text>帧率</InputGroup.Text>
          <Form.Select
            aria-label="FPS"
            value={FPS}
            onChange={(e) => {
              const config: typeof config3d = getScene().userData.config3d;
              config.FPS = Number(e.target.value);
              Toast3d("当前帧率：" + e.target.value);
              updateScene(getScene());
            }}
          >
            <option value={24}>24 (垃圾)</option>
            <option value={30}>30 (一般)</option>
            <option value={60}>60 (推荐)</option>
            <option value={120}>120 (流畅)</option>
          </Form.Select>
        </InputGroup>
      </ListGroup.Item>
    </ListGroup>
  );
}
