import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useData } from '../hooks/useData'

const modelPath = "models/model.json"

function C_5_5() {
  const model = useData('pet', () =>  tf.loadLayersModel(modelPath))
  const [imageSrc, setImageSrc] = useState('dog1.jpg');

  const handleImageLoad = () => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      const imgTensor = tf.browser.fromPixels(img)

      const pTensor = imgTensor.resizeNearestNeighbor([256, 256])
        .div(255)
        .reshape([1, 256, 256, 3]);
      const prediction = model.predict(pTensor) as tf.Tensor;
      const box = prediction.dataSync();

      const tHeight = imgTensor.shape[0];
      const tWidth = imgTensor.shape[1];
      const tStartX = box[0] * tWidth;
      const tStartY = box[1] * tHeight;
      const cropLength = Math.round((box[2] - box[0]) * tWidth)
      const cropHeight = Math.round((box[3] - box[1]) * tHeight)
      const startPos = [tStartY, tStartX, 0];
      const cropSize = [cropHeight, cropLength, 3];

      const croppedTensor = tf.slice(imgTensor, startPos, cropSize);

      const canvas = document.getElementById('detection') as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      tf.browser.toPixels(croppedTensor, canvas).then(() => {
        prediction.dispose();
        imgTensor.dispose();
        croppedTensor.dispose();
      });
    }
  };

  return (
    <div>
      <p>C_5_5</p>
      <div>
        <img src={imageSrc} id="img" onLoad={handleImageLoad} height={600} />
        <canvas id="detection" />
      </div>
      <button onClick={() => setImageSrc('dog1.jpg')}>dog1</button>
      <button onClick={() => setImageSrc('dog2.jpg')}>dog2</button>
      <button onClick={() => setImageSrc('dog3.jpg')}>dog3</button>
    </div>
  );
}

export default C_5_5;