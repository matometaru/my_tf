import React from 'react';
// import C_6_2_1 from './components/C_6_2_1';
import C_6_2_2 from './components/C_6_2_2';
import './App.css'

function App() {
  return (
    <>
      <React.Suspense fallback={<div>Loading model...</div>}>
        <C_6_2_2 />
      </React.Suspense>
    </>
  )
}

export default App;