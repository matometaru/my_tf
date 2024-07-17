import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useData } from '../hooks/useData'
import { loadModel } from '../utils'

function C_6_3_1() {
  const model = useData('ssd_mobilenet_v2', loadModel)
  const [imageSrc, setImageSrc] = useState('dinner.jpg');

  const handleImageLoad = () => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      const imgTensor = tf.browser.fromPixels(img);
      const readyfied = tf.expandDims(imgTensor, 0);

      model.executeAsync(readyfied).then((result) => {
        // 顕著な検出
        const prominentDetection = tf.topk(result[0])
        prominentDetection.indices.print();
        prominentDetection.values.print();
      })
    }
  };

  return (
    <div>
      <p>C_6_3_1</p>
      <div style={{ position: 'relative', height: '80vh' }}>
        <img src={imageSrc} id="img" onLoad={handleImageLoad} height={'100%'} />
        <canvas id="detection" style={{ position: 'absolute', left: 0 }} />
      </div>
    </div>
  );
}

export default C_6_3_1;