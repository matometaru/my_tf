import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useData } from '../hooks/useData'

const modelPath = "models/model.json"

function drawDetection(img: HTMLImageElement, boundingBox: [number, number, number, number]) {
  const canvas = document.getElementById('detection') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imgWidth = img.width;
  const imgHeight = img.height;
  canvas.width = imgWidth;
  canvas.height = imgHeight;
  const startX = boundingBox[0] * imgWidth;
  const startY = boundingBox[1] * imgHeight;
  const width = (boundingBox[2] - boundingBox[0]) * imgWidth;
  const height = (boundingBox[3] - boundingBox[1]) * imgHeight;
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.strokeRect(startX, startY, width, height);
}

function C_5_4_1() {
  const model = useData('pet', () =>  tf.loadLayersModel(modelPath))
  const [imageSrc, setImageSrc] = useState('dog1.jpg');

  const handleImageLoad = () => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      const tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([256, 256])
        .div(255)
        .reshape([1, 256, 256, 3]);
      const prediction = model.predict(tensor) as tf.Tensor;
      const data = prediction.arraySync();
      drawDetection(img, data[0]);
      prediction.dispose();
      tensor.dispose();
    }
  };

  return (
    <div>
      <p>C_5_4_1</p>
      <div style={{ position: 'relative', height: '80vh' }}>
        <img src={imageSrc} id="img" onLoad={handleImageLoad} height={'100%'} />
        <canvas id="detection" style={{ position: 'absolute', left: 0 }} />
      </div>
      <button onClick={() => setImageSrc('dog1.jpg')}>dog1</button>
      <button onClick={() => setImageSrc('dog2.jpg')}>dog2</button>
      <button onClick={() => setImageSrc('dog3.jpg')}>dog3</button>
    </div>
  );
}

export default C_5_4_1;