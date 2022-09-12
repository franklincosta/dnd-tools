import React, { Suspense } from 'react';
import { Home } from './Pages/Home'
import { UploadItens } from './Components/UploadItens'
import { Header } from './Components/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="container my-3">
      <Router>
        <Suspense fallback={<div>Carregando...</div>}>
          {/* <Header/> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload-itens" element={<UploadItens />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
