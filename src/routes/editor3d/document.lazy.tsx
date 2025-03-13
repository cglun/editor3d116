import { CodeHighlight } from "@mantine/code-highlight";
import { MantineProvider } from "@mantine/core";
import { createLazyFileRoute } from "@tanstack/react-router";

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
  
    二、与3D交互相关的接口
      //1、引入Viewer3d组件
      import Viewer3d from "remoteApp/Viewer3d";
  
      //2、使用callBack回调函数,获取three实例
      const [threeInstance, setThreeInstance] = useState<any>(null);      
      function callBack(instance: any) {
        setThreeInstance(instance);
      }
      //3、获取场景、控制器、相机
     const { scene,controls,camera} = threeInstance;          
    
      完整事例：
      到2D项目查看，地址：/src/pages/viewer3d/index.tsx       
    
    ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

    三、使用javascript脚本控制与3d交互
     // 1、获取场景、控制器、相机。
      const scene = getScene();
      const controls=getControls();
      const camera=getCamera();
      
       


  `;
  return (
    <MantineProvider>
      <CodeHighlight
        style={{
          padding: "16px",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#ccc #fff",
        }}
        code={code}
        language="javascript"
        withCopyButton={false}
      />
    </MantineProvider>
  );
}
