import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Rate } from 'antd';

const types: string[] = [
  "🐉",
  "🦜",
  "🔥",
  "💧",
  "🧚",
  "🌱"
];

const monsters = [
  {
    name: "カイリュー",
    types: [1, 1, 0, 0, 0, 0],
  },
  {
    name: "リザードン",
    types: [0, 1, 1, 0, 0, 0],
  },
  {
    name: "カメックス",
    types: [0, 0, 0, 1, 0, 0],
  },
  {
    name: "ウガツホムラ",
    types: [1, 0, 1, 0, 0, 0],
  },
  {
    name: "マリルリ",
    types: [0, 0, 0, 1, 1, 0],
  },
  {
    name: "フシギバナ",
    types: [0, 0, 0, 0, 0, 1],
  },
  {
    name: "ルンパッパ",
    types: [0, 0, 0, 1, 0, 1],
  }
]

const monster_types: number[][] = monsters.map(monster => monster.types)

function C_3_6_3() {
  const [yourVotes, setYourVotes] = React.useState([Array(monsters.length).fill(0)]);
  const [result, setResult] = React.useState('');

  useEffect(() => {
    tf.tidy(() => {
      const user_feats = tf.matMul(yourVotes, monster_types)
      const top_user_types = tf.topk(user_feats, types.length)
      const top_types = top_user_types.indices.arraySync()
      setResult(
        `あなたにおすすめのタイプは${top_types[0].map((type: number) => `「${types[type]}」`).join(',')}です。\n`
      );
    });
  }, [yourVotes]);
  
  return (
    <>
      <p>好きなポケモンのタイプをレコメンドします。</p>
      { monsters.map((monster, index) => (
        <div key={monster.name}>
          <p>{monster.name}</p>
          <Rate
            defaultValue={2}
            character={({ index = 0 }) => index}
            count={11}
            onChange={(value) => {
              const newVotes = [...yourVotes];
              newVotes[0][index] = value - 1;
              setYourVotes(newVotes);
            }}
          />
        </div>
      ))}
      {/* <pre>
        {JSON.stringify(yourVotes, null, 2)}
      </pre> */}
      <pre>
        {result}
      </pre>
    </>
  );
}

export default C_3_6_3