import * as tf from '@tensorflow/tfjs';

const modelPath = "https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1";
const modelName = 'ssd_mobilenet_v2'
const indexeddbPath = `indexeddb://${modelName}`

export const loadModel = async (): Promise<tf.GraphModel> => {
  try {
    console.log('キャッシュされたモデルをIndexedDBからロードしています...');
    const model = await tf.loadGraphModel(indexeddbPath);
    console.log('モデルをキャッシュからロードしました。');
    return model;
  } catch (error) {
    console.log('キャッシュされたモデルのロードに失敗しました。新しいモデルをロードします...');
  }

  // キャッシュがない場合、モデルをTensorFlow HubからロードしてIndexedDBに保存
  console.log('モデルをTensorFlow Hubからロードしています...');
  const model = await tf.loadGraphModel(modelPath, { fromTFHub: true });
  await model.save(indexeddbPath);
  console.log('モデルをIndexedDBに保存しました。');
  
  return model;
};