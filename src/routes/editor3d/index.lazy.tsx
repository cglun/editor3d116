import { createLazyFileRoute } from "@tanstack/react-router";
import React, { useEffect } from "react";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { Serch3d } from "../../component/Editor/Serch3d";
import { UploadModel } from "../../component/Editor/UploadModel";
import ListCard from "../../component/Editor/ListCard";
import { testData2 } from "../../app/testData";
import _axios from "../../app/http";

export const Route = createLazyFileRoute("/editor3d/")({
  component: ModelList,
});
function ModelList() {
  // const { data, isLoading, error } = useFetch('type=Mesh', HTTP_TYPE.GET);

  const [list, setList] = React.useState(testData2);
  const [filterList, setFilterList] = React.useState(testData2);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [updateTime, setUpdateTime] = React.useState(0);
  useEffect(() => {
    setIsLoading(true);
    _axios.post("/project/pageList/", { size: 1000 }).then((res) => {
      if ((res.data.code = 200)) {
        const message = res.data.message;
        if (message) {
          setError(message);
          return;
        }
        const list = res.data.data.records;
        const sceneList = list.filter((item: any) => {
          if (item.des === "Mesh") {
            return item;
          }
        });
        setList(sceneList);
        setFilterList(sceneList);
        setIsLoading(false);
      }
    });
  }, [updateTime]);

  function updateList(_time: number): void {
    setUpdateTime(_time);
  }

  return (
    <div className="d-flex mt-2">
      <ListGroup>
        <Serch3d list={list} setFilterList={setFilterList} />
        <UploadModel updateList={updateList} />
      </ListGroup>
      <ListCard
        list={filterList}
        setList={setFilterList}
        isLoading={isLoading}
        error={error}
      ></ListCard>
    </div>
  );
}
