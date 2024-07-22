import React from 'react';
// import C_8_1_5 from './components/C_8_1_5';
// import C_8_2_1 from './components/C_8_2_1';
import C_8_2_4 from './components/C_8_2_4';
import './App.css'

function App() {
  return (
    <>
      <React.Suspense fallback={<div>Loading model...</div>}>
        <C_8_2_4 />
      </React.Suspense>
    </>
  )
}

export default App;