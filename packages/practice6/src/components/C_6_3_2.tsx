import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useData } from '../hooks/useData'
import { loadModel } from '../utils'

function C_6_3_2() {
  const model = useData('ssd_mobilenet_v2', loadModel)
  const [imageSrc, setImageSrc] = useState('dinner.jpg');

  const handleImageLoad = async () => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      const imgTensor = tf.browser.fromPixels(img);
      const readyfied = tf.expandDims(imgTensor, 0);

      model.executeAsync(readyfied).then(async (result) => {
        const boxes: tf.Tensor2D = result[1].squeeze();
        const scores: tf.Tensor1D = tf.topk(result[0]).values.squeeze<tf.Tensor<tf.Rank.R1>>()
        const { selectedIndices } = await tf.image.nonMaxSuppressionWithScoreAsync(
          boxes,
          scores,
          10, // 選択するボックスの最大数
          0.5, // iouThreshold
          0.3, // scoreThreshold: このスコア閾値よりも低いスコアを持つボックスは、重複抑制処理の前に無視されます。
          1
        );
        selectedIndices.print()
        const selectedBoxes = selectedIndices.dataSync()

        const canvas = document.getElementById('detection') as HTMLCanvasElement;
        const { ctx, imgWidth, imgHeight } = setCanvasByImg(canvas, img)
        const boxesArray = boxes.arraySync() as BoundingBox[]
        for (const i of selectedBoxes) {
          drawDetection(ctx, { imgWidth, imgHeight }, boxesArray[i]);
        }
      })
    }
  };

  return (
    <div>
      <p>C_6_3_2</p>
      <div style={{ position: 'relative', height: '80vh' }}>
        <img src={imageSrc} id="img" onLoad={handleImageLoad} height={'100%'} />
        <canvas id="detection" style={{ position: 'absolute', left: 0 }} />
      </div>
    </div>
  );
}

export default C_6_3_2;

function setCanvasByImg(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2d context is not supported');
  }

  const imgWidth = img.width;
  const imgHeight = img.height;
  canvas.width = imgWidth;
  canvas.height = imgHeight;

  return { ctx, imgWidth, imgHeight }
}

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