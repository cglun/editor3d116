import Card from "react-bootstrap/esm/Card";
import { Vector2 } from "three";

interface InfoPanelProps {
  show: boolean; // 面板是否显示
  position: Vector2; // 面板的位置
  data: {
    name: string; // 面板的名称
    des: string; // 面板的描述
    cover: string; // 面板的封面图片
  }; // 要显示的数据
}
export default function InfoPanel({
  show = false,
  position = new Vector2(0, 0),
  data = { name: "name", des: "des", cover: "cover" },
}: InfoPanelProps) {
  const { x, y } = position;

  const style = {
    top: `${y}px`, // 面板的顶部位置
    left: `${x}px`, // 面板的左侧位置
    // 面板的最小宽度
    maxWidth: "20rem", // 面板的最大宽度
    zIndex: 1000, // 面板的层级
    padding: 0, // 面板的内边距
    display: show ? "block" : "none", // 根据 show 属性控制面板的显示与隐藏
  };

  return (
    <Card className="position-absolute" style={style}>
      <Card.Header>位置：{data.name}</Card.Header>
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
        <Card.Text>{data.des}</Card.Text>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
  );
}
