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
        <div className="sticky-top" style={{ height: "30px" }}></div>
      </Row>
      <Row>
        <Col xl={10}>
          <Row>
            <EditorViewer3d />
          </Row>
          <Row>
            <EditorBottom />
          </Row>
        </Col>

        <Col xl={2} style={{ position: "fixed", right: "0" }}>
          <OutlineView />
        </Col>
      </Row>
    </Container>
  );
}
