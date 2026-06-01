-- ====================================================================
-- SEED COMPLETO: 100 EJERCICIOS + 9 TEMPLATES GYM (FULL BODY/PPL/UL)
-- ====================================================================
-- PASO 1: Crear usuario de sistema para templates
INSERT INTO users (id, name, email, password, age, height, weight, imc, created_at)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'GymTracker System', 'system@gymtracker.local', 'system_user', 0, 0, 0, 0, NOW())
ON CONFLICT DO NOTHING;

-- PASO 2: Insertar los 9 templates
INSERT INTO routines (user_id, name, description, is_template, template_type, equipment_type, days_per_week, is_favorite, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Full Body - 3 Días', 'Entrenamiento completo en 3 sesiones', true, 'FULL_BODY', 'GYM', 3, false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440000', 'Full Body - 4 Días', 'Entrenamiento completo en 4 sesiones', true, 'FULL_BODY', 'GYM', 4, false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440000', 'Full Body - 5 Días', 'Entrenamiento completo en 5 sesiones', true, 'FULL_BODY', 'GYM', 5, false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440000', 'Push Pull Legs - 3 Días', 'PPL especializado en 3 sesiones', true, 'PPL', 'GYM', 3, false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440000', 'Push Pull Legs - 4 Días', 'PPL especializado en 4 sesiones', true, 'PPL', 'GYM', 4, false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440000', 'Push Pull Legs - 5 Días', 'PPL especializado en 5 sesiones', true, 'PPL', 'GYM', 5, false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440000', 'Upper Lower - 3 Días', 'División superior/inferior en 3 sesiones', true, 'UPPER_LOWER', 'GYM', 3, false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440000', 'Upper Lower - 4 Días', 'División superior/inferior en 4 sesiones', true, 'UPPER_LOWER', 'GYM', 4, false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440000', 'Upper Lower - 5 Días', 'División superior/inferior en 5 sesiones', true, 'UPPER_LOWER', 'GYM', 5, false, NOW(), NOW());

-- ====================================================================
-- FULL BODY 3 DÍAS
-- ====================================================================

-- LUNES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Sentadilla con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 2, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Press banca plano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 3, 4, 8, 150, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Remo con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 4, 3, 8, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Press militar sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 5, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Curl bíceps con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 6, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Extensión tríceps cuerda';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 7, 3, 15, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Crunch en polea';

-- MIÉRCOLES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 1, 4, 8, 150, 'Posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Peso muerto rumano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 2, 4, 8, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Dominadas asistidas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 3, 4, 8, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Press inclinado con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 4, 3, 10, 120, 'Piernas', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Prensa inclinada';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 5, 3, 12, 90, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Elevaciones laterales';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 6, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Curl martillo';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 7, 3, 45, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Plancha abdominal';

-- VIERNES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 1, 4, 8, 150, 'Piernas', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Hack squat';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 2, 4, 10, 120, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Jalón al pecho';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 3, 3, 10, 120, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Fondos en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 4, 3, 10, 120, 'Piernas', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Curl femoral acostado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 5, 3, 12, 90, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Face pull';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 6, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Extensión tríceps overhead';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 7, 3, 12, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 3 Días' AND e.name = 'Elevaciones de piernas';

-- ====================================================================
-- FULL BODY 4 DÍAS
-- ====================================================================

-- LUNES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Sentadilla con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 2, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Press banca plano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 3, 4, 8, 150, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Remo con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 4, 3, 8, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Press militar';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 5, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Curl bíceps barra EZ';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 6, 3, 15, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Crunch en polea';

-- MARTES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 1, 4, 8, 150, 'Posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Peso muerto rumano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 2, 4, 8, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Press inclinado con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 3, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Jalón al pecho';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 4, 3, 10, 120, 'Piernas', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Zancadas caminando';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 5, 3, 12, 90, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Elevaciones laterales';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 6, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Extensión tríceps cuerda';

-- JUEVES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 1, 4, 8, 150, 'Piernas', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Hack squat';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 2, 4, 8, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Fondos en paralelas asistidos';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 3, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Remo sentado en polea';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 4, 3, 10, 120, 'Piernas', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Curl femoral sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 5, 3, 12, 90, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Face pull';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 6, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Curl martillo';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 7, 3, 45, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Plancha abdominal';

-- VIERNES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 1, 4, 10, 150, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Prensa inclinada';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 2, 4, 10, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Press pecho en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 3, 4, 8, 180, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Dominadas asistidas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 4, 3, 10, 120, 'Glúteos', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Hip thrust';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 5, 3, 10, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Press Arnold';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 6, 3, 12, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Extensión tríceps unilateral';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 7, 3, 12, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 4 Días' AND e.name = 'Elevaciones de piernas';

-- ====================================================================
-- FULL BODY 5 DÍAS
-- ====================================================================

-- LUNES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Sentadilla con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 2, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Press banca plano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 3, 4, 8, 150, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Remo con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 4, 4, 12, 90, 'Pantorrillas', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Elevación de gemelos de pie';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 5, 3, 15, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Crunch abdominal';

-- MARTES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 1, 4, 8, 150, 'Posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Peso muerto rumano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 2, 4, 8, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Press inclinado con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 3, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Jalón al pecho';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 4, 3, 12, 90, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Elevaciones laterales';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 5, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Curl bíceps barra EZ';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 6, 3, 45, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Plancha abdominal';

-- MIÉRCOLES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 1, 4, 8, 150, 'Piernas', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Hack squat';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 2, 4, 10, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Fondos en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 3, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Remo sentado en polea';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 4, 3, 10, 120, 'Piernas', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Curl femoral acostado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 5, 3, 12, 90, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Face pull';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 6, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Extensión tríceps cuerda';

-- JUEVES
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 1, 4, 10, 150, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Prensa inclinada';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 2, 4, 8, 150, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Press militar sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 3, 4, 8, 180, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Dominadas asistidas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 4, 3, 10, 120, 'Glúteos', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Hip thrust';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 5, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Curl martillo';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 6, 3, 12, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Elevaciones de piernas';

-- SÁBADO
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 1, 3, 10, 120, 'Glúteos', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Sentadilla búlgara';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 2, 4, 10, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Press pecho en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 3, 4, 8, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Remo T-Bar';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 4, 3, 12, 120, 'Piernas', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Curl femoral sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 5, 3, 12, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Pájaros con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 6, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Extensión tríceps overhead';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 7, 3, 20, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Full Body - 5 Días' AND e.name = 'Russian twist';

-- ====================================================================
-- PPL 3 DÍAS
-- ====================================================================

-- LUNES - PUSH
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Press banca plano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 2, 4, 8, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Press inclinado con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 3, 4, 8, 150, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Press militar sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 4, 3, 12, 120, 'Hombros laterales', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Elevaciones laterales';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 5, 3, 10, 120, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Fondos en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 6, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Extensión tríceps cuerda';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 7, 3, 15, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Crunch en polea';

-- MIÉRCOLES - PULL
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 1, 4, 8, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Dominadas asistidas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 2, 4, 8, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Remo con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 3, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Jalón al pecho';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 4, 3, 10, 120, 'Espalda media', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Remo sentado en polea';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 5, 3, 12, 120, 'Hombros posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Face pull';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 6, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Curl bíceps barra EZ';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 7, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Curl martillo';

-- VIERNES - LEGS
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Sentadilla con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 2, 4, 8, 180, 'Posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Peso muerto rumano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 3, 4, 10, 150, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Prensa inclinada';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 4, 3, 10, 120, 'Isquiotibiales', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Curl femoral acostado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 5, 3, 12, 120, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Extensión de cuádriceps';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 6, 4, 12, 90, 'Pantorrillas', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Elevación de gemelos de pie';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 7, 3, 45, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 3 Días' AND e.name = 'Plancha abdominal';

-- ====================================================================
-- PPL 4 DÍAS
-- ====================================================================

-- LUNES - PUSH
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Press banca plano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 2, 4, 8, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Press inclinado con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 3, 4, 8, 150, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Press militar';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 4, 3, 12, 120, 'Hombros laterales', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Elevaciones laterales';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 5, 3, 10, 120, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Fondos en paralelas asistidos';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 6, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Extensión tríceps cuerda';

-- MARTES - PULL
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 1, 4, 8, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Dominadas asistidas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 2, 4, 8, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Remo con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 3, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Jalón agarre neutro';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 4, 3, 12, 120, 'Hombros posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Face pull';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 5, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Curl bíceps barra EZ';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 6, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Curl martillo';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 7, 3, 12, 90, 'Trapecio', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Encogimientos con mancuernas';

-- JUEVES - LEGS
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Sentadilla con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 2, 4, 8, 180, 'Posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Peso muerto rumano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 3, 4, 10, 150, 'Cuádriceps alterno', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Hack squat';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 4, 3, 10, 120, 'Isquiotibiales', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Curl femoral sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 5, 3, 12, 120, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Extensión de cuádriceps';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 6, 4, 12, 90, 'Pantorrillas', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Elevación de gemelos sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 7, 3, 15, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Crunch abdominal';

-- VIERNES - UPPER MIX
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 1, 4, 10, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Press pecho en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 2, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Remo sentado en polea';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 3, 3, 10, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Press Arnold';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 4, 3, 10, 120, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Jalón al pecho';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 5, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Curl alterno';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 6, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Extensión tríceps overhead';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 7, 3, 12, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 4 Días' AND e.name = 'Elevaciones de piernas';

-- ====================================================================
-- PPL 5 DÍAS
-- ====================================================================

-- LUNES - PUSH PESADO
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Press banca plano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 2, 4, 6, 180, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Press inclinado con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 3, 4, 8, 150, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Press militar sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 4, 3, 12, 120, 'Hombros laterales', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Elevaciones laterales';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 5, 3, 8, 120, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Fondos lastrados asistidos';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 6, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Extensión tríceps cuerda';

-- MARTES - PULL PESADO
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 1, 4, 8, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Dominadas asistidas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 2, 4, 8, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Remo con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 3, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Jalón al pecho';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 4, 3, 8, 150, 'Espalda media', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Remo T-Bar';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 5, 3, 12, 120, 'Hombros posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Face pull';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 6, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Curl bíceps barra EZ';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 7, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Curl martillo';

-- MIÉRCOLES - LEGS PESADO
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Sentadilla con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 2, 4, 8, 180, 'Posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Peso muerto rumano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 3, 4, 10, 150, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Prensa inclinada';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 4, 3, 10, 120, 'Isquiotibiales', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Curl femoral acostado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 5, 3, 12, 120, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Extensión de cuádriceps';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 6, 4, 12, 90, 'Pantorrillas', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Elevación de gemelos de pie';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 7, 3, 45, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Plancha abdominal';

-- VIERNES - PUSH HIPERTROFIA
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 1, 4, 10, 120, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Press pecho en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 2, 4, 10, 120, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Press inclinado con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 3, 3, 10, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Press Arnold';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 4, 3, 12, 120, 'Hombros laterales', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Elevaciones laterales en polea';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 5, 3, 12, 120, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Extensión tríceps unilateral';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 6, 3, 12, 120, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Fondos en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 7, 3, 15, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Crunch en polea';

-- SÁBADO - PULL HIPERTROFIA
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 1, 4, 10, 150, 'Espalda amplia', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Jalón agarre amplio';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 2, 4, 10, 150, 'Espalda media', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Remo sentado en polea';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 3, 3, 10, 120, 'Espalda unilateral', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Remo unilateral mancuerna';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 4, 3, 12, 120, 'Hombros posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Face pull';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 5, 3, 12, 120, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Curl alterno';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 6, 3, 12, 120, 'Bíceps concentrado', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Curl concentrado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 7, 3, 12, 90, 'Trapecio', NOW() FROM routines r, exercises e WHERE r.name = 'Push Pull Legs - 5 Días' AND e.name = 'Encogimientos con barra';

-- ====================================================================
-- UPPER/LOWER 3 DÍAS
-- ====================================================================

-- LUNES - UPPER
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Press banca plano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 2, 4, 8, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Remo con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 3, 3, 8, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Press inclinado con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 4, 3, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Jalón al pecho';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 5, 3, 8, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Press militar sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 6, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Curl bíceps barra EZ';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 7, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Extensión tríceps cuerda';

-- MIÉRCOLES - LOWER
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Sentadilla con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 2, 4, 8, 180, 'Posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Peso muerto rumano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 3, 4, 10, 150, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Prensa inclinada';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 4, 3, 10, 120, 'Isquiotibiales', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Curl femoral acostado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 5, 3, 12, 120, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Extensión de cuádriceps';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 6, 4, 12, 90, 'Pantorrillas', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Elevación de gemelos de pie';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 7, 3, 15, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Crunch abdominal';

-- VIERNES - UPPER
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 1, 4, 10, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Press pecho en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 2, 4, 8, 180, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Dominadas asistidas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 3, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Remo sentado en polea';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 4, 3, 12, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Elevaciones laterales';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 5, 3, 12, 120, 'Hombros posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Face pull';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 6, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Curl martillo';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 7, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 3 Días' AND e.name = 'Extensión tríceps overhead';

-- ====================================================================
-- UPPER/LOWER 4 DÍAS
-- ====================================================================

-- LUNES - UPPER
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Press banca plano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 2, 4, 8, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Remo con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 3, 4, 8, 150, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Press militar sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 4, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Jalón al pecho';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 5, 3, 10, 120, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Curl bíceps barra EZ';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 6, 3, 10, 120, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Extensión tríceps cuerda';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 7, 3, 12, 90, 'Hombros posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Face pull';

-- MARTES - LOWER
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Sentadilla con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 2, 4, 8, 180, 'Posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Peso muerto rumano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 3, 4, 10, 150, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Prensa inclinada';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 4, 3, 10, 120, 'Isquiotibiales', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Curl femoral sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 5, 3, 12, 120, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Extensión de cuádriceps';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 6, 4, 12, 90, 'Pantorrillas', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Elevación de gemelos sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 7, 3, 45, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Plancha abdominal';

-- JUEVES - UPPER
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 1, 4, 8, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Press inclinado con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 2, 4, 8, 180, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Dominadas asistidas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 3, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Remo sentado en polea';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 4, 3, 10, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Press Arnold';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 5, 3, 12, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Elevaciones laterales';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 6, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Curl martillo';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 4, 7, 3, 12, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Extensión tríceps unilateral';

-- VIERNES - LOWER
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 1, 4, 8, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Hack squat';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 2, 4, 10, 150, 'Glúteos', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Hip thrust';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 3, 3, 10, 120, 'Isquiotibiales', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Curl femoral acostado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 4, 3, 10, 120, 'Glúteos', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Sentadilla búlgara';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 5, 3, 12, 120, 'Aductores', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Aductores en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 6, 4, 12, 90, 'Pantorrillas', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Elevación de gemelos de pie';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 7, 3, 12, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 4 Días' AND e.name = 'Elevaciones de piernas';

-- ====================================================================
-- UPPER/LOWER 5 DÍAS
-- ====================================================================

-- LUNES - UPPER PESADO
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Press banca plano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 2, 4, 8, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Remo con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 3, 4, 8, 150, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Press militar sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 4, 4, 8, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Dominadas asistidas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 5, 3, 10, 120, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Curl bíceps barra EZ';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 1, 6, 3, 10, 120, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Extensión tríceps cuerda';

-- MARTES - LOWER PESADO
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 1, 4, 6, 180, 'Principal', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Sentadilla con barra';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 2, 4, 8, 180, 'Posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Peso muerto rumano';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 3, 4, 10, 150, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Prensa inclinada';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 4, 3, 10, 120, 'Isquiotibiales', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Curl femoral acostado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 5, 3, 12, 120, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Extensión de cuádriceps';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 6, 4, 12, 90, 'Pantorrillas', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Elevación de gemelos sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 2, 7, 3, 15, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Crunch abdominal';

-- MIÉRCOLES - UPPER HIPERTROFIA
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 1, 4, 10, 120, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Press inclinado con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 2, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Jalón al pecho';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 3, 4, 10, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Remo sentado en polea';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 4, 3, 12, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Elevaciones laterales';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 5, 3, 12, 120, 'Hombros posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Face pull';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 6, 3, 10, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Curl martillo';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 3, 7, 3, 10, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Extensión tríceps overhead';

-- VIERNES - LOWER HIPERTROFIA
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 1, 4, 10, 150, 'Cuádriceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Hack squat';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 2, 4, 10, 150, 'Glúteos', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Hip thrust';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 3, 3, 12, 120, 'Isquiotibiales', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Curl femoral sentado';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 4, 3, 10, 120, 'Glúteos', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Sentadilla búlgara';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 5, 3, 12, 120, 'Abductores', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Abductores en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 6, 4, 15, 90, 'Pantorrillas', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Elevación de gemelos de pie';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 5, 7, 3, 45, 60, 'Core', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Plancha abdominal';

-- SÁBADO - UPPER MIX
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 1, 4, 10, 150, 'Pecho', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Press pecho en máquina';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 2, 4, 8, 150, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Remo T-Bar';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 3, 3, 10, 120, 'Hombros', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Press Arnold';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 4, 3, 10, 120, 'Espalda', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Jalón agarre neutro';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 5, 3, 12, 120, 'Hombros posterior', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Pájaros con mancuernas';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 6, 3, 12, 90, 'Bíceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Curl alterno';
INSERT INTO routine_exercises (routine_id, exercise_id, day_number, order_index, target_sets, target_reps, rest_seconds, notes, created_at) SELECT r.id, e.id, 6, 7, 3, 12, 90, 'Tríceps', NOW() FROM routines r, exercises e WHERE r.name = 'Upper Lower - 5 Días' AND e.name = 'Fondos en máquina';

-- ====================================================================
-- VERIFICACIÓN FINAL
-- ====================================================================
SELECT 
  COUNT(*) as total_templates,
  COUNT(DISTINCT user_id) as system_users
FROM routines 
WHERE is_template = true;

SELECT 
  COUNT(*) as total_routine_exercises
FROM routine_exercises;

SELECT 
  template_type,
  days_per_week,
  COUNT(*) as ejercicios_count
FROM routine_exercises re
JOIN routines r ON r.id = re.routine_id
WHERE r.is_template = true
GROUP BY r.template_type, r.days_per_week
ORDER BY r.template_type, r.days_per_week;
