# GymTracker PWA

Proyecto académico correspondiente a la asignatura Electiva III - Aplicaciones Web Progresivas (PWA).

GymTracker es una aplicación web progresiva orientada al seguimiento de rutinas de entrenamiento y progreso físico del usuario. Permite registrar ejercicios, series, repeticiones y tiempos de entrenamiento, así como validar la actividad mediante interacciones dinámicas durante la sesión.

---

## Descripción

La aplicación permite a los usuarios gestionar sus rutinas de entrenamiento, ya sea en casa o en gimnasio, registrando el rendimiento de cada sesión. Se incluye un sistema de temporización del entrenamiento y validaciones aleatorias que solicitan evidencia de actividad, con el objetivo de evitar registros inexactos.

El sistema está diseñado bajo un enfoque offline-first, permitiendo registrar información sin conexión a internet y sincronizarla posteriormente.

---

## Objetivo

Aplicar de manera práctica los conceptos fundamentales de las aplicaciones web progresivas, incluyendo:

- Service Workers
- Estrategias de caching
- Almacenamiento offline con IndexedDB
- Notificaciones push
- Instalación mediante manifest
- Auditoría de desempeño y buenas prácticas

---

## Funcionalidades

- Registro e inicio de sesión de usuarios
- Gestión de perfil con datos físicos básicos
- Creación de rutinas organizadas por días
- Selección de ejercicios desde un catálogo predefinido
- Registro de entrenamiento por series (peso y repeticiones)
- Temporizador de inicio y fin de sesión
- Validaciones dinámicas durante el entrenamiento:
  - Registro manual de datos
  - Subida de imágenes
  - Confirmación de actividad
- Seguimiento de progreso semanal
- Generación de reportes comparativos
- Funcionamiento offline mediante almacenamiento local
- Sincronización automática al recuperar conexión
- Notificaciones push
- Soporte opcional de geolocalización

---

## Características PWA

- Instalación como aplicación mediante manifest.json
- Service Worker con eventos install, activate y fetch
- Estrategias de caching según tipo de recurso
- Soporte offline parcial
- Uso de IndexedDB para persistencia local
- Notificaciones push con VAPID keys

---

## Arquitectura

El sistema sigue una arquitectura cliente-servidor:

Frontend:
- Interfaz de usuario
- Manejo de estado y navegación
- Consumo de API mediante fetch
- Lógica de funcionamiento PWA

Backend:
- API REST
- Autenticación de usuarios
- Gestión de rutinas y registros

Base de datos:
- Almacenamiento estructurado de usuarios, ejercicios y entrenamientos

---

## Stack Tecnológico

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Node.js
- Express

Base de datos:
- PostgreSQL

PWA:
- Service Worker
- IndexedDB
- Web Push API

Herramientas:
- Nodemon
- Lighthouse

---

## Flujo de uso

1. El usuario se registra e inicia sesión
2. Configura su perfil
3. Crea su rutina semanal
4. Selecciona ejercicios por día
5. Inicia el entrenamiento (timer)
6. Registra series y repeticiones
7. Responde validaciones dinámicas
8. Finaliza la sesión
9. El sistema almacena y compara resultados

---

## Funcionamiento Offline

La aplicación permite registrar datos sin conexión a internet mediante IndexedDB. Una vez que la conexión se restablece, los datos se sincronizan automáticamente con el servidor.

---

## Auditoría

El proyecto será evaluado mediante Lighthouse, buscando cumplir con métricas de desempeño, accesibilidad, buenas prácticas y características PWA.

---

## Equipo

- Cristian Andrés Basto Largo
- Brayan Fabian Borda Quemba
- Karina Lucero Alfonso Valderrama

---

## Estado del proyecto

En desarrollo