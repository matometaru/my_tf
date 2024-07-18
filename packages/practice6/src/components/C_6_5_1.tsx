import React from 'react';
import * as tf from '@tensorflow/tfjs';
import { useMount } from 'react-use';
import { useData } from '../hooks/useData'
import { loadModel } from '../utils'
import { CLASSES } from "../labels";

function C_6_5() {
  const model = useData('ssd_mobilenet_v2', loadModel)

  useMount(async () => {
    const videoElement = document.getElementById('video') as HTMLVideoElement
    await setupWebcam(videoElement);

    const canvas = document.getElementById('detection') as HTMLCanvasElement;

    videoElement.onloadedmetadata = () => {
      canvas.width = videoElement.clientWidth;
      canvas.height = videoElement.clientHeight;
      const ctx = canvas.getContext('2d')!;
      const render = () => {
        const sourceTensor = tf.browser.fromPixels(videoElement);
        const readyfied = tf.expandDims(sourceTensor, 0);
        model.executeAsync(readyfied).then(async (result) => {
          const boxesTensor: tf.Tensor2D = result[1].squeeze();
          const topScoresTensor = tf.topk<tf.Tensor2D>(result[0])
          const scoreValuesTensor: tf.Tensor1D = topScoresTensor.values.squeeze();
          const { selectedIndices } = await tf.image.nonMaxSuppressionWithScoreAsync(
            boxesTensor,
            scoreValuesTensor,
            3, // 選択するボックスの最大数
            0.5, // iouThreshold
            0.3, // scoreThreshold: このスコア閾値よりも低いスコアを持つボックスは、重複抑制処理の前に無視されます。
            1
          );
          const [selectedBoxes, maxIndices, boxes, scores] = await Promise.all([
            selectedIndices.data(),
            topScoresTensor.indices.squeeze<tf.Tensor<tf.Rank.R1>>().array(),
            boxesTensor.array() as Promise<BoundingBox[]>,
            scoreValuesTensor.array(),
          ]);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (const i of selectedBoxes) {
            const label = `${CLASSES[maxIndices[i]]}: ${scores[i].toFixed(2)}%`
            drawDetection(ctx, { imgWidth: canvas.width, imgHeight: canvas.height }, boxes[i], label);
          }
        });
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    }
  })

  return (
    <div>
      <p>C_6_5</p>
      <p>canvas on video</p>
      <div style={{ position: 'relative', height: '80vh' }}>
        <video id="video" height={'100%'} autoPlay />
        <canvas id="detection" style={{ position: 'absolute', left: 0 }} />
      </div>
    </div>
  );
}

export default C_6_5;

async function setupWebcam(video: HTMLVideoElement): Promise<MediaStream> {
  // カメラの映像を取得
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user'
    }
  });
  video.srcObject = stream;
  return stream;
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
