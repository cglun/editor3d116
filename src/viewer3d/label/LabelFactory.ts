import { LabelInfo } from "./LabelInfo";

import { getScene, getSelectedObjects } from "../../three/init3dViewer";
//@ts-expect-error 先做测试，后面再处理，不要问我为什么
import { getScene as editorScene } from "../../three/init3dEditor";

import { GLOBAL_CONSTANT } from "../../three/GLOBAL_CONSTANT";
import { createGroupIfNotExist } from "../../three/utils";

const show = ["1-001-001", "1-008-004", "1-002-006", "1-013-006", "1-004-006"];
export function createLabelInfo(dispatchTourWindow: React.Dispatch<any>) {
  // const labelInfo = new LabelInfo(new Vector3(0, 0, 0));
  //addMark(createCss2dLabel(markName, logo));
  const scene = getScene();
  const MARK_LABEL_INFO = createGroupIfNotExist(
    scene,
    GLOBAL_CONSTANT.MARK_LABEL_INFO,
    true
  );
  if (MARK_LABEL_INFO) {
    scene.add(MARK_LABEL_INFO);
  }

  const group = createGroupIfNotExist(scene, "huojia", false);
  if (group) {
    const { children } = group;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (show.includes(child.name)) {
          getSelectedObjects().push(child);
          const lb = new LabelInfo(child, dispatchTourWindow);
          scene.add(lb.css3DSprite);
        }
      }
    }
  }
}
