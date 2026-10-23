import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Header } from './components/Header.tsx'
import { SideBar } from './components/SideBar.tsx'
import Home from './pages/Home.tsx'
import Important from './pages/Important.tsx'
import MyFiles from './pages/MyFiles.tsx'
import Recent from './pages/Recent.tsx'
import Trash from './pages/Trash.tsx'
import styles from './styles/app.module.css'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className={styles.container}>
        <SideBar />
        <div className={styles.main}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/files" element={<MyFiles />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/important" element={<Important />} />
            <Route path="/trash" element={<Trash />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </StrictMode>,
)
