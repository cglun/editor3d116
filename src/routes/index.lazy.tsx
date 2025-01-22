import { createLazyFileRoute } from "@tanstack/react-router";

import ListCard from "../component/ListCard";
import React from "react";

import { testData2 } from "../app/testData";

export const Route = createLazyFileRoute("/")({
  component: ModelList,
});
function ModelList() {
  // const { data, isLoading, error } = useFetch('type=Mesh', HTTP_TYPE.GET);

  const [list, setList] = React.useState(testData2);

  return (
    <ListCard
      list={list}
      setList={setList}
      getType={{
        isLoading: false,
        error: false,
      }}
    ></ListCard>
  );
}
