import Form from "react-bootstrap/esm/Form";

import { useUpdateScene } from "../../app/hooks";
import { getScene } from "../../three/init3dEditor";
import { config3d } from "../../three/config3d";

export function ConfigCheck({
  label = "标签",
  configKey = "css2d",
  callBack,
}: {
  label: string;
  configKey: keyof typeof config3d;
  callBack?: any;
}) {
  const { scene, updateScene } = useUpdateScene();
  const { config3d } = scene.payload.userData;
  const _configKey = configKey as keyof typeof config3d;
  return (
    <Form>
      <Form.Check
        label={label}
        type="switch"
        checked={config3d[_configKey]}
        onChange={() => {
          config3d[_configKey] = !config3d[_configKey];

          if (callBack) {
            callBack();
          }

          // if (!config3d[_configKey]) {
          //   cleaerOldLabel();
          // }
          updateScene(getScene());
        }}
      />
    </Form>
  );
}
