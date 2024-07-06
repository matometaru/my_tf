import React from 'react';
import * as tf from '@tensorflow/tfjs';

const users = [
  'ワタル',
  'こだわりのない佐藤',
  '火吹き野郎の鈴木',
  'だいすきクラブ高橋'
]

// userの投票
const user_votes: number[][] = [
  [10, 9, 1, 10, 0], // ワタル
  [1, 1, 5, 2, 8], // 佐藤
  [3, 10, 1, 10, 1], // 火吹き野郎の鈴木
  [1, 1, 1, 1, 10], // だいすきクラブ高橋
];

const monsters: string[] = [
  "カイリュー",
  "リザードン",
  "カメックス",
  "ウガツホムラ",
  "マリルリ",
];

const types: string[] = [
  "ドラゴン",
  "ひこう",
  "ほのお",
  "みず",
  "フェアリー",
];

const monster_types: number[][] = [
  [1, 1, 0, 0, 0], // カイリュー
  [0, 1, 1, 0, 0], // リザードン
  [0, 0, 0, 1, 0], // カメックス
  [1, 0, 1, 0, 0], // ウガツホムラ
  [0, 0, 0, 1, 1], // マリルリ
];

const user_feats = tf.matMul(user_votes, monster_types)
const top_user_types = tf.topk(user_feats, types.length)
const top_types = top_user_types.indices.arraySync()
let result = ''
users.forEach((user, i) => {
  result += `${user}のおすすめのタイプは${top_types[i].map((type: number) => `「${types[type]}」`).join(',')}です。\n`
})

function C_3_6_2() {
  return (
    <div>
      <p>C_3_6_2</p>
      <pre>
        {result}
      </pre>
    </div>
  );
}

export default C_3_6_2