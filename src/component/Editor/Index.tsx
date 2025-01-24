import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import EditorTop from "./EditorTop";
import Col from "react-bootstrap/esm/Col";
import Canvas3d from "./Canvas3d";
import BottomNav from "./BottomNav";
import OutlineView from "./OutlineView";
export default function Index() {
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <EditorTop />
          </Col>
        </Row>
        <Row>
          <Col xl={10} style={{ margin: 0, padding: 0 }}>
            <Row>
              <Col>
                <Canvas3d />
              </Col>
            </Row>
            <Row>
              <Col>
                <BottomNav />
              </Col>
            </Row>
          </Col>
          <Col
            xl={2}
            style={{ margin: 0, padding: 0 }}
            className="my-card-body "
          >
            <OutlineView></OutlineView>
          </Col>
        </Row>
      </Container>
    </>
  );
}
