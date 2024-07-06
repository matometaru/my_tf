import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function C_3_1() {
  const [tensor, setTensor] = React.useState<tf.Tensor>();
  const [tensor2, setTensor2] = React.useState<tf.Tensor>();

  useEffect(() => {
    const dataArray = [8, 6, 7, 5, 3, 0, 9];
    const first = tf.tensor(dataArray);
    setTensor(first);

    const guess = tf.tensor([false, true, true], undefined, 'int32');
    setTensor2(guess);
  }, []);

  return (
    <div>
      <p>C_3_1</p>
      <pre>
      const dataArray = [8, 6, 7, 5, 3, 0, 9]; <br />
      tf.tensor(dataArray);
      </pre>
      <pre>
        {JSON.stringify(tensor, null, 2)}
      </pre>

      <pre>
      tf.tensor([false, true, true], undefined, 'int32');
      </pre>
      <pre>
        {JSON.stringify(tensor2, null, 2)}
      </pre>
    </div>
  );
}

export default C_3_1