import React from 'react';
import C_8_1_5 from './components/C_8_1_5';
import './App.css'

function App() {
  return (
    <>
      <React.Suspense fallback={<div>Loading model...</div>}>
        <C_8_1_5 />
      </React.Suspense>
    </>
  )
}

export default App;