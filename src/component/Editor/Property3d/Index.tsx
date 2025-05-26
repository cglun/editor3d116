import { Accordion } from "react-bootstrap";

import IndexChild from "./IndexChild";
import { SelectedObject } from "../../../app/type";
import { useEffect, useRef } from "react";
import Icon from "../../common/Icon";

/**
 * 物体属性
 * @returns
 */

export default function Index({ selected3d }: { selected3d: SelectedObject }) {
  const refAccordion = useRef<HTMLDivElement>(null);
  const gap = 1;
  useEffect(() => {
    const focusHandler = () => {
      if (refAccordion.current) {
        refAccordion.current.style.overflow = "hidden";
      }
    };
    const mouseLeaveHandler = () => {
      if (refAccordion.current) {
        refAccordion.current.style.overflowY = "scroll";
      }
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
      <Accordion.Item eventKey="1" ref={refAccordion}>
        <Accordion.Header>
          <Icon iconName="menu-button" gap={gap} />
          属性
        </Accordion.Header>
        <Accordion.Body>
          <IndexChild selected3d={selected3d}></IndexChild>
        </Accordion.Body>
      </Accordion.Item>
    )
  );
}
