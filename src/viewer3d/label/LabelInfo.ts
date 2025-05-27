import { CatmullRomCurve3, Object3D, Object3DEventMap, Vector3 } from "three";
import { TourWindow } from "../../app/MyContext";
import { setClassName } from "../../app/utils";
import { getObjectNameByName, getTourSrc } from "../../three/utils";
import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer.js";

import { getObjectWorldPosition } from "../viewer3dUtils";
import { getScene } from "../../three/init3dViewer";
import {
  Line2,
  LineGeometry,
  LineMaterial,
} from "three/examples/jsm/Addons.js";

import { SceneUserData } from "../../app/type";

export class LabelInfo {
  mesh;
  div = document.createElement("div");
  userDataStyles = {
    cardWidth: 116,
    cardHeight: 116,
    cardRadius: 0.8,
    cardBackgroundColor: "#d85555",
    cardBackgroundUrl: "/editor3d/public/static/images/defaultImage3d.png",
    headerFontSize: 18,
    headerColor: "#fe2ffe",
    bodyFontSize: 14,
    bodyColor: "#fee1e1",
    modelHighlightColor: "#aaffaa",
    offsetX: 116 / 2,
    offsetY: 116 / 2,
  };

  tourObject = {
    id: "id",
    title: "title",
  };

  size = 0.04;
  css3DSprite = new CSS3DSprite(this.div);
  dispatchTourWindow: React.Dispatch<TourWindow>;

  constructor(
    mesh: Object3D<Object3DEventMap>,

    dispatchTourWindow: React.Dispatch<TourWindow>
  ) {
    this.mesh = mesh;
    this.dispatchTourWindow = dispatchTourWindow;

    const _userData = getScene().userData as SceneUserData;
    this.userDataStyles = _userData.userStyle;
    this.size = _userData.userStyle.cardSize;
    this.init();
  }
  init() {
    this.tourObject.title = getObjectNameByName(this.mesh);
    this.createDiv();
    this.createCss3dLabel(this.tourObject.title);
  }
  private createCss3dLabel(name: string) {
    const css3DSprite = new CSS3DSprite(this.div);
    css3DSprite.name = name;
    const { x, y, z } = getObjectWorldPosition(this.mesh);
    css3DSprite.position.set(x, y, z);
    css3DSprite.scale.set(this.size, this.size, this.size);

    this.css3DSprite = css3DSprite;
  }

  private createDiv() {
    this.div.className = "mark-label mark-label-div";
    const labelStyle = this.div.style;
    const {
      headerFontSize,
      cardRadius,
      cardBackgroundColor,
      cardBackgroundUrl,
      bodyFontSize,
      headerColor,

      offsetY,
    } = this.userDataStyles;
    labelStyle.width = "auto";
    labelStyle.height = "auto"; // cardHeight + "px";
    labelStyle.borderRadius = cardRadius + "px";
    labelStyle.backgroundColor = cardBackgroundColor;
    labelStyle.backgroundImage = `url(${cardBackgroundUrl})`;
    labelStyle.backgroundRepeat = "no-repeat";
    labelStyle.backgroundPosition = "center center";
    labelStyle.backgroundSize = "cover";
    labelStyle.fontSize = bodyFontSize + "px";
    labelStyle.color = headerColor;
    //const { x, y, z } = getObjectWorldPosition(this.mesh);

    // labelStyle.left = offsetX * this.size + "px";
    labelStyle.top = -(offsetY + offsetY / 2) * this.size + "px";

    // labelStyle.zIndex = "9999"; // 确保标签在最上层
    // labelStyle.pointerEvents = "auto"; // 确保标签可以被点击
    // labelStyle.display = "flex";
    // labelStyle.flexDirection = "column";
    // labelStyle.justifyContent = "center";

    // this.div.style = {
    //   position: "absolute",
    //   top: 230 - userDataStyles.cardWidth / 2 + userDataStyles.offsetY + "px",
    //   left: 300 - userDataStyles.cardHeight / 2 + userDataStyles.offsetX + "px",
    //   width: userDataStyles.cardWidth + "px",
    //   borderRadius: userDataStyles.cardRadius + "px",
    //   // 使用 rgba 格式设置背景色，结合十六进制颜色和透明度
    //   backgroundColor: `rgba(${parseInt(userDataStyles.cardBackgroundColor.slice(1, 3), 16)}, ${parseInt(
    //     userDataStyles.cardBackgroundColor.slice(3, 5),
    //     16
    //   )}, ${parseInt(userDataStyles.cardBackgroundColor.slice(5, 7), 16)}, ${
    //     userDataStyles.cardBackgroundAlpha || 1
    //   })`,
    //   backgroundImage: `url(${userDataStyles.cardBackgroundUrl})`,
    //   backgroundRepeat: "no-repeat",
    //   backgroundPosition: "center center",
    //   backgroundSize: "cover",
    //   height: userDataStyles.cardHeight + "px",
    //   fontSize: userDataStyles.bodyFontSize + "px",
    //   color: userDataStyles.bodyColor,
    // };

    const header = document.createElement("div");
    header.className = "mark-label-header";
    header.style.fontSize = headerFontSize + "px";
    header.style.color = headerColor;

    const eye = document.createElement("i");

    eye.className = setClassName("eye");
    eye.style.cursor = "pointer";
    eye.setAttribute("data-tour-id", this.tourObject.id);

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
    title.style.fontSize = this.userDataStyles.headerColor + "px";
    title.style.color = this.userDataStyles.headerColor;
    title.className = "ms-1";
    title.textContent = this.tourObject.title;
    header.appendChild(title);

    const body = document.createElement("div");
    body.className = "mark-label-body";
    body.style.fontSize = this.userDataStyles.bodyFontSize + "px";
    body.style.color = this.userDataStyles.bodyColor;
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
  createLine(color: string) {
    // const a=new Vector3(this., 0, 0);
    const { x, y, z } = getObjectWorldPosition(this.mesh);

    const size = this.size;
    const start = new Vector3(x, y, z);
    const end = new Vector3(x, y - this.userDataStyles.offsetY * size, z);

    const vector = [start, end];
    // const vector = [start.multiply(this.size), end.multiply(this.size)];
    const curve = new CatmullRomCurve3(vector);
    // const curve = new CatmullRomCurve3(vector, true);

    const points = curve.getPoints(50);
    const lineWidth = 3; // 线条宽度
    // 使用 LineGeometry
    const geometry = new LineGeometry();
    geometry.setPositions(points.flatMap((p) => [p.x, p.y, p.z]));
    // 使用 LineMaterial
    const material = new LineMaterial({
      color,
      linewidth: lineWidth,
      transparent: true, // 开启透明度
      opacity: 0.8, // 设置透明度，让线条有发光感
    });
    // 在渲染器初始化后设置分辨率
    material.resolution.set(window.innerWidth, window.innerHeight);
    material.depthTest = false;

    // 创建 Line2 对象
    const line = new Line2(geometry, material);
    line.visible = true;
    return line;
  }
}
