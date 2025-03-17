import { ButtonGroup, ListGroupItem, ProgressBar } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Euler, Vector3 } from "three";
import { getButtonColor } from "../../app/config";
import { useRef, useState } from "react";
import Toast3d from "../common/Toast3d";
import { getThemeByScene, setClassName } from "../../app/utils";
import _axios from "../../app/http";
import { APP_COLOR, GlbModel } from "../../app/type";
import { useUpdateScene } from "../../app/hooks";

export function UploadModel({ updateList = (_time: number) => {} }) {
  let fileRef = useRef<any>(null);
  const [curFile, setCurFile] = useState<File | null>(null);
  const [btn, setBtn] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(100);
  const { scene } = useUpdateScene();
  let { themeColor } = getThemeByScene(scene);
  const buttonColor = getButtonColor(themeColor);

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
    <ListGroupItem>
      {btn ? (
        <Form.Group controlId="formFile">
          <Button variant={buttonColor} className="custom-file-upload">
            <Form.Label
              className="custom-file-progress"
              style={{ cursor: "pointer", marginBottom: 0 }}
            >
              <i
                className={setClassName("cloud-plus")}
                style={{ fontSize: "1rem" }}
              >
                上传模型
              </i>
            </Form.Label>
          </Button>
          <Form.Control
            as="input"
            style={{ display: "none", marginBottom: 0 }}
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
      <ButtonGroup size="sm" className="mt-2">
        <Button
          variant={buttonColor}
          disabled={btn}
          onClick={() => {
            fileRef.current = null;
            setCurFile(null);
            setBtn(true);
          }}
        >
          <i className={setClassName("trash2")}></i>清空
        </Button>
        <Button
          variant={buttonColor}
          onClick={() => {
            handleUpload();
          }}
          disabled={btn}
        >
          <i className={setClassName("cloud-arrow-up")}></i>上传
        </Button>
      </ButtonGroup>
    </ListGroupItem>
  );
}
