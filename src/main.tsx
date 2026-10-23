import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Shell from './layouts/Shell.tsx'
import GoogleCallback from './pages/GoogleCallback.tsx'
import Home from './pages/Home.tsx'
import Important from './pages/Important.tsx'
import Login from './pages/Login.tsx'
import MyFiles from './pages/MyFiles.tsx'
import Recent from './pages/Recent.tsx'
import Signup from './pages/Signup.tsx'
import Trash from './pages/Trash.tsx'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route element={<Shell />}>
          <Route path="/" element={<Home />} />
          <Route path="/files" element={<MyFiles />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/important" element={<Important />} />
          <Route path="/trash" element={<Trash />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
