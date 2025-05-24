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
    dispatchTourWindow: React.Dispatch<TourWindow>
  ) {
    this.mesh = mesh;
    this.dispatchTourWindow = dispatchTourWindow;
    // this.tourObject = tourObject;

    this.init();
  }
  init() {
    this.tourObject.title = getObjectNameByName(this.mesh);
    this.createDiv("geo-alt");

    this.createCss3dLabel(this.tourObject.title);
  }
  createCss3dLabel(name: string) {
    // const div = this.createDiv(logo, name, tourObject, dispatchTourWindow);
    const css3DSprite = new CSS3DSprite(this.div);
    css3DSprite.name = name;
    const { x, y, z } = getObjectWorldPosition(this.mesh);
    css3DSprite.position.set(x, y, z);
    css3DSprite.scale.set(this.size.x, this.size.y, this.size.z);

    this.css3DSprite = css3DSprite;
  }

  createDiv(logo: string) {
    this.div.className = "mark-label";
    const img = document.createElement("i");
    img.className = setClassName(logo);
    this.div.appendChild(img);
    const span = document.createElement("span");
    span.textContent = this.tourObject.title;
    this.div.appendChild(span);
    const i = document.createElement("i");
    i.className = setClassName("eye");
    i.classList.add("ms-2");
    i.style.cursor = "pointer";
    i.setAttribute("data-tour-id", this.tourObject.id);
    i.addEventListener("click", () => {
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
    this.div.appendChild(i);
  }
}
