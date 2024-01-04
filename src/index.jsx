import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// CSS
import './index.css'
import 'bootstrap/dist/css/bootstrap.css' //import bootstrap css
import 'bootstrap-icons/font/bootstrap-icons.css' //import bootstrap icon
import 'bootstrap/dist/js/bootstrap.bundle.js' //import bootstrap js

// redux state management provider
import { Provider } from 'react-redux'
import { store } from './app/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* wrapping the app component within the Provider
        Provider is required when working with redux
        store props here is a global state that will be available to the app component
    */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
