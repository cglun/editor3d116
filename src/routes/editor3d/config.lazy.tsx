import { createLazyFileRoute } from "@tanstack/react-router";
import { Form, InputGroup, ListGroup } from "react-bootstrap";
import { getScene } from "../../three/init3dEditor";
import { ConfigCheck } from "../../component/common/ConfigCheck";
import { enableShadow } from "../../three/common3d";
import { config3d } from "../../three/config3d";
import { useUpdateScene } from "../../app/hooks";
import Toast3d from "../../component/common/Toast3d";

import { APP_COLOR, DELAY } from "../../app/type";

export const Route = createLazyFileRoute("/editor3d/config")({
  component: RouteComponent,
});

function RouteComponent() {
  const { scene, updateScene } = useUpdateScene();
  const { FPS } = scene.payload.userData.config3d;

  // 关键帧动画设置
  function setKeyframe() {
    const { useKeyframe } = getScene().userData.config3d;
    if (useKeyframe) {
      Toast3d("保存后，重新加载生效!", "提示", APP_COLOR.Warning, DELAY.LONG);
    }
  }

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
            callBack={() => enableShadow(getScene(), getScene())}
          />
        </InputGroup>
      </ListGroup.Item>
      <ListGroup.Item>
        <InputGroup size="sm">
          <ConfigCheck
            label="关键帧动画"
            configKey="useKeyframe"
            callBack={setKeyframe}
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
            <option value={6}>6 (垃圾)</option>
            <option value={24}>24 (能用)</option>
            <option value={30}>30 (够用)</option>
            <option value={60}>60 (好用)</option>
            <option value={120}>120 (顶级)</option>
          </Form.Select>
        </InputGroup>
      </ListGroup.Item>
    </ListGroup>
  );
}
