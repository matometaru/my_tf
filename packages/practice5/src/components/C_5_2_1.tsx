import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useMount } from 'react-use';
import { Flex } from 'antd';

const modelPath = "models/ttt_model.json"
const board1 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
const board2 = [-1, 0, 0, 1, 1, -1, 0, 0, -1]
const board3 = [1, 0, 1, 0, -1, -1, -1, 0, 1]
const board4 = [0, 0, 1, 0, -1, 0, 1, -1, -1] // モデルの予想が間違っている盤面

function C_5_2_1() {
  const [result, setResult] = useState({});
  
  useMount(async () => {
    tf.tidy(() => {
      tf.loadLayersModel(modelPath).then((model) => {
        const emptyBoardTensor = tf.tensor(board1)
        const board2Tensor = tf.tensor(board2)
        const board3Tensor = tf.tensor(board3)
        const board4Tensor = tf.tensor(board4)

        const matches = tf.stack([emptyBoardTensor, board2Tensor, board3Tensor, board4Tensor])
        const result = model.predict(matches) as tf.Tensor2D
        setResult(result.reshape([4, 3, 3]).arraySync())
      })
    })
  });

  return (
    <div>
      <p>C_5_2_1</p>
      <Flex justify='space-between' style={{ width: 500 }}>
        <div>
          <p>A.初手</p>
          {createBoard(board1)}
        </div>
        <div>
          <p>B.防御（AI:○）</p>
          {createBoard(board2)}
        </div>
        <div>
          <p>C.勝利（AI:×）</p>
          {createBoard(board3, 2)}
        </div>
        <div>
          <p>D.間違い（AI:×）</p>
          {createBoard(board4, 2)}
        </div>
      </Flex>
      <pre>
        {JSON.stringify(result, null, 2)}
      </pre>
      <p>Dについて、最高の値は 0.7948392033576965 で、インデックスは [1, 1] です。<br />
        しかし、このインデックスはすでにプレイヤーが占めています。したがって、モデルが無効な選択を行っています。
      </p>
    </div>
  );
}

export default C_5_2_1;

function createBoard(board: number[], symbolType: 1 | 2 = 1) {
  const symbolType1 = {
    '-1': '×',
    '0': '',
    '1': '○',
  }
  const symbolType2 = {
    '-1': '○',
    '0': '',
    '1': '×',
  }
  const type = symbolType === 1 ? symbolType1 : symbolType2
  return (
    <table>
      <tbody>
        {Array.from({ length: 3 }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 3 }).map((_, colIndex) => {
              const value = board[rowIndex * 3 + colIndex];
              return (
                <td key={colIndex}>
                  {type[value]}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}