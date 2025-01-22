import React, { useContext, useEffect, useRef } from 'react';

import { init3d } from '../../three/utils';
import { MyContext } from '../../app/MyContext';
import { getScene } from '../../three/init3d116';

export default function Canvas3d() {
  const canvas3d: React.RefObject<HTMLDivElement> = useRef<any>({});
  const { dispatchScene } = useContext(MyContext);

  useEffect(() => {
    init3d(canvas3d);
    dispatchScene({
      type: 'setScene',
      payload: getScene(),
    });
  }, []);

  return <div style={{ height: '70vh' }} ref={canvas3d}></div>;
}
