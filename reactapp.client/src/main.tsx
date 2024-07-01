import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import './index.css'

// Cała strona jest owinięta w BrowserRouter aby odseparować UI od Adresu strony

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
          <App />   
      </BrowserRouter>
  </React.StrictMode>,
)
