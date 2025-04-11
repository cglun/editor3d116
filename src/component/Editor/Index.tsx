import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import EditorTop from "./EditorTop";
import Col from "react-bootstrap/esm/Col";
import EditorBottom from "./EditorBottom";
import OutlineView from "./OutlineView/Index";
import EditorViewer3d from "./EditorViewer3d";
export default function Index() {
  return (
    <Container fluid>
      <Row>
        <EditorTop />
      </Row>
      <Row>
        <Col xl={10} id="editor-left">
          <Row>
            <EditorViewer3d />
          </Row>
          <Row>
            <EditorBottom />
          </Row>
        </Col>

        <Col
          id="editor-right"
          xl={2}
          className="position-fixed"
          style={{
            right: "0",
            overflowY: "scroll",
            height: "96vh",
            scrollbarWidth: "none",
          }}
        >
          <OutlineView />
        </Col>
      </Row>
    </Container>
  );
}
