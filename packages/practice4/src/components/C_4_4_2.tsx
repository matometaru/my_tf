import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Flex } from 'antd';

function C_4_4_2() {
  const [imageSrc, setImageSrc] = useState('littleGant.jpg');

  const blResize = (img: HTMLImageElement) => {
    const blCanvas = document.getElementById('bl-canvas') as HTMLCanvasElement;
    const ctx = blCanvas.getContext('2d');
    if (!ctx) return;

    const newSize: [number, number] = [768, 560]
    tf.tidy(() => {
      const imgTensor = tf.browser.fromPixels(img);
      const resizeTensor = tf.image.resizeBilinear(imgTensor, newSize, true);
      const scaledTensor = resizeTensor.div(255) as tf.Tensor3D;
      tf.browser.toPixels(scaledTensor, blCanvas);
    })
  };

  const nnResize = (img: HTMLImageElement) => {
    const nnCanvas = document.getElementById('nn-canvas') as HTMLCanvasElement;
    const ctx = nnCanvas.getContext('2d');
    if (!ctx) return;

    const newSize: [number, number] = [768, 560]
    tf.tidy(() => {
      const imgTensor = tf.browser.fromPixels(img);
      const resizeTensor = tf.image.resizeNearestNeighbor(imgTensor, newSize, true);
      const scaledTensor = resizeTensor.div(255) as tf.Tensor3D;
      tf.browser.toPixels(scaledTensor, nnCanvas);
    })
  };

  const handleImageLoad = () => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      blResize(img);
      nnResize(img);
    }
  };

  return (
    <div>
      <p>C_4_4_2</p>
      <Flex justify='space-between'>
        <div>
          <p>元画像</p>
          <img id="img" src={imageSrc} alt="" onLoad={handleImageLoad} />
        </div>
        <div>
          <p>resizeBilinear（バイリニア補間法）</p>
          <canvas id="bl-canvas" />
        </div>
        <div>
          <p>resizeNearestNeighbor（最近傍補間法）</p>
          <canvas id="nn-canvas" />
        </div>
      </Flex>
    </div>
  );
}

export default C_4_4_2;