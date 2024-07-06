import React from 'react';
import ImagePrediction from './components/ImagePrediction';
import './App.css'

function App() {
  return (
    <>
      <React.Suspense fallback={<div>Loading model...</div>}>
        <ImagePrediction />
      </React.Suspense>
    </>
  )
}

export default App;