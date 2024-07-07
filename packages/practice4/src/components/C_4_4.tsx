import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Flex, Button } from 'antd';

function C_4_4() {
  const [imageSrc, setImageSrc] = useState('coffee.jpg');
  const [reverseIndex, setReverseIndex] = useState(1);

  useEffect(() => {
    const canvas = document.getElementById('my-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      const imgTensor = tf.browser.fromPixels(img);
      const flippedImgTensor = imgTensor.reverse(reverseIndex);
      tf.browser.toPixels(flippedImgTensor, canvas).then(() => {
        imgTensor.dispose();
        flippedImgTensor.dispose();
      })
    }
  }, [imageSrc, reverseIndex]);

  return (
    <div>
      <p>C_4_4</p>
      <Flex justify='space-between' style={{ width: 500 }}>
        <img id="img" src={imageSrc} alt="" />
        <Flex gap="middle" justify='space-evenly' vertical style={{ width: 50 }}>
          <Button onClick={() => setReverseIndex(0)}>↕️</Button>
          <Button onClick={() => setReverseIndex(1)}>↔️</Button>
          <Button onClick={() => setReverseIndex(2)}>色</Button>
        </Flex>
        <canvas id="my-canvas" />
      </Flex>
    </div>
  );
}

export default C_4_4