import React from "react";
import { TourWindow } from "../../app/MyContext";
import { GLOBAL_CONSTANT } from "../../three/GLOBAL_CONSTANT";
import { getScene, getSelectedObjects } from "../../three/init3dViewer";
import { createGroupIfNotExist } from "../../three/utils";
import { LabelInfo } from "./LabelInfo";

// 标签信息面板控制器
export class LabelInfoPanelController {
  //全部标签信息面板
  allLabelInfo: LabelInfo[] = [];
  isShow = false;
  panelStatus = 0;
  showPanelTest1 = [
    "1-001-001",
    "1-008-004",
    "1-002-006",
    "1-013-006",
    "1-004-006",
  ];
  showPanelTest = ["C_F1", "C_F2"];
  // 使用箭头函数确保 this 指向正确
  showList = [
    () => this.hideLabel(),
    () => this.showSmallCircle(),
    () => this.showLabel(),
    () => this.showPanel(),
  ];
  dispatchTourWindow: React.Dispatch<TourWindow> | null = null;
  constructor(
    modelName: string,
    isShow: boolean,
    dispatchTourWindow: React.Dispatch<TourWindow>
  ) {
    this.isShow = isShow;
    this.dispatchTourWindow = dispatchTourWindow;
    this.createLabelInfoPanelByModelGroupName(modelName);
  }
  // 初始化标签信息面板控制器

  hideLabel() {
    console.log("hideLabel");
    for (let i = 0; i < this.allLabelInfo.length; i++) {
      const labelInfo = this.allLabelInfo[i];
      labelInfo.css3DSprite.visible = false;
    }
  }

  showSmallCircle() {
    console.log("showSmallCircle");
    this.show([true, false, false]);
  }
  showLabel() {
    console.log("showLabel");
    this.show([true, true, false]);
  }
  showPanel() {
    console.log("showPanel");
    this.show([true, true, true]);
  }
  show(showAreYou: boolean[]) {
    if (this.isShow) {
      for (let i = 0; i < this.allLabelInfo.length; i++) {
        const labelInfo = this.allLabelInfo[i];
        labelInfo.css3DSprite.visible = true;
        const labelDiv = labelInfo.div;

        const labelHeader = labelDiv.children[0] as HTMLElement;

        const headerEye = labelHeader.children[0] as HTMLElement;
        const headerTitle = labelHeader.children[1] as HTMLElement;

        const labelBody = labelDiv.children[1] as HTMLElement;

        headerEye.style.display = showAreYou[0] ? "block" : "none";
        headerTitle.style.display = showAreYou[1] ? "block" : "none";
        labelBody.style.display = showAreYou[2] ? "block" : "none";
      }
    }
  }

  //清空标签信息面板
  clearLabelInfo() {
    this.allLabelInfo = [];
  }
  //展开标签信息面板
  expandLabelInfo() {
    this.panelStatus += 1;
    if (this.panelStatus > 3) {
      this.panelStatus = 0;
    }
    this.showList[this.panelStatus]();
  }

  foldLabelInfo() {
    this.panelStatus -= 1;
    if (this.panelStatus < 0) {
      this.panelStatus = 3;
    }
    this.showList[this.panelStatus]();
  }

  createLabelInfoPanelByModelGroupName(modelGroupName: string) {
    const scene = getScene();
    const MARK_LABEL_INFO = createGroupIfNotExist(
      scene,
      GLOBAL_CONSTANT.MARK_LABEL_INFO,
      true
    );
    if (MARK_LABEL_INFO) {
      scene.add(MARK_LABEL_INFO);
    }
    const group = createGroupIfNotExist(scene, modelGroupName, false);
    if (group) {
      const { children } = group;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (this.showPanelTest.includes(child.name)) {
            getSelectedObjects().push(child);

            const lb = new LabelInfo(child, 0.03, this.dispatchTourWindow!);
            lb.css3DSprite.visible = false;
            scene.add(lb.css3DSprite);
            this.allLabelInfo.push(lb);
          }
        }
      }
    }
  }
}
