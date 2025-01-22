import React from "react";
import { createRootRoute } from "@tanstack/react-router";
import { Col, Container, Row } from "react-bootstrap";
import { initScene, initToast, MyContext } from "../app/MyContext";
import OutlineView from "../component/Editor/OutlineView";
import Canvas3d from "../component/Editor/Canvas3d";
import EditorTop from "../component/Editor/EditorTop";
import BottomNav from "../component/Editor/BottomNav";
import ToastExample from "../component/ToastExample";
import reducerToast, { reducerScene } from "../app/reducer";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [toast, dispatchToast] = React.useReducer(reducerToast, initToast);
  const [scene, dispatchScene] = React.useReducer(reducerScene, initScene);
  document.title = "3D116";
  return (
    <MyContext.Provider value={{ toast, dispatchToast, scene, dispatchScene }}>
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
      <ToastExample />
    </MyContext.Provider>
  );
}
