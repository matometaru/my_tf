import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useData } from '../hooks/useData'

const modelPath = "models/ttt_model.json"
const initialBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0]

function C_5_2_2() {
  const model = useData('mobilenet', () =>  tf.loadLayersModel(modelPath))
  const [currentBoard, setCurrentBoard] = useState(initialBoard);
  const [isTurnOfAi, setIsTurnOfAI] = useState(false);

  const selectByAi = (index: number) => {
    const newBoard = [...currentBoard]
    newBoard[index] = 1
    setCurrentBoard(newBoard)
  }

  const handlePlayerClick = (index: number) => {
    if (isTurnOfAi) return;

    const newBoard = [...currentBoard]
    newBoard[index] = -1
    setCurrentBoard(newBoard)
    setIsTurnOfAI(true)
  }

  const playOfAi = () => {
    if (!isTurnOfAi) return;

    tf.tidy(() => {
      const board = tf.tensor(currentBoard, [1, 9])
      const result = model.predict(board) as tf.Tensor2D
      result.array().then((resultArray) => {
        const flatResult = resultArray.flat();
        const validCells = flatResult.map((value, index) => (currentBoard[index] === 0 ? value : -Infinity));
        const maxIndex = validCells.indexOf(Math.max(...validCells));
        setTimeout(() => {
          selectByAi(maxIndex);
          setIsTurnOfAI(false);
        }, 500);
      });
    })
  }
  
  useEffect(() => {
    setTimeout(() => {
      const winner = checkWinner(currentBoard);
      if (winner !== null) {
        if (winner === 1) {
          alert("AI wins!");
        } else if (winner === -1) {
          alert("You win!");
        } else {
          alert("It's a draw!");
        }
        setIsTurnOfAI(false);
        return;
      }

      playOfAi();
    }, 0);
  }, [currentBoard]);

  return (
    <div>
      <p>C_5_2_2</p>
      <p>あなたは「×」です。AIが「○」です。</p>
      <CreateBoard
        board={currentBoard}
        onClick={handlePlayerClick}
      />
    </div>
  );
}

export default C_5_2_2;

type Props = {
  board: number[],
  symbolType?: 1 | 2
  onClick: (index: number) => void
}
function CreateBoard({ board, symbolType, onClick }: Props) {
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
  const type = symbolType ? symbolType2 : symbolType1
  return (
    <table>
      <tbody>
        {Array.from({ length: 3 }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 3 }).map((_, colIndex) => {
              const value = board[rowIndex * 3 + colIndex];
              return (
                <td key={colIndex} onClick={() => onClick(rowIndex * 3 + colIndex)}>
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

function checkWinner(board: number[]): number | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]  // Diagonals
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.includes(0) ? null : 0; // Return 0 for draw, null for no winner yet
};