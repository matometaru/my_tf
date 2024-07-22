import React from 'react';
import * as tf from '@tensorflow/tfjs';

const xs: tf.Tensor1D = tf.tensor([-1, 0, 1, 2, 3, 4])
const ys: tf.Tensor1D = tf.tensor([-4,-2, 0, 2, 4, 6])

const model = tf.sequential();
model.add(
  tf.layers.dense({
    inputShape: [1],
    units: 1,
  })
)
model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
model.summary()
model.fit(xs, ys, { epochs: 350 }).then(history => {
  const inputTensor = tf.tensor([100]);
  const answer = model.predict(inputTensor) as tf.Tensor;
  // @ts-ignore
  console.log(`10 results in ${Math.round(answer.dataSync())}`);
  tf.dispose([xs, ys, inputTensor, answer]);
})

function C_8_1_5() {
  return (
    <div>
      <p>C_8_1_5</p>
    </div>
  );
}

export default C_8_1_5;