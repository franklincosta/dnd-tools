import React, { Suspense } from 'react';
import './App.css'
import { Header } from './Components/Header'
import { Home } from './Pages/Home'
import { GetFromPDF } from './Pages/GetFromPDF'
import { Stats } from './Pages/Stats'
import { UploadItens } from './Components/UploadItens'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="container my-3">
      {/* <Home /> */}
      <Router>
        <Suspense fallback={<div>Carregando...</div>}>
          {/* <Header/>  */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload-itens" element={<UploadItens />} />
            <Route path="/get-pdf-itens" element={<GetFromPDF />} />
            <Route path="/stats-calculator" element={<Stats />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
