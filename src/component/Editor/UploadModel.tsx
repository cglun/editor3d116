import { ButtonGroup, ListGroup, ProgressBar } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Euler, Vector3 } from "three";

import { getButtonColor } from "../../app/config";
import { useRef, useState } from "react";
import Toast3d from "../common/Toast3d";
import { setClassName } from "../../app/utils";
import _axios from "../../app/http";
import { APP_COLOR, GlbModel } from "../../app/type";

export function UploadModel({ updateList = (_time: number) => {} }) {
  const color = getButtonColor();
  let fileRef = useRef<any>(null);
  const [curFile, setCurFile] = useState<File | null>(null);
  const [btn, setBtn] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(100);
  async function handleUpload() {
    if (curFile) {
      const formData = new FormData();
      formData.append("file", curFile);

      const model = await uploadModels(formData);
      // const model: GlbModel = {
      //   name: curFile.name,
      //   position: new Vector3(0, 0, 0),
      //   rotation: new Euler(0, 0, 0, "XYZ"),
      //   scale: new Vector3(1, 1, 1),
      //   userData: {
      //     modelUrl,
      //     type: "Mesh",
      //     modelTotal,
      //   },
      // };
      debugger;
      if (model) {
        _axios
          .post("/project/create/", {
            name: model.name,
            des: "Mesh",
            dataJson: JSON.stringify(model),
          })
          .then((res) => {
            if (res.data.code === 200) {
              Toast3d("保存成功");
              updateList(new Date().getTime());
            } else {
              Toast3d(res.data.message, "提示", APP_COLOR.Warning);
            }
          })
          .catch((error) => {
            Toast3d(error, "提示", APP_COLOR.Warning);
          })
          .finally(() => {
            setBtn(true);
            setCurFile(null);
          });
      }
    }
  }

  function uploadModels(formData: FormData): Promise<GlbModel> {
    return new Promise((resolve, reject) => {
      let modelTotal = 0;
      _axios
        .post("/material/upload/116", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: function (progressEvent) {
            if (progressEvent.total !== undefined) {
              modelTotal = progressEvent.total;
              setProgress(progressEvent.loaded / progressEvent.total);
              // 计算上传的百分比
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
        })
        .then((res) => {
          if (res.data.code !== 200) {
            Toast3d(res.data.message, "提示", APP_COLOR.Warning);
            return;
          }
          const model: GlbModel = {
            name: curFile!.name,
            position: new Vector3(0, 0, 0),
            rotation: new Euler(0, 0, 0, "XYZ"),
            scale: new Vector3(1, 1, 1),
            userData: {
              modelUrl: res.data.result.url,
              modelTotal: modelTotal,
            },
          };

          resolve(model);
          //  const   modelurl=
          //     setProgress(100);
          //     Toast3d(res.data.message, "提示", APP_COLOR.Success);
          //     setBtn(true);
          //     setCurFile(null);
        })
        .catch((err) => {
          reject(err);
          setProgress(100);
          Toast3d(err.message, "错误", APP_COLOR.Danger);
        });
    });
  }

  return (
    <div className="d-flex">
      <ListGroup.Item>
        {btn ? (
          <Form.Group controlId="formFile">
            <Form.Label className="custom-file-progress d-flex align-items-center">
              <i
                style={{ fontSize: "1.4rem" }}
                className={setClassName("cloud-plus")}
              ></i>
              <div className="ms-1">模型</div>
            </Form.Label>
            <Form.Control
              as="input"
              style={{ display: "none" }}
              type="file"
              ref={fileRef}
              accept=".glb,.gltf"
              onChange={() => {
                if (fileRef.current.files.length > 0) {
                  const curFile = fileRef.current.files[0];
                  setCurFile(curFile);
                  setBtn(false);
                } else {
                  setBtn(true);
                }
              }}
            />
          </Form.Group>
        ) : (
          <>
            <Form.Text>{curFile?.name}</Form.Text>
            {progress < 100 && <ProgressBar now={progress} label={progress} />}
          </>
        )}
      </ListGroup.Item>
      <ListGroup.Item>
        <ButtonGroup size="sm">
          <Button
            variant={color}
            id="button-addon1"
            disabled={btn}
            onClick={() => {
              fileRef.current = null;
              setCurFile(null);
              setBtn(true);
            }}
          >
            清空
          </Button>
          <Button
            variant={color}
            id="button-addon2"
            onClick={() => {
              handleUpload();
            }}
            disabled={btn}
          >
            上传
          </Button>
        </ButtonGroup>
      </ListGroup.Item>
    </div>
  );
}
