import { createLazyFileRoute } from "@tanstack/react-router";
import Highlight from "react-highlight";

export const Route = createLazyFileRoute("/editor3d/document")({
  component: RouteComponent,
});

function RouteComponent() {
  const code = `一、获取列表list(包含场景和模型)
    接口地址：/project/pageList/
    请求方式：POST
    请求参数：
    {   
      "size": 1000// 获取1000条数据
    }
   //得到场景列表：
    const sceneList = list.filter((item: any) => {
            if (item.des === "Scene") {
              return item;
            }
          });
  
    //得到模型列表：
    const meshList = list.filter((item: any) => {
            if (item.des === "Mesh") {
              return item;
            }
          });
  
   ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
  
    二、与3D交互相关的接
      //1、引入Viewer3d，显示3D场景的容器
      import Viewer3d from "remoteApp/Viewer3d";
  
      //2、引入init3dViewer，初始化3D，和3D场景相关的方法
      import {getScene,getControls,getCamera,addGridHelper,addLight } from "remoteApp/init3dViewer";
  
      //3、获取场景、控制器、相机、网格辅助线、灯光  
      //获取场景
      const scene = getScene();
  
      //获取控制器
      const controls = getControls();   
  
      //获取透视相机
      const camera = getCamera();     
  
      //添加网格辅助线
      addGridHelper();     
  
      //添加平行光（可投射阴影）
      addLight() 
  
      完整事例：
      到2D项目查看，地址：/src/pages/viewer3d/index.tsx   
    `;

  return <Highlight className="javascript">{code}</Highlight>;
}
