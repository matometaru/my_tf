import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useData } from '../hooks/useData'
import { loadModel } from '../utils'

type Sorted = {
  values: tf.Tensor<tf.Rank.R1>;
  indices: tf.Tensor<tf.Rank.R1>;
}
const getTopN = (t: tf.Tensor3D, n: number): Sorted => {
  const { values } = tf.topk(t)
  const topvValues = values.squeeze<tf.Tensor<tf.Rank.R1>>()
  return tf.topk(topvValues, n)
}

function C_6_3_1() {
  const model = useData('ssd_mobilenet_v2', loadModel)
  const [imageSrc, setImageSrc] = useState('dinner.jpg');

  const handleImageLoad = () => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      const imgTensor = tf.browser.fromPixels(img);
      const readyfied = tf.expandDims(imgTensor, 0);

      model.executeAsync(readyfied).then((result) => {
        const top20Index = getTopN(result[0], 20).indices.arraySync();
        const boxes = result[1].squeeze().arraySync();

        const canvas = document.getElementById('detection') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imgWidth = img.width;
        const imgHeight = img.height;
        canvas.width = imgWidth;
        canvas.height = imgHeight;

        for (const index of top20Index) {
          drawDetection(ctx, { imgWidth, imgHeight }, boxes[index]);
        }
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

type BoundingBox = [number, number, number, number]

function drawDetection(ctx, { imgWidth, imgHeight }, box: BoundingBox) {
  const startX = box[1] * imgWidth;
  const startY = box[0] * imgHeight;
  const width = (box[3] - box[1]) * imgWidth;
  const height = (box[2] - box[0]) * imgHeight;
  drawStrokeRect(ctx, [startX, startY, width, height]);

  function drawStrokeRect(ctx: CanvasRenderingContext2D, box: BoundingBox) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.strokeRect(...box);
  }
}