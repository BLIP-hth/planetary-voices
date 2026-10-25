import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts (no external Google Fonts CDN — works on any network/VPN/region)
// Science-museum type system: Bricolage Grotesque (display, characterful) +
// Hanken Grotesk (body, legible & warm) + IBM Plex Mono (technical placard labels)
import '@fontsource-variable/bricolage-grotesque/index.css'
import '@fontsource-variable/hanken-grotesk/index.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
