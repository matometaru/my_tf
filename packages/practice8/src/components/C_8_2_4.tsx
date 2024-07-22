import React from 'react';
import { useMount } from 'react-use';
import * as tf from '@tensorflow/tfjs';

const jsxs: number[] = []
const jsys: number[] = []

const dataSize = 10;
const stepSize = 0.0005;
for (let i = 0; i < dataSize; i+=stepSize) {
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

function C_8_2_1() {
  const [epochLogs, setEpochLogs] = React.useState<string[]>([])

  const printCallback = {
    onEpochEnd: (epcho, log) => {
      setEpochLogs((prev) => [...prev, `${epcho}: ${log.loss}`])
    }
  }

  useMount(() => {
    model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
    model.summary()
    model.fit(xs, ys, {
      epochs: 50,
      callbacks: printCallback,
      batchSize: 128
    }).then(() => {
      const inputTensor = tf.tensor([9]);
      const answer = model.predict(inputTensor) as tf.Tensor;
      console.log("answer: " + answer.dataSync())
      tf.dispose([xs, ys, inputTensor, answer]);
    })
  })

  return (
    <div>
      <p>C_8_2_1</p>
      <pre>
        {JSON.stringify(epochLogs, null, 2)}
      </pre>
    </div>
  );
}

export default C_8_2_1;