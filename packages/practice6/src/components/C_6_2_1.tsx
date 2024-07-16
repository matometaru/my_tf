import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useData } from '../hooks/useData'

const modelPath = "https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1";

function C_6_2_1() {
  const model = useData('pet', () =>  tf.loadGraphModel(modelPath, { fromTFHub: true }))
  const [imageSrc, setImageSrc] = useState('dinner.jpg');

  const handleImageLoad = () => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      const imgTensor = tf.browser.fromPixels(img);
      const readyfied = tf.expandDims(imgTensor, 0);

      model.executeAsync(readyfied).then((result) => {
        console.log("First", result[0].shape);
        result[0].print();
        console.log("Second", result[1].shape);
        result[1].print();
      })
    }
  };

  return (
    <div>
      <p>C_6_2_1</p>
      <div>
        <img src={imageSrc} id="img" onLoad={handleImageLoad} height={600} />
        <canvas id="detection" />
      </div>
    </div>
  );
}

export default C_6_2_1;