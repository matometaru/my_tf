import React from 'react';
// import C_5_2_1 from './components/C_5_2_1';
// import C_5_2_2 from './components/C_5_2_2';
// import C_5_4_1 from './components/C_5_4_1';
// import C_5_5 from './components/C_5_5';
import C_5_5_1 from './components/C_5_5_1';
import './App.css'

function App() {
  return (
    <>
      <React.Suspense fallback={<div>Loading model...</div>}>
        <C_5_5_1 />
      </React.Suspense>
    </>
  )
}

export default App;