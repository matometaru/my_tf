import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useData } from '../hooks/useData'

function C_6_2_2() {
  const model = useData('pet', loadModel)
  const [imageSrc, setImageSrc] = useState('dinner.jpg');

  const handleImageLoad = () => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      const imgTensor = tf.browser.fromPixels(img);
      const readyfied = tf.expandDims(imgTensor, 0);

      model.executeAsync(readyfied).then((result) => {
        const boxes = result[1].squeeze().arraySync();

        const canvas = document.getElementById('detection') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imgWidth = img.width;
        const imgHeight = img.height;
        canvas.width = imgWidth;
        canvas.height = imgHeight;

        for (const box of boxes) {
          drawDetection(ctx, { imgWidth, imgHeight }, box);
        }
      })
    }
  };

  return (
    <div>
      <p>C_6_2_2</p>
      <div style={{ position: 'relative', height: '80vh' }}>
        <img src={imageSrc} id="img" onLoad={handleImageLoad} height={'100%'} />
        <canvas id="detection" style={{ position: 'absolute', left: 0 }} />
      </div>
    </div>
  );
}

export default C_6_2_2;

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

const modelPath = "https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1";
const modelName = 'ssd_mobilenet_v2'
const indexeddbPath = `indexeddb://${modelName}`

const loadModel = async (): Promise<tf.GraphModel> => {
  try {
    console.log('キャッシュされたモデルをIndexedDBからロードしています...');
    const model = await tf.loadGraphModel(indexeddbPath);
    console.log('モデルをキャッシュからロードしました。');
    return model;
  } catch (error) {
    console.log('キャッシュされたモデルのロードに失敗しました。新しいモデルをロードします...');
  }

  // キャッシュがない場合、モデルをTensorFlow HubからロードしてIndexedDBに保存
  console.log('モデルをTensorFlow Hubからロードしています...');
  const model = await tf.loadGraphModel(modelPath, { fromTFHub: true });
  await model.save(indexeddbPath);
  console.log('モデルをIndexedDBに保存しました。');
  
  return model;
};