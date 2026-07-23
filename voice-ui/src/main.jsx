import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VoiceChat from './VoiceChat.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VoiceChat />
  </StrictMode>,
)
