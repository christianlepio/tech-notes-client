import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// CSS
import './index.css'
import 'bootstrap/dist/css/bootstrap.css' //import bootstrap css
import 'bootstrap-icons/font/bootstrap-icons.css' //import bootstrap icon
import 'bootstrap/dist/js/bootstrap.bundle.js' //import bootstrap js

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
