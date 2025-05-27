import Form from "react-bootstrap/esm/Form";
import { useUpdateScene } from "../../app/hooks";
import { getScene } from "../../three/init3dEditor";
import { config3d } from "../../three/config3d";

import InputGroup from "react-bootstrap/esm/InputGroup";

import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
export function ConfigCheck({
  label = "label",
  configKey = "css2d",
  toolTip = "toolTip",
  disabled = false,
  callBack,
}: {
  label: string;
  configKey: keyof typeof config3d;
  toolTip?: string;
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
      <InputGroup.Text>{label}</InputGroup.Text>
      <InputGroup.Text>
        <OverlayTrigger
          delay={{ show: 250, hide: 250 }}
          overlay={<Tooltip>{toolTip}</Tooltip>}
        >
          <Form>
            <Form.Check
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
          </Form>
        </OverlayTrigger>
      </InputGroup.Text>

      {/* <Form id={`switch${_configKey}`}>
        <Form.Label>
          <InputGroup.Text>
            <Trigger3d title={"dddd"} />
          </InputGroup.Text>
        </Form.Label>
        <Form.Check
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
      </Form> */}
    </InputGroup>
  );
}
