import { createLazyFileRoute } from '@tanstack/react-router'

import React from 'react'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import { Serch3d } from '../../component/Editor/Serch3d'
import { UploadModel } from '../../component/Editor/UploadModel'
import ListCard from '../../component/Editor/ListCard'
import { testData2 } from '../../app/testData'

export const Route = createLazyFileRoute('/editor3d/')({
  component: ModelList,
})
function ModelList() {
  // const { data, isLoading, error } = useFetch('type=Mesh', HTTP_TYPE.GET);

  const [list] = React.useState(testData2)
  const [filterList, setFilterList] = React.useState(testData2)

  return (
    <div className="d-flex ">
      <ListGroup>
        <Serch3d list={list} setFilterList={setFilterList} />
        <UploadModel />
      </ListGroup>
      <ListCard
        list={filterList}
        setList={setFilterList}
        getType={{
          isLoading: false,
          error: false,
        }}
      ></ListCard>
    </div>
  )
}
