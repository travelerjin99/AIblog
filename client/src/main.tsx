import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BlogProvider } from './context/BlogContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Wrapping the App with BlogProvider to provide blog context */}
    <BlogProvider>
      <App />
    </BlogProvider>
  </StrictMode>,
)
