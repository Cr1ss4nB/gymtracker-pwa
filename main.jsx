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
import { SessionProvider } from './contexts/SessionContext'
import { requestNotificationPermission, isSubscribed } from './js/lib/notifications.js'

import './styles/global.css'
import './js/lib/indexeddb.js'
import { checkAndSyncOnStartup } from './js/lib/syncManager.js'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(async () => {
        console.log('[SW] Service Worker registrado')
        const subscribed = await isSubscribed()
        if (!subscribed && localStorage.getItem('token')) {
          await requestNotificationPermission()
        }
      })
      .catch((err) => console.warn('[SW] Error al registrar SW:', err))
  })
}

checkAndSyncOnStartup()

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RoutineProvider>
        <SessionProvider>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* App */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
            } />

            <Route path="/ejercicios" element={
              <ProtectedRoute><Layout><Exercises /></Layout></ProtectedRoute>
            } />

            {/* /rutinas/favoritos antes de /rutinas para evitar colisión de rutas */}
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

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </SessionProvider>
      </RoutineProvider>
    </BrowserRouter>
  </StrictMode>
)
