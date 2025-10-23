import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProgressProvider } from './context/progressContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
    <ProgressProvider>
      <ChatProvider>
    <App />
    </ChatProvider>
    </ProgressProvider>
    </AuthProvider>
  </BrowserRouter>,
)
