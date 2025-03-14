import Form from "react-bootstrap/esm/Form";
import { cleaerOldLabel } from "../../three/utils";
import { useUpdateScene } from "../../app/hooks";
import { getScene } from "../../three/init3dEditor";
import { config3d } from "../../three/init3dEditor";
export function ConfigCheck({
  label = "标签",
  configKey = "css2d",
}: {
  label: string;
  configKey: keyof typeof config3d;
}) {
  const { scene, updateScene } = useUpdateScene();
  const { config3d } = scene.payload.userData;
  const _configKey = configKey as keyof typeof config3d;
  return (
    <Form className="ms-2">
      <Form.Check
        label={label}
        type="switch"
        checked={config3d[_configKey]}
        onChange={() => {
          config3d[_configKey] = !config3d[_configKey];
          updateScene(getScene());
          if (!config3d[_configKey]) {
            cleaerOldLabel();
          }
        }}
      />
    </Form>
  );
}
