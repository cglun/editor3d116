import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

function Trigger3d({ title = "title", width = "6rem" }) {
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 250 }}
      overlay={<Tooltip id="button-tooltip">{title}</Tooltip>}
    >
      <div className="ellipsis-3d" style={{ width }}>
        {title}
      </div>
    </OverlayTrigger>
  );
}

export default Trigger3d;
