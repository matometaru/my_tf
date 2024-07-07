import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Flex } from 'antd';

function C_4_4() {
  const [imageSrc, setImageSrc] = useState('coffee.jpg');

  useEffect(() => {
    const canvas = document.getElementById('my-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      img.onload = () => {
        const imgTensor = tf.browser.fromPixels(img);
        const flippedImgTensor = imgTensor.reverse(1);
        tf.browser.toPixels(flippedImgTensor, canvas).then(() => {
          imgTensor.dispose();
          flippedImgTensor.dispose();
        })
      }
    }
  }, [imageSrc]);

  return (
    <div>
      <p>C_4_4</p>
      <Flex justify='space-between' style={{ width: 500 }}>
        <img id="img" src={imageSrc} alt="" />
        <canvas id="my-canvas" />
      </Flex>
    </div>
  );
}

export default C_4_4