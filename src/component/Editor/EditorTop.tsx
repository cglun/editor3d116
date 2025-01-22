import { useContext, useState } from 'react';
import {
  Row,
  Col,
  Button,
  ButtonGroup,
  Dropdown,
  Offcanvas,
} from 'react-bootstrap';

import { setClassName } from '../../app/utils';
import { getThemeColor, initThemeColor, setThemeColor } from '../../app/config';
import { getCamera, getScene, setScene } from '../../three/init3d116';
import { APP_COLOR } from '../../type';
import { initToast, MyContext } from '../../app/MyContext';
import ListCard from '../ListCard';

import { Scene } from 'three';
import Toast3d, { Toast, ToastDefault } from '../Toast3d';

import { testData1 } from '../../app/testData';

export default function EditorTop() {
  initThemeColor();
  const themeColor = getThemeColor();
  //打开场景列表
  const [showScene, setShowScene] = useState(false);
  const handleClose = () => setShowScene(false);
  const handleShow = () => setShowScene(true);

  const [appTheme, setAppTheme] = useState(themeColor);

  const { dispatchToast } = useContext(MyContext);
  function saveScene() {
    const sceneJson = getScene().toJSON();
    const c = getCamera().toJSON();

    localStorage.setItem('scene', JSON.stringify(sceneJson));
    localStorage.setItem('camera', JSON.stringify(c));
    dispatchToast({
      type: 'toast',
      toastBody: {
        ...initToast.toastBody,
        title: '场景',
        content: '场景已保存',
        type: APP_COLOR.Success,
        show: true,
      },
    });
  }
  function setTheme(color: string) {
    document.body.setAttribute('data-bs-theme', color);
    localStorage.setItem('app_theme', color);
    setThemeColor(color);
    setAppTheme(color);
  }
  //const { data, error, isLoading } =  useFetch('type=Mesh', HTTP_TYPE.GET)

  function saveAsNewScene() {}

  const [toast, setToast] = useState<Toast>({ ...ToastDefault });

  const [list, setList] = useState(testData1);
  return (
    <>
      <Row>
        <Col>
          <Button variant={themeColor} size="sm" onClick={handleShow}>
            <i className={setClassName('bi me-1 bi-badge-3d')}></i>切换场景
          </Button>
        </Col>

        <Col className="d-flex justify-content-end">
          <ButtonGroup aria-label="Basic example">
            <Button
              variant={themeColor}
              size="sm"
              onClick={() => {
                localStorage.removeItem('camera');
                localStorage.removeItem('scene');
                setScene(new Scene());
              }}
            >
              <i className={setClassName('plus-square')}></i> 新场景
            </Button>
            <Button
              variant={themeColor}
              size="sm"
              onClick={() => {
                saveScene();
                setToast({ ...toast, type: APP_COLOR.Danger, show: true });
              }}
            >
              <i className={setClassName('floppy')}></i> 保存场景
            </Button>
            <Button
              variant={themeColor}
              size="sm"
              onClick={() => {
                saveAsNewScene();
              }}
            >
              <i className={setClassName('floppy2')}></i> 场景另存
            </Button>

            <Button variant={themeColor} size="sm">
              <i className={setClassName('dash-circle')}></i> 待续
            </Button>
          </ButtonGroup>
          <>
            <Dropdown className="d-inline mx-2 ">
              <Dropdown.Toggle
                id="dropdown-autoclose-true"
                variant={themeColor}
                size="sm"
              >
                {appTheme === 'light' ? (
                  <i className={setClassName('sun')}></i>
                ) : (
                  <i className={setClassName('moon-stars')}></i>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setTheme('light');
                  }}
                >
                  <i className={setClassName('sun')}></i>白天
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setTheme('dark');
                  }}
                >
                  <i className={setClassName('moon-stars')}></i>黑夜
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        </Col>
      </Row>
      <Toast3d setToast={setToast} toast={toast}></Toast3d>

      {showScene && (
        <Offcanvas show={showScene} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <i className={setClassName('badge-3d')}></i> 所有场景
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ListCard
              list={list}
              setList={setList}
              getType={{
                isLoading: false,
                error: false,
              }}
            ></ListCard>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </>
  );
}
