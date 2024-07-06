import React, { useEffect } from 'react';
import '@tensorflow/tfjs-backend-cpu';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { useData } from '../hooks/useData'
import { useState } from 'react';

const version = 2;
const alpha = 0.5;

function ImagePrediction() {
  const model = useData('mobilenet', () => mobilenet.load({version, alpha}))
  const [result, setResult] = useState({});
  const [imageSrc, setImageSrc] = useState('coffee.jpg');

  useEffect(() => {
    const img = document.getElementById('img');
    if (img instanceof HTMLImageElement) {
      img.onload = () => {
        model.classify(img).then((predictions) => {
          setResult(predictions)
        })
      }
    }
  }, [imageSrc]);
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      if (reader) {
        reader.onload = () => {
          setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <p>ImagePrediction</p>
      <img id="img" width={300} src={imageSrc} alt="Selected" />
      <pre style={{ 'textAlign': 'left' }}>{JSON.stringify(result, null, 2)}</pre>
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
    </div>
  );
}

export default ImagePrediction