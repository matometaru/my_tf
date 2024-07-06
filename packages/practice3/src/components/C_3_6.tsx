import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const mat1 = [
  [91, 82, 13],
  [15, 23, 62],
  [25, 66, 63]
]

const mat2 = [
  [ 1, 23, 83],
  [33, 12,  5],
  [ 7, 23, 61]
]

function C_3_6() {
  const [result, setResult] = React.useState({});

  useEffect(() => {
    tf.matMul(mat1, mat2).array().then(array => {
      setResult(array);
    })
  }, []);

  const codeString = `
const mat1 = [
  [91, 82, 13],
  [15, 23, 62],
  [25, 66, 63]
];

const mat2 = [
  [1, 23, 83],
  [33, 12, 5],
  [7, 23, 61]
];

tf.matMul(mat1, mat2).arraySync();
`;

  return (
    <div>
      <p>C_3_6</p>
      <pre>{codeString}</pre>
      <pre>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

export default C_3_6