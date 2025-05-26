import { Object3D, Object3DEventMap, Vector3 } from "three";
import { TourWindow } from "../../app/MyContext";
import { setClassName } from "../../app/utils";
import { getObjectNameByName, getTourSrc } from "../../three/utils";
import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer.js";

import { getObjectWorldPosition } from "../viewer3dUtils";

export class LabelInfo {
  mesh;
  div = document.createElement("div");

  tourObject = {
    id: "id",
    title: "title",
  };

  size = new Vector3(0.04, 0.04, 0.04);
  css3DSprite = new CSS3DSprite(this.div);
  dispatchTourWindow: React.Dispatch<TourWindow>;

  constructor(
    mesh: Object3D<Object3DEventMap>,
    size: number,
    dispatchTourWindow: React.Dispatch<TourWindow>
  ) {
    this.mesh = mesh;
    this.dispatchTourWindow = dispatchTourWindow;
    // this.tourObject = tourObject;
    this.size = new Vector3(size, size, size);
    this.init();
  }
  init() {
    this.tourObject.title = getObjectNameByName(this.mesh);
    this.createDiv();
    this.createCss3dLabel(this.tourObject.title);
  }
  createCss3dLabel(name: string) {
    const css3DSprite = new CSS3DSprite(this.div);
    css3DSprite.name = name;
    const { x, y, z } = getObjectWorldPosition(this.mesh);
    css3DSprite.position.set(x, y, z);
    css3DSprite.scale.set(this.size.x, this.size.y, this.size.z);

    this.css3DSprite = css3DSprite;
  }

  createDiv() {
    this.div.className = "mark-label mark-label-div";

    const header = document.createElement("div");
    header.className = "mark-label-header";

    const eye = document.createElement("i");

    eye.className = setClassName("eye");
    eye.style.cursor = "pointer";
    eye.setAttribute("data-tour-id", this.tourObject.id);
    this.dispatchTourWindow;
    eye.addEventListener("click", () => {
      // 使用箭头函数保证 this 指向实例
      if (this.dispatchTourWindow) {
        this.dispatchTourWindow({
          type: "tourWindow",
          payload: {
            show: true,
            title: this.tourObject.title,
            tourSrc: getTourSrc(this.tourObject.id),
          },
        });
      }
    });
    header.appendChild(eye);

    const title = document.createElement("span");
    title.className = "ms-1";
    title.textContent = this.tourObject.title;
    header.appendChild(title);

    const body = document.createElement("div");
    body.className = "mark-label-body";

    const p1 = document.createElement("p");
    p1.textContent = "档案号：116";
    const p2 = document.createElement("p");
    p2.textContent = "描述：档案描述";
    const p3 = document.createElement("p");
    p3.textContent = "详细信息：档案详细信息";
    body.appendChild(p1);
    body.appendChild(p2);
    body.appendChild(p3);

    this.div.appendChild(header);
    this.div.appendChild(body);
  }
}
