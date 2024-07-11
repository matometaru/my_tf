import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useData } from '../hooks/useData'

const modelPath = "models/model.json"

function C_5_5_1() {
  const model = useData('pet', () =>  tf.loadLayersModel(modelPath))
  const [imageSrc, setImageSrc] = useState('dog1.jpg');

  const handleImageLoad = () => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      const imgTensor = tf.browser.fromPixels(img);

      const pTensor = imgTensor.resizeNearestNeighbor([256, 256])
        .div(255)
        .reshape([1, 256, 256, 3]);
      const prediction = model.predict(pTensor) as tf.Tensor;
      const box = prediction.dataSync();

      const tHeight = imgTensor.shape[0];
      const tWidth = imgTensor.shape[1];
      const tStartX = Math.round(box[0] * tWidth);
      const tStartY = Math.round(box[1] * tHeight);
      const cropLength = Math.round((box[2] - box[0]) * tWidth);
      const cropHeight = Math.round((box[3] - box[1]) * tHeight);

      const imgArray = imgTensor.arraySync();
      const blockSize = 10; // モザイクのブロックサイズ

      // モザイク処理を適用
      const mosaicArray = applyMosaic(imgArray, tStartX, tStartY, cropLength, cropHeight, blockSize);

      const afterTensor = tf.tensor(mosaicArray, imgTensor.shape, imgTensor.dtype);

      const canvas = document.getElementById('detection') as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      tf.browser.toPixels(afterTensor, canvas).then(() => {
        prediction.dispose();
        imgTensor.dispose();
        afterTensor.dispose();
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

export default C_5_5_1;

// モザイク処理関数
const applyMosaic = (
  imgArray: number[][][],
  startX: number,
  startY: number,
  cropWidth: number,
  cropHeight: number,
  blockSize: number
): number[][][] => {
  const tHeight = imgArray.length;
  const tWidth = imgArray[0].length;

  for (let y = startY; y < startY + cropHeight && y < tHeight; y += blockSize) {
    for (let x = startX; x < startX + cropWidth && x < tWidth; x += blockSize) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let by = 0; by < blockSize; by++) {
        for (let bx = 0; bx < blockSize; bx++) {
          if (y + by < tHeight && x + bx < tWidth) {
            r += imgArray[y + by][x + bx][0];
            g += imgArray[y + by][x + bx][1];
            b += imgArray[y + by][x + bx][2];
            count++;
          }
        }
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      for (let by = 0; by < blockSize; by++) {
        for (let bx = 0; bx < blockSize; bx++) {
          if (y + by < tHeight && x + bx < tWidth) {
            imgArray[y + by][x + bx] = [r, g, b];
          }
        }
      }
    }
  }
  return imgArray;
};