import React from "react";
import { TourWindow } from "../../app/MyContext";
import { GLOBAL_CONSTANT } from "../../three/GLOBAL_CONSTANT";
import { getScene, getSelectedObjects } from "../../three/init3dViewer";
import { createGroupIfNotExist } from "../../three/utils";
import { LabelInfo } from "./LabelInfo";

import { Scene } from "three";
import { SceneUserData } from "../../app/type";

// 标签信息面板控制器
export class LabelInfoPanelController {
  //全部标签信息面板
  allLabelInfo: LabelInfo[] = [];
  isShow = false;
  panelStatus = 0;
  scene: Scene;
  private showPanelTest = [
    "1-001-001",
    "1-008-004",
    "1-002-006",
    "1-013-006",
    "1-004-006",
  ];
  showPanelTest1 = ["C_F1"];
  // 使用箭头函数确保 this 指向正确
  private showList = [
    () => this.hideLabel(),
    () => this.showSmallCircle(),
    () => this.showLabel(),
    () => this.showPanel(),
  ];
  dispatchTourWindow: React.Dispatch<TourWindow> | null = null;
  constructor(
    modelName: string,
    scene: Scene,
    isShow: boolean,
    dispatchTourWindow: React.Dispatch<TourWindow>
  ) {
    this.isShow = isShow;
    this.scene = scene;
    this.dispatchTourWindow = dispatchTourWindow;
    this.createLabelInfoPanelByModelGroupName(modelName);
  }
  // 初始化标签信息面板控制器

  hideLabel() {
    console.log("hideLabel");
    this.panelStatus = 0;
    for (let i = 0; i < this.allLabelInfo.length; i++) {
      const labelInfo = this.allLabelInfo[i];
      labelInfo.css3DSprite.visible = false;
    }
  }

  showSmallCircle() {
    console.log("showSmallCircle");
    this.panelStatus = 1;
    this.show([true, false, false]);
  }
  showLabel() {
    console.log("showLabel");
    this.panelStatus = 2;
    this.show([true, true, false]);
  }
  showPanel() {
    console.log("showPanel");
    this.panelStatus = 3;
    this.show([true, true, true]);
  }
  private show(showAreYou: boolean[]) {
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
    const MARK_LABEL_INFO = createGroupIfNotExist(
      this.scene,
      GLOBAL_CONSTANT.MARK_LABEL_INFO,
      true
    );
    if (MARK_LABEL_INFO) {
      this.scene.add(MARK_LABEL_INFO);
    }
    const group = createGroupIfNotExist(this.scene, modelGroupName, false);
    if (group) {
      const { children } = group;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (this.showPanelTest.includes(child.name)) {
            getSelectedObjects().push(child);

            const lb = new LabelInfo(child, this.dispatchTourWindow!);
            const a = getScene().userData as SceneUserData;

            lb.createLine(a.userStyle.modelHighlightColor);
            lb.css3DSprite.visible = false;
            this.scene.add(lb.css3DSprite);
            this.allLabelInfo.push(lb);
          }
        }
      }
    }
  }
}
