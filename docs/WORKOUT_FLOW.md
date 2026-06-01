# Flujo de entrenamiento

## Inicio

Usuario:
1. Debe tener una rutina activa y visible en rutinas. En el dashboard principal saldrá la sesión del día con los ejercicios en lista y tabla con columnas de (Día, abajo 4 columnas columnas que son: numero, ejercicio, series, repeticiones + opcional añadir el peso usado en esa maquina o equipo en kilos).
2. En el dashboard abajo de la tabla de la sesión estará el botón ocon gradientes en verde que dice inicia entrenamiento
3. inicia timer
4. Para detenerlo el usuario debe darle click al botón gradientes rojos que dice Entrenamiento terminado.

---

## Durante entrenamiento

Una vez el timer esté activo y corriendo como cronometro será capaz de:
Registrar peso en el endpoint de rutinas o en la misma tabla del dashboard de la sesión.

Además le pedirá al usuario cada 10 minutos registros o validaciones las cuales serían:

- Peso usado en la última serie (en kilos y texto) 
- Foto de la maquina o selfie (uso de camara)
- notas respondiendo alguna pregunta tipo cuanto tiempo le queda de entrenamiento, etc. (texto)
- Nota de voz donde lee un texto corto y motivacional. (microfono).
- Activar su ubicacion y detecte la ubicacion en tiempo real gracias al uso de Maps del telefono o navegador. 

---

## Validaciones aleatorias

Cada cierto tiempo:
- foto
- audio
- texto
- ubicacion en tiempo real

---

## Finalización

Guardar:
- duración de la sesión
- ejercicios 
- estadísticas