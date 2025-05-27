import { LabelInfoPanelController } from "./LabelInfoPanelController";

export function jianjian(controller: LabelInfoPanelController) {
  controller.foldLabelInfo();
  console.log(controller.panelStatus);
}
export function jiajia(controller: LabelInfoPanelController) {
  controller.expandLabelInfo();
  console.log(controller.panelStatus);
}
