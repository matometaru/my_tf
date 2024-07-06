import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function C_3_2() {
  const [tensor, setTensor] = React.useState<tf.Tensor>();

  useEffect(() => {
    tf.tidy(() => {
      const a = tf.tensor([1, 0, 0, 0, -1, 0, 1, 0, 0]);
      const b = tf.tensor([
        [1, 0, 0],
        [0, -1, 0],
        [1, 0, 0],
      ]);
      const c = tf.tensor([1, 0, 0, 0, -1, 0, 1, 0, 0], [3, 3]);
      const d = tf.tensor([1, 0, 0, 0, -1, 0, 1, 0, 0], [3, 3], 'int32');
      console.log(tf.memory().numTensors)
      return
    })
    console.log(tf.memory().numTensors)
  }, []);

  return (
    <div>
      <p>C_3_2</p>
    </div>
  );
}

export default C_3_2