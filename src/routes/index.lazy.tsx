import { createLazyFileRoute } from '@tanstack/react-router';

import ListCard, { ItemInfo, listDefault } from '../component/ListCard';
import React, { useState } from 'react';

import { testData2 } from '../app/testData';
import Button from 'react-bootstrap/esm/Button';
import { HTTP_TYPE } from '../type';
import useFetch from '../app/hooks';
export const Route = createLazyFileRoute('/')({
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
