import { setClassName } from "../../app/utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  iconName: string; // 给 iconName 设置默认值 "search-heart"
  children?: React.ReactNode;
  gap?: 0 | 1 | 2 | 3; // 给 gap 设置默认值 1
  title?: string; // 给 title 设置默认值空字符串
  fontSize?: number; // 给 fontSize 设置默认值 16,
}
export default function Icon({
  iconName = "search-heart",
  gap = 1, // 给 gap 设置默认值 1

  title = "", // 给 title 设置默认值空字符串
  fontSize = 1, // 给 fontSize 设置默认值 16
}: IconProps) {
  if (iconName.includes("bi bi-")) {
    return <i className={iconName + ` me-${gap}`} title={title}></i>;
  }
  return (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 250 }}
        overlay={title ? <Tooltip>{title}</Tooltip> : <></>}
      >
        <i
          className={setClassName(iconName) + ` me-${gap}`}
          style={{ fontSize: `${fontSize}rem` }}
        ></i>
      </OverlayTrigger>
    </>
  );
}
