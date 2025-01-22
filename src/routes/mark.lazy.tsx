import { createLazyFileRoute } from '@tanstack/react-router';
import { Button } from 'react-bootstrap';

import { getScene, setScene } from '../three/init3d116';
import { getThemeColor } from '../app/config';
import { Scene } from 'three';

export const Route = createLazyFileRoute('/mark')({
  component: RouteComponent,
});

function RouteComponent() {
  function moveBy() {
    const cube = getScene().children[0];
    cube.position.x++;
  }

  return (
    <div>
      <Button
        variant={getThemeColor()}
        onClick={() => {
          moveBy();
        }}
      >
        移动立方体
      </Button>
      <Button
        variant={getThemeColor()}
        onClick={() => {
          localStorage.removeItem('camera');
          localStorage.removeItem('scene');
          setScene(new Scene());
        }}
      >
        移除场景
      </Button>
    </div>
  );
}
