import Form from "react-bootstrap/esm/Form";
import { useUpdateScene } from "../../app/hooks";
import { getScene } from "../../three/init3dEditor";
import { config3d } from "../../three/config3d";

import InputGroup from "react-bootstrap/esm/InputGroup";
export function ConfigCheck({
  label = "label",
  configKey = "css2d",
  disabled = false,
  callBack,
}: {
  label: string;
  configKey: keyof typeof config3d;
  disabled?: boolean;
  callBack?: () => void;
}) {
  const { scene, updateScene } = useUpdateScene();
  if (scene.payload.userData.config3d === undefined) {
    return;
  }
  const _configKey = configKey as keyof typeof config3d;
  let checked = scene.payload.userData.config3d[_configKey];

  //后期加配置项目，如果保存的场景配置项目为undefined，默认加上，防止报错
  if (checked === undefined) {
    checked = true;
    getScene().userData.config3d[_configKey] = true;
  }
  return (
    <InputGroup size="sm">
      <Form.Text>
        <Form.Check
          label={label}
          id={`switch${_configKey}`}
          type="switch"
          checked={checked}
          disabled={disabled}
          onChange={() => {
            const _config3d = getScene().userData.config3d;
            _config3d[_configKey] = !_config3d[_configKey];
            if (callBack) {
              callBack();
            }
            updateScene(getScene());
          }}
        ></Form.Check>
      </Form.Text>
    </InputGroup>
  );
}
