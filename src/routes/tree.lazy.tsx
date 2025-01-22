import { createLazyFileRoute } from '@tanstack/react-router';

import { useState } from 'react';

import { Tree } from '@arco-design/web-react';

export const Route = createLazyFileRoute('/tree')({
  component: RouteComponent,
});

function RouteComponent() {
  const TreeData = [
    {
      title: 'Trunk 0-0',
      key: '0-0',
      children: [
        {
          title: 'Leaf 0-0-1',
          key: '0-0-1',
        },
        {
          title: 'Branch 0-0-2',
          key: '0-0-2',
          disableCheckbox: true,
          children: [
            {
              title: '若有若无的话',
              key: '0-1-23111',
            },
          ],
        },
      ],
    },
    {
      title: 'Trunk 0-1',
      key: '0-1',
      children: [
        {
          title: 'Branch 0-1-1',
          key: '0-1-1',
          checkable: false,
          children: [
            {
              title: 'Leaf 0-1-1-1',
              key: '0-1-1-1',
            },
            {
              title: 'Leaf 0-1-1-2',
              key: '0-1-1-2',
            },
          ],
        },
        {
          title: 'Leaf 0-1-2',
          key: '0-1-2',
        },
      ],
    },
  ];

  const [treeData, setTreeData] = useState(TreeData);

  return 'f';
}
