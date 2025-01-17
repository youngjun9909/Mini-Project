import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import styled from 'styled-components'

const Box = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <Box>
        <Routes>
          <Route path='/cart' />
          <Route path='/todo' />
        </Routes>
    </Box>
  );
}

export default App;
