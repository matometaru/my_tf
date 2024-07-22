import React from 'react';
import { useMount } from 'react-use';
import * as tf from '@tensorflow/tfjs';

const jsxs: number[] = []
const jsys: number[] = []

const dataSize = 1000;
for (let i = 0; i < dataSize; i++) {
  jsxs.push(i)
  jsys.push(i * i)
}

const xs: tf.Tensor1D = tf.tensor(jsxs)
const ys: tf.Tensor1D = tf.tensor(jsys)

const model = tf.sequential();
model.add(
  tf.layers.dense({
    units: 20,
    inputShape: [1],
    activation: 'relu'
  })
)
model.add(
  tf.layers.dense({
    units: 1,
  })
)

const printCallback = {
  onEpochEnd: (epcho, log) => {
    console.log(epcho, log)
  }
}

function C_8_2_1() {
  const [loaing, setLoading] = React.useState(true)

  useMount(() => {
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    model.summary()
    model.fit(xs, ys, {
      epochs: 350,
      callbacks: printCallback
    }).then(() => {
      const inputTensor = tf.tensor([100]);
      const answer = model.predict(inputTensor) as tf.Tensor;
      // @ts-ignore
      console.log(`10 results in ${Math.round(answer.dataSync())}`);
      tf.dispose([xs, ys, inputTensor, answer]);
      setLoading(false)
    })
  })

  if (loaing) {
    return <div>Compiling...</div>
  }

  return (
    <div>
      <p>C_8_2_1</p>
    </div>
  );
}

export default C_8_2_1;