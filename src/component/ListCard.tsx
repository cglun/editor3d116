import { memo, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  Container,
  Form,
  InputGroup,
  Spinner,
} from 'react-bootstrap';
import AlertBase from './AlertBase';
import { getThemeColor } from '../app/config';
import { setClassName } from '../app/utils';
import { APP_COLOR, DELAY } from '../type';
import Toast3d, { Toast, ToastDefault } from './Toast3d';
import ModalConfirm3d, {
  ModalConfirm,
  ModalConfirmDefault,
} from './Modal/ModalConfirm3d';
export interface ItemInfo {
  id: number;
  name: string;
  type: string;
  desc: string;
}

interface Props {
  list: ItemInfo[];
  setList: (list: ItemInfo[]) => void;
  getType: {
    isLoading: boolean;
    error: boolean;
  };
}
function ItemInfoCard(props: Props) {
  const { list, getType, setList } = props;
  const { isLoading, error } = getType;
  //加载中……
  if (isLoading) {
    return <Spinner animation="grow" />;
  }
  //错误
  if (error) {
    console.error(error);
    return <AlertBase type={APP_COLOR.Danger} text={'查看控制台'} />;
  }
  //无数据
  if (list.length === 0) {
    return <AlertBase type={APP_COLOR.Warning} text={'无数据'} />;
  }
  const [modalConfirm, setModalConfirm] = useState<ModalConfirm>({
    ...ModalConfirmDefault,
  });

  const [toast, setToast] = useState<Toast>({ ...ToastDefault });

  const [modalBody, setModalBody] = useState(
    <AlertBase type={APP_COLOR.Warning} text={''} />,
  );

  function deleteBtn(item: ItemInfo, index: number) {
    //设为红色Danger，危险操作
    setModalBody(<AlertBase type={APP_COLOR.Danger} text={item.name} />);
    setModalConfirm({
      ...ModalConfirmDefault,
      title: `删除${item.type}`,
      content: `${item.name}`,
      show: true,
      onOk: () => {
        setToast({
          ...ToastDefault,
          title: '提示',
          content: `${item.name}-删除成功`,
          type: APP_COLOR.Success,
          delay: DELAY.SHORT,
          show: true,
        });
        const newList = list.filter((_, i) => i !== index);
        setList(newList);

        setModalConfirm({
          ...ModalConfirmDefault,
          show: false,
        });
      },
    });
  }

  function editorBtn(item: ItemInfo) {
    let _item: ItemInfo | null;
    function getNewItem(item: ItemInfo): void {
      _item = item;
    }

    setModalBody(<EditorForm item={item} getNewItem={getNewItem} />);

    setModalConfirm({
      ...ModalConfirmDefault,
      title: `编辑${item.type}`,
      content: `${item.name}`,
      type: APP_COLOR.Danger,
      show: true,
      onOk: () => {
        setToast({
          ...ToastDefault,
          title: '提示',
          content: `${item.name}-编辑成功`,
          type: APP_COLOR.Success,
          delay: DELAY.SHORT,
          show: true,
        });
        console.log(_item);

        setModalConfirm({
          ...ModalConfirmDefault,
          show: false,
        });
      },
    });
  }

  return (
    <Container fluid className="d-flex flex-wrap">
      {list.map((item: ItemInfo, index: number) => {
        return (
          <Card className="ms-2 mt-2" key={index}>
            <Card.Header style={{ width: '6rem' }} title={item.name}>
              {item.name}
            </Card.Header>
            <Card.Body className="d-flex flex-column ">
              <Card.Img src={'/assets/images/test.png'} variant="top" />
              <ButtonGroup aria-label="Basic example" className="mt-2">
                <Button
                  variant={getThemeColor()}
                  size="sm"
                  onClick={() => editorBtn(item)}
                >
                  <i className={setClassName('pencil')} title="编辑"></i>
                </Button>
                <Button
                  variant={getThemeColor()}
                  size="sm"
                  onClick={() => deleteBtn(item, index)}
                >
                  <i className={setClassName('trash')} title="删除"></i>
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        );
      })}
      <ModalConfirm3d
        modalConfirm={{ ...modalConfirm }}
        setModalConfirm={setModalConfirm}
      >
        {modalBody}
      </ModalConfirm3d>
      <Toast3d toast={{ ...toast }} setToast={setToast}></Toast3d>
    </Container>
  );
}
export default memo(ItemInfoCard);

interface EditorFormProps {
  item: ItemInfo;
  getNewItem: Function;
}
function EditorForm(editorFormProps: EditorFormProps) {
  const { item, getNewItem } = editorFormProps;
  const [_item, _setItem] = useState<ItemInfo>({ ...item });
  return (
    <InputGroup size="sm">
      <InputGroup.Text id="inputGroup-sizing-sm">{item.type}</InputGroup.Text>
      <Form.Control
        aria-label="Small"
        aria-describedby="inputGroup-sizing-sm"
        placeholder={item.name}
        type="text"
        value={_item.name}
        onChange={(e) => {
          _setItem({ ..._item, name: e.target.value });
          getNewItem(e.target.value);
        }}
      />
    </InputGroup>
  );
}
