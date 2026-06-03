# Endpoint /ejercicios

## Objetivo
Mostrar catálogo completo de ejercicios.

---

## Funcionalidades

### Permitido
- GET ejercicios
- GET ejercicio por id
- Filtros de grupo muscular 
- Búsqueda en tiempo real a medida que escribe

### NO permitido
- DELETE
- CREATE
- UPDATE

Los ejercicios son estáticos y se manejan directamente desde la base de datos.

---

## Filtros

- Grupo muscular
- Equipamiento
- Dificultad
- Home/Gym

---

## UI

Cards con:
- Imagen
- Nombre
- Grupo muscular
- Submúsculos
- Dificultad
- Botón agregar

Diseño:
- Gradientes rojos/naranjas
- Hover animations
- Responsive
- Mantener el estilo actual que existe, ese diseño es bueno. 

---

## Comportamiento

- Buscador en tiempo real
- Scroll virtual si hay muchos ejercicios
- Compatible con drag & drop