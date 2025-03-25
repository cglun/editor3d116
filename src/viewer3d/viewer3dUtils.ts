import { getScene } from "../three/init3dViewer";
import { createGroupIfNotExist } from "../three/utils";

export function showModelByName(groupName: string, show: boolean) {
  const MODEL_GROUP = createGroupIfNotExist(getScene(), "test.glb", false);
  MODEL_GROUP?.traverse((item) => {
    item.visible = false;
  });

  const groups = createGroupIfNotExist(getScene(), groupName, false);
  groups?.traverse((item) => {
    item.visible = show;
  });
  if (MODEL_GROUP) {
    MODEL_GROUP.visible = show;
  }
  if (groups) {
    groups.visible = show;
  }
}
export interface ActionItem {
  name: string;
  id: string;
  handler: () => void;
}
export function getActionList(): ActionItem[] {
  const scene = getScene();
  if (!scene) {
    return [];
  }

  const MODEL_GROUP = createGroupIfNotExist(scene, "test.glb", false);
  const GROUND = createGroupIfNotExist(scene, "GROUND", false);

  const actionList: ActionItem[] = [
    {
      name: "全部",
      id: "0",
      handler: () => {
        showModelByName("test.glb", true);
      },
    },
  ];
  if (MODEL_GROUP) {
    const { children } = MODEL_GROUP;
    children.forEach((item) => {
      actionList.push({
        name: "显示" + item.name,
        id: item.id + "",
        handler: () => {
          showModelByName(item.name, true);
          if (GROUND) {
            GROUND.visible = true;
          }
        },
      });
    });
  }
  actionList.pop();
  return actionList;
}
getActionList();
