import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import GlobalOverview from './pages/GlobalOverview';
import DeepDive from './pages/DeepDive';
import AgentWarRoom from './pages/AgentWarRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<GlobalOverview />} />
          <Route path="deep-dive" element={<DeepDive />} />
          <Route path="war-room" element={<AgentWarRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
