import React from 'react';
import * as tf from '@tensorflow/tfjs';

const callMeMaybe = tf.tensor([8367677, 4209111, 4209111, 8675309, 8367677])
tf.unique(callMeMaybe).values.array().then(array => {
  console.log(array)
})

function C_3_7() {
  return (
    <div>
      <p>C_3_7</p>
    </div>
  );
}

export default C_3_7