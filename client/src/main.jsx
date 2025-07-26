import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext.jsx'
import { Toaster } from 'react-hot-toast' // 

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <App />
    </AppProvider>
  </BrowserRouter>
)
