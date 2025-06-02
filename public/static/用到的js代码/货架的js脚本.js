const controller = context.labelInfoPanelController;
if (controller) {
  controller.isShow = true; // 设置面板显示状态
  controller.setScene(context.getScene());
  controller?.createLabelInfoPanelByModelGroupName("huojia");
  //设置面板的控制器，在其他地方可能要用到
  context.setPanelController && context.setPanelController(controller);
}
//点击按钮的回调函数，对按钮进行扩展
document.getCurrentActionItemMap = function (item) {
  if (controller) {
    if (item.NAME_ID === "全景") {
      controller.resetHighLightModel();
      controller.hideLabel();
      return;
    }

    const boxName = Array.isArray(item.showName)
      ? item.showName[0].slice(2)
      : item.showName.slice(2);
    //controller.canBeShowLabelInfo=[]

    controller.setBoxName(boxName);
    controller.resetHighLightModel();
    controller.hideLabel();
    controller.updateLabelInfoPanel();
  }
};
