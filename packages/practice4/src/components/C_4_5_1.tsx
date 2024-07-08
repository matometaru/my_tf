import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Flex } from 'antd';

function C_4_5_1() {
  useEffect(() => {
    drawSortedGrayscale();
  }, []);

  const drawSortedGrayscale = () => {
    const canvas = document.getElementById('my-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgTensor = tf.randomUniform<tf.Rank.R2>([200, 200])
    const sortedTensor = tf.topk(imgTensor, 200).values;
    tf.browser.toPixels(sortedTensor, canvas).then(() => {
      imgTensor.dispose();
      sortedTensor.dispose();
    });
  }

  return (
    <div>
      <p>C_4_5_1</p>
      <Flex justify='space-between'>
        <div>
          <canvas id="my-canvas" />
        </div>
      </Flex>
    </div>
  );
}

export default C_4_5_1;