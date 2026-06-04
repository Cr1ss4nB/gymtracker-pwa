import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Profile from './pages/profile/Profile'
import Exercises from './pages/exercises/Exercises'
import Routines from './pages/routines/Routines'
import Favorites from './pages/routines/Favorites'
import Progress from './pages/progress/Progress'
import Layout from './components/Layout'
import { RoutineProvider } from './contexts/RoutineContext'
import './styles/global.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker registrado'))
      .catch((err) => console.log('Error SW:', err))
  })
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RoutineProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
          } />

          <Route path="/ejercicios" element={
            <ProtectedRoute><Layout><Exercises /></Layout></ProtectedRoute>
          } />

          <Route path="/rutinas/favoritos" element={
            <ProtectedRoute><Layout><Favorites /></Layout></ProtectedRoute>
          } />

          <Route path="/rutinas" element={
            <ProtectedRoute><Layout><Routines /></Layout></ProtectedRoute>
          } />

          <Route path="/progreso" element={
            <ProtectedRoute><Layout><Progress /></Layout></ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </RoutineProvider>
    </BrowserRouter>
  </StrictMode>
)
