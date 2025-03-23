import { Accordion } from "react-bootstrap";
import { Object3D } from "three";
import { fixedEditorLleft, setClassName } from "../../../app/utils";

import IndexChild from "./IndexChild";
/**
 * 物体属性
 * @returns
 */

export default function Index({ selected3d }: { selected3d: Object3D | any }) {
  return (
    selected3d && (
      <Accordion.Item
        eventKey="1"
        onMouseLeave={() => {
          fixedEditorLleft(false);
        }}
        onMouseEnter={() => {
          fixedEditorLleft();
          console.log("selected3d");
        }}
      >
        <Accordion.Header>
          <i className={setClassName("menu-button")}></i>
          <span className="px-2 ellipsis-3d">属性</span>
        </Accordion.Header>
        <Accordion.Body>
          <IndexChild selected3d={selected3d}></IndexChild>
        </Accordion.Body>
      </Accordion.Item>
    )
  );
}
