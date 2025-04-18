import { Accordion } from "react-bootstrap";
import { fixedEditorLleft, setClassName } from "../../../app/utils";

import IndexChild from "./IndexChild";
import { SelectedObject } from "../../../app/type";
import { useEffect, useRef } from "react";
/**
 * 物体属性
 * @returns
 */

export default function Index({ selected3d }: { selected3d: SelectedObject }) {
  const refAccordion = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const focusHandler = () => {
      fixedEditorLleft();
    };
    const mouseLeaveHandler = () => {
      fixedEditorLleft(false);
    };
    let inputList = null;
    if (refAccordion.current) {
      inputList = refAccordion.current.querySelectorAll('input[type="number"]');
      inputList.forEach((input) => {
        input.addEventListener("focus", focusHandler);
        input.addEventListener("mouseleave", mouseLeaveHandler);
      });
    }
    return () => {
      if (refAccordion.current) {
        inputList?.forEach((input) => {
          input.removeEventListener("focus", focusHandler);
        });
        inputList?.forEach((input) => {
          input.removeEventListener("mouseleave", mouseLeaveHandler);
        });
      }
    };
  }, [selected3d]); // 建议添加依赖数组，避免不必要的重复执行

  return (
    selected3d && (
      <Accordion.Item
        eventKey="1"
        ref={refAccordion}
        onMouseLeave={() => {
          //fixedEditorLleft(false);
        }}
        onMouseEnter={() => {
          // fixedEditorLleft();
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
