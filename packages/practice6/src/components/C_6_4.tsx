import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useData } from '../hooks/useData'
import { loadModel } from '../utils'
import { CLASSES } from "../labels";

function C_6_4() {
  const model = useData('ssd_mobilenet_v2', loadModel)
  const [imageSrc, setImageSrc] = useState('dinner.jpg');

  const handleImageLoad = async () => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      const imgTensor = tf.browser.fromPixels(img);
      const readyfied = tf.expandDims(imgTensor, 0);

      const canvas = document.getElementById('detection') as HTMLCanvasElement;
      const { ctx, imgWidth, imgHeight } = setCanvasByImg(canvas, img)

      model.executeAsync(readyfied).then(async (result) => {
        const boxesTensor: tf.Tensor2D = result[1].squeeze();
        const topScoresTensor = tf.topk<tf.Tensor2D>(result[0])
        const scoreValuesTensor: tf.Tensor1D = topScoresTensor.values.squeeze();
        const { selectedIndices } = await tf.image.nonMaxSuppressionWithScoreAsync(
          boxesTensor,
          scoreValuesTensor,
          10, // 選択するボックスの最大数
          0.5, // iouThreshold
          0.3, // scoreThreshold: このスコア閾値よりも低いスコアを持つボックスは、重複抑制処理の前に無視されます。
          1
        );
        const selectedBoxes = selectedIndices.dataSync()

        const maxIndices = topScoresTensor.indices.squeeze<tf.Tensor<tf.Rank.R1>>().arraySync()
        const boxes = boxesTensor.arraySync() as BoundingBox[]
        const scores = scoreValuesTensor.arraySync()
        for (const i of selectedBoxes) {
          const label = `${CLASSES[maxIndices[i]]}: ${scores[i]}%`
          console.log(label)
          drawDetection(ctx, { imgWidth, imgHeight }, boxes[i], label);
        }
      })
    }
  };

  return (
    <div>
      <p>C_6_4</p>
      <div style={{ position: 'relative', height: '80vh' }}>
        <img src={imageSrc} id="img" onLoad={handleImageLoad} height={'100%'} />
        <canvas id="detection" style={{ position: 'absolute', left: 0 }} />
      </div>
    </div>
  );
}

export default C_6_4;

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
function drawDetection(ctx, { imgWidth, imgHeight }, box: BoundingBox, label: string) {
  const startX = box[1] * imgWidth;
  const startY = box[0] * imgHeight;
  const width = (box[3] - box[1]) * imgWidth;
  const height = (box[2] - box[0]) * imgHeight;
  drawStrokeRect(ctx, [startX, startY, width, height]);
  drawLabel(ctx, label);

  function drawStrokeRect(ctx: CanvasRenderingContext2D, box: BoundingBox) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.globalCompositeOperation = "destination-over"
    ctx.strokeRect(...box);
  }

  function drawLabel(ctx: CanvasRenderingContext2D, label: string) {
    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial";
    ctx.textBaseline = "top";
    const textHeight = 16;
    const textPad = 4;
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(startX, startY, textWidth + textPad, textHeight + textPad);
    ctx.fillStyle = "#000000";
    ctx.fillText(label, startX+2, startY+3);
  }
}