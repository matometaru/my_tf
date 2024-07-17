import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

// [1, 6, 5]のテンソル
const t: tf.Tensor3D = tf.tensor([[
  [1, 2, 3, 4, 5],
  [1.1, 2.1, 3.1, 4.1, 5.1],
  [1.2, 2.2, 3.2, 4.2, 5.2],
  [1.2, 12.2, 3.2, 4.2, 5.2],
  [1.3, 2.3, 3.3, 4.3, 5.3],
  [1, 1, 1, 1, 1, 1]
]])

const { values } = tf.topk(t)
const topvValues = values.squeeze<tf.Tensor<tf.Rank.R1>>()
topvValues.print()
const sorted = tf.topk(topvValues, 3)

// const getTopN = (t: tf.Tensor, n: number) => tf.topk(tf.topk(t).values.squeeze(), n)

function C_6_6_1() {
  return (
    <div>
      <p>C_6_6_1</p>
      <p>topvValues</p>
      <pre>
        {JSON.stringify(topvValues.arraySync(), null, 2)}
      </pre>
      <pre>
        {JSON.stringify(sorted.values.arraySync(), null, 2)}
      </pre>
      <pre>
        {JSON.stringify(sorted.indices.arraySync(), null, 2)}
      </pre>
      <pre>
        {JSON.stringify(sorted.values.arraySync(), null, 2)}
      </pre>
    </div>
  );
}

export default C_6_6_1;