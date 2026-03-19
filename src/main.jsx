import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GalleryPage from './GalleryPage.jsx'

const isGalleryRoute = window.location.pathname === '/gallery'
const RootComponent = isGalleryRoute ? GalleryPage : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
)
