import { Alert } from "react-bootstrap";

import { setClassName } from "../../app/utils";
import { APP_COLOR } from "../../app/type";

// export default function AlertBase(type: string, text: string) {
//   let iconClassName = setClassName('info-circle') + ' me-1';
//   if (type === APP_COLOR.Success) {
//     iconClassName = setClassName('check-circle') + ' me-1';
//   }
//   return (
//     <Alert variant={type}>
//       <i className={setClassName(iconClassName)}></i>
//       {text}
//     </Alert>
//   );
// }

// export default function AlertBase(type: string, text: string) {
//   return <Alert variant={type}>{text}</Alert>;
// }

interface Props {
  type: string;
  text: string;
  className?: string;
}
const props: Props = {
  className: "",
  type: APP_COLOR.Danger,
  text: "内容",
};

export default function AlertBase(_props: Props = props) {
  const { type, text, className } = _props;
  let iconClassName = setClassName("info-circle") + " me-1";

  if (type === APP_COLOR.Success) {
    iconClassName = setClassName("check-circle") + " me-1";
  }
  return (
    <Alert variant={type} className={className}>
      <i className={setClassName(iconClassName)}></i>
      {text}
    </Alert>
  );
}
