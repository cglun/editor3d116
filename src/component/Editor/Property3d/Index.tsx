import { Accordion } from "react-bootstrap";
import { Object3D } from "three";
import { setClassName } from "../../../app/utils";

import Property3dChild from "./Property3dChild";
/**
 * 物体属性
 * @returns
 */

export default function Index({ selected3d }: { selected3d: Object3D | any }) {
  return (
    selected3d && (
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <i className={setClassName("menu-button")}></i>
          <span className="px-2 ellipsis-3d">属性</span>
        </Accordion.Header>
        <Accordion.Body>
          <Property3dChild selected3d={selected3d}></Property3dChild>
        </Accordion.Body>
      </Accordion.Item>
    )
  );
}
