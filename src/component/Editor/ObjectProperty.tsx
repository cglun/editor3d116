import { Accordion } from "react-bootstrap";
import { Object3D } from "three";
import { setClassName } from "../../app/utils";

import ObjectPropertyChild from "./ObjectPropertyChild";
/**
 * 物体属性
 * @returns
 */

export default function ObjectProperty({
  curObj3d,
}: {
  curObj3d: Object3D | any;
}) {
  return (
    curObj3d && (
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <i className={setClassName("menu-button")}></i>
          <span className="px-2 ellipsis-3d">属性</span>
        </Accordion.Header>
        <Accordion.Body>
          <ObjectPropertyChild curObj3d={curObj3d}></ObjectPropertyChild>
        </Accordion.Body>
      </Accordion.Item>
    )
  );
}
