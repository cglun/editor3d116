//@ts-expect-error 先做测试，后面再处理，不要问我为什么
import { getScene as editorScene } from "../../three/init3dEditor";
import { LabelInfoPanelController } from "./LabelInfoPanelController";

export function jianjian(controller: LabelInfoPanelController) {
  controller.foldLabelInfo();
  console.log(controller.panelStatus);
}
export function jiajia(controller: LabelInfoPanelController) {
  controller.expandLabelInfo();
  console.log(controller.panelStatus);
}
