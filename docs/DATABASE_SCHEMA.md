Esta es la base de datos en Supabase que se tienen hasta el momento. Puede aumentar o no. Faltan más registros. 

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  muscle_group text NOT NULL,
  submuscles ARRAY DEFAULT '{}'::text[],
  equipment text NOT NULL,
  description text,
  difficulty text CHECK (difficulty = ANY (ARRAY['Principiante'::text, 'Intermedio'::text, 'Avanzado'::text])),
  image_url text,
  is_home boolean DEFAULT false,
  is_gym boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT exercises_pkey PRIMARY KEY (id)
);
CREATE TABLE public.routine_exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  routine_id uuid NOT NULL,
  exercise_id uuid NOT NULL,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 7),
  order_index integer DEFAULT 0,
  target_sets integer DEFAULT 3,
  target_reps integer DEFAULT 10,
  rest_seconds integer DEFAULT 90,
  notes text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT routine_exercises_pkey PRIMARY KEY (id),
  CONSTRAINT routine_exercises_routine_id_fkey FOREIGN KEY (routine_id) REFERENCES public.routines(id),
  CONSTRAINT routine_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id)
);
CREATE TABLE public.routines (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  is_template boolean DEFAULT false,
  template_type text CHECK (template_type = ANY (ARRAY['FULL_BODY'::text, 'PPL'::text, 'UPPER_LOWER'::text])),
  equipment_type text CHECK (equipment_type = ANY (ARRAY['GYM'::text, 'DUMBBELLS'::text, 'CABLES'::text, 'BODYWEIGHT'::text])),
  days_per_week integer CHECK (days_per_week >= 3 AND days_per_week <= 5),
  is_favorite boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT routines_pkey PRIMARY KEY (id),
  CONSTRAINT routines_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.session_exercise_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  exercise_id uuid NOT NULL,
  performed_sets integer,
  performed_reps integer,
  performed_weight_kg numeric,
  notes text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT session_exercise_logs_pkey PRIMARY KEY (id),
  CONSTRAINT session_exercise_logs_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.workout_sessions(id),
  CONSTRAINT session_exercise_logs_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id)
);
CREATE TABLE public.user_validations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id uuid,
  validation_type text CHECK (validation_type = ANY (ARRAY['PHOTO'::text, 'AUDIO'::text, 'TEXT'::text])),
  file_url text,
  response_text text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_validations_pkey PRIMARY KEY (id),
  CONSTRAINT user_validations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_validations_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.workout_sessions(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  age integer,
  height numeric,
  weight numeric,
  imc numeric,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.workout_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  routine_id uuid,
  started_at timestamp without time zone,
  finished_at timestamp without time zone,
  duration_seconds integer,
  status text DEFAULT 'IN_PROGRESS'::text CHECK (status = ANY (ARRAY['IN_PROGRESS'::text, 'COMPLETED'::text, 'CANCELLED'::text])),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT workout_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT workout_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT workout_sessions_routine_id_fkey FOREIGN KEY (routine_id) REFERENCES public.routines(id)
);

Inserts:
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


------

-- Seed Exercises para GymTracker PWA (100 ejercicios)

INSERT INTO exercises (name, muscle_group, submuscles, equipment, description, difficulty, image_url, is_home, is_gym, created_at) VALUES

-- PIERNAS (1-20)
('Sentadilla con barra', 'Piernas', ARRAY['Cuádriceps', 'Glúteos'], 'Barra', 'Sentadilla profunda controlada', 'Intermedio', '/images/exercises/sentadilla-barra.jpg', false, true, NOW()),
('Sentadilla goblet', 'Piernas', ARRAY['Cuádriceps', 'Glúteos'], 'Mancuerna', 'Sentadilla sosteniendo mancuerna', 'Principiante', '/images/exercises/goblet-squat.jpg', true, true, NOW()),
('Hack squat', 'Piernas', ARRAY['Cuádriceps'], 'Máquina', 'Sentadilla guiada inclinada', 'Intermedio', '/images/exercises/hack-squat.jpg', false, true, NOW()),
('Prensa inclinada', 'Piernas', ARRAY['Cuádriceps', 'Glúteos'], 'Máquina', 'Empuje de piernas en plataforma', 'Principiante', '/images/exercises/leg-press.jpg', false, true, NOW()),
('Peso muerto rumano', 'Piernas', ARRAY['Isquiotibiales', 'Glúteos'], 'Barra', 'Bisagra de cadera controlada', 'Intermedio', '/images/exercises/rdl.jpg', true, true, NOW()),
('Peso muerto convencional', 'Espalda', ARRAY['Espalda baja', 'Glúteos'], 'Barra', 'Levantamiento desde el suelo', 'Avanzado', '/images/exercises/deadlift.jpg', false, true, NOW()),
('Curl femoral acostado', 'Piernas', ARRAY['Isquiotibiales'], 'Máquina', 'Flexión de rodillas acostado', 'Principiante', '/images/exercises/leg-curl.jpg', false, true, NOW()),
('Curl femoral sentado', 'Piernas', ARRAY['Isquiotibiales'], 'Máquina', 'Flexión sentado en máquina', 'Principiante', '/images/exercises/seated-leg-curl.jpg', false, true, NOW()),
('Extensión de cuádriceps', 'Piernas', ARRAY['Cuádriceps'], 'Máquina', 'Extensión de rodillas sentado', 'Principiante', '/images/exercises/leg-extension.jpg', false, true, NOW()),
('Hip thrust', 'Piernas', ARRAY['Glúteos'], 'Barra', 'Empuje de cadera elevado', 'Intermedio', '/images/exercises/hip-thrust.jpg', true, true, NOW()),
('Sentadilla búlgara', 'Piernas', ARRAY['Cuádriceps', 'Glúteos'], 'Mancuernas', 'Sentadilla unilateral elevada', 'Intermedio', '/images/exercises/bulgarian-squat.jpg', true, true, NOW()),
('Zancadas caminando', 'Piernas', ARRAY['Cuádriceps', 'Glúteos'], 'Mancuernas', 'Pasos largos con carga', 'Intermedio', '/images/exercises/walking-lunges.jpg', true, true, NOW()),
('Step up', 'Piernas', ARRAY['Cuádriceps', 'Glúteos'], 'Mancuernas', 'Subida a banco controlada', 'Principiante', '/images/exercises/step-up.jpg', true, true, NOW()),
('Elevación de gemelos de pie', 'Piernas', ARRAY['Pantorrillas'], 'Máquina', 'Elevación de talones de pie', 'Principiante', '/images/exercises/calf-raise.jpg', false, true, NOW()),
('Elevación de gemelos sentado', 'Piernas', ARRAY['Pantorrillas'], 'Máquina', 'Elevación sentado con carga', 'Principiante', '/images/exercises/seated-calf-raise.jpg', false, true, NOW()),
('Aductores en máquina', 'Piernas', ARRAY['Aductores'], 'Máquina', 'Cierre de piernas controlado', 'Principiante', '/images/exercises/adductors.jpg', false, true, NOW()),
('Abductores en máquina', 'Piernas', ARRAY['Abductores'], 'Máquina', 'Apertura de piernas controlada', 'Principiante', '/images/exercises/abductors.jpg', false, true, NOW()),
('Pistol squat asistida', 'Piernas', ARRAY['Cuádriceps', 'Core'], 'Peso corporal', 'Sentadilla unilateral asistida', 'Avanzado', '/images/exercises/pistol-squat.jpg', true, true, NOW()),
('Puente de glúteo', 'Piernas', ARRAY['Glúteos'], 'Peso corporal', 'Elevación de cadera en suelo', 'Principiante', '/images/exercises/glute-bridge.jpg', true, true, NOW()),
('Saltos al cajón', 'Piernas', ARRAY['Cuádriceps', 'Glúteos'], 'Caja', 'Salto explosivo al cajón', 'Intermedio', '/images/exercises/box-jump.jpg', true, true, NOW()),

-- PECHO (21-35)
('Press banca plano', 'Pecho', ARRAY['Pecho medio', 'Tríceps'], 'Barra', 'Empuje horizontal clásico', 'Intermedio', '/images/exercises/bench-press.jpg', false, true, NOW()),
('Press inclinado con barra', 'Pecho', ARRAY['Pecho superior'], 'Barra', 'Press en banco inclinado', 'Intermedio', '/images/exercises/incline-bench.jpg', false, true, NOW()),
('Press inclinado con mancuernas', 'Pecho', ARRAY['Pecho superior'], 'Mancuernas', 'Press inclinado unilateral', 'Intermedio', '/images/exercises/incline-db-press.jpg', true, true, NOW()),
('Press pecho en máquina', 'Pecho', ARRAY['Pecho medio'], 'Máquina', 'Empuje guiado en máquina', 'Principiante', '/images/exercises/chest-press.jpg', false, true, NOW()),
('Fondos en paralelas', 'Pecho', ARRAY['Pecho inferior', 'Tríceps'], 'Peso corporal', 'Descenso entre barras', 'Intermedio', '/images/exercises/dips.jpg', true, true, NOW()),
('Fondos en máquina', 'Pecho', ARRAY['Pecho inferior'], 'Máquina', 'Fondos asistidos guiados', 'Principiante', '/images/exercises/assisted-dips.jpg', false, true, NOW()),
('Flexiones tradicionales', 'Pecho', ARRAY['Pecho medio'], 'Peso corporal', 'Empuje corporal en suelo', 'Principiante', '/images/exercises/pushups.jpg', true, true, NOW()),
('Flexiones diamante', 'Brazos', ARRAY['Tríceps', 'Pecho interno'], 'Peso corporal', 'Flexión con manos cerradas', 'Intermedio', '/images/exercises/diamond-pushups.jpg', true, true, NOW()),
('Flexiones inclinadas', 'Pecho', ARRAY['Pecho inferior'], 'Peso corporal', 'Flexión apoyado en banco', 'Principiante', '/images/exercises/incline-pushups.jpg', true, true, NOW()),
('Flexiones declinadas', 'Pecho', ARRAY['Pecho superior'], 'Peso corporal', 'Flexión con pies elevados', 'Intermedio', '/images/exercises/decline-pushups.jpg', true, true, NOW()),
('Aperturas con mancuernas', 'Pecho', ARRAY['Pecho medio'], 'Mancuernas', 'Apertura controlada en banco', 'Intermedio', '/images/exercises/db-flyes.jpg', true, true, NOW()),
('Aperturas en cable', 'Pecho', ARRAY['Pecho medio'], 'Cable', 'Cruce de poleas controlado', 'Intermedio', '/images/exercises/cable-flyes.jpg', false, true, NOW()),
('Chest press cable', 'Pecho', ARRAY['Pecho medio'], 'Cable', 'Empuje frontal en polea', 'Principiante', '/images/exercises/cable-press.jpg', false, true, NOW()),
('Pullover con mancuerna', 'Espalda', ARRAY['Dorsales', 'Pecho'], 'Mancuerna', 'Apertura sobre cabeza', 'Intermedio', '/images/exercises/db-pullover.jpg', true, true, NOW()),
('Pullover en polea', 'Espalda', ARRAY['Dorsales'], 'Cable', 'Jalón extendido al torso', 'Intermedio', '/images/exercises/cable-pullover.jpg', false, true, NOW()),

-- ESPALDA (36-50)
('Dominadas', 'Espalda', ARRAY['Dorsales', 'Bíceps'], 'Peso corporal', 'Jalón corporal en barra', 'Avanzado', '/images/exercises/pullups.jpg', true, true, NOW()),
('Dominadas asistidas', 'Espalda', ARRAY['Dorsales'], 'Máquina', 'Dominada con asistencia', 'Intermedio', '/images/exercises/assisted-pullups.jpg', false, true, NOW()),
('Jalón al pecho', 'Espalda', ARRAY['Dorsales'], 'Cable', 'Jalón vertical controlado', 'Principiante', '/images/exercises/lat-pulldown.jpg', false, true, NOW()),
('Jalón agarre neutro', 'Espalda', ARRAY['Dorsales', 'Romboides'], 'Cable', 'Jalón con agarre cerrado', 'Principiante', '/images/exercises/neutral-grip-pulldown.jpg', false, true, NOW()),
('Remo con barra', 'Espalda', ARRAY['Dorsales', 'Romboides'], 'Barra', 'Remo inclinado pesado', 'Intermedio', '/images/exercises/barbell-row.jpg', false, true, NOW()),
('Remo sentado en polea', 'Espalda', ARRAY['Dorsales', 'Trapecio'], 'Cable', 'Remo horizontal sentado', 'Principiante', '/images/exercises/seated-row.jpg', false, true, NOW()),
('Remo unilateral mancuerna', 'Espalda', ARRAY['Dorsales'], 'Mancuerna', 'Remo a una mano', 'Principiante', '/images/exercises/db-row.jpg', true, true, NOW()),
('Remo T-Bar', 'Espalda', ARRAY['Trapecio', 'Dorsales'], 'Máquina', 'Remo en barra T', 'Intermedio', '/images/exercises/tbar-row.jpg', false, true, NOW()),
('Remo invertido', 'Espalda', ARRAY['Dorsales', 'Bíceps'], 'Peso corporal', 'Remo suspendido corporal', 'Intermedio', '/images/exercises/inverted-row.jpg', true, true, NOW()),
('Face pull', 'Hombros', ARRAY['Deltoide posterior'], 'Cable', 'Jalón hacia la cara', 'Principiante', '/images/exercises/face-pull.jpg', false, true, NOW()),
('Encogimientos con barra', 'Espalda', ARRAY['Trapecio'], 'Barra', 'Elevación de hombros', 'Principiante', '/images/exercises/barbell-shrugs.jpg', false, true, NOW()),
('Encogimientos con mancuernas', 'Espalda', ARRAY['Trapecio'], 'Mancuernas', 'Elevación lateral de hombros', 'Principiante', '/images/exercises/db-shrugs.jpg', true, true, NOW()),
('Superman', 'Core', ARRAY['Lumbar'], 'Peso corporal', 'Extensión lumbar en suelo', 'Principiante', '/images/exercises/superman.jpg', true, true, NOW()),
('Buenos días', 'Espalda', ARRAY['Espalda baja', 'Glúteos'], 'Barra', 'Flexión de torso controlada', 'Intermedio', '/images/exercises/good-morning.jpg', false, true, NOW()),
('Peso muerto sumo', 'Piernas', ARRAY['Glúteos', 'Aductores'], 'Barra', 'Peso muerto con postura amplia', 'Intermedio', '/images/exercises/sumo-deadlift.jpg', false, true, NOW()),

-- HOMBROS (51-60)
('Press militar', 'Hombros', ARRAY['Deltoide anterior'], 'Barra', 'Empuje vertical de hombros', 'Intermedio', '/images/exercises/military-press.jpg', false, true, NOW()),
('Press militar sentado', 'Hombros', ARRAY['Deltoide anterior'], 'Mancuernas', 'Press sentado controlado', 'Principiante', '/images/exercises/seated-press.jpg', true, true, NOW()),
('Press Arnold', 'Hombros', ARRAY['Deltoides completos'], 'Mancuernas', 'Rotación y press de hombros', 'Intermedio', '/images/exercises/arnold-press.jpg', true, true, NOW()),
('Elevaciones laterales', 'Hombros', ARRAY['Deltoide lateral'], 'Mancuernas', 'Elevación lateral controlada', 'Principiante', '/images/exercises/lateral-raise.jpg', true, true, NOW()),
('Elevaciones laterales en polea', 'Hombros', ARRAY['Deltoide lateral'], 'Cable', 'Elevación unilateral en polea', 'Intermedio', '/images/exercises/cable-lateral-raise.jpg', false, true, NOW()),
('Pájaros con mancuernas', 'Hombros', ARRAY['Deltoide posterior'], 'Mancuernas', 'Apertura inclinada posterior', 'Principiante', '/images/exercises/db-flye-rear.jpg', true, true, NOW()),
('Reverse fly en máquina', 'Hombros', ARRAY['Deltoide posterior'], 'Máquina', 'Apertura posterior guiada', 'Principiante', '/images/exercises/reverse-flye.jpg', false, true, NOW()),
('Pike push up', 'Hombros', ARRAY['Deltoide anterior'], 'Peso corporal', 'Flexión vertical corporal', 'Intermedio', '/images/exercises/pike-pushup.jpg', true, true, NOW()),
('Handstand push up asistida', 'Hombros', ARRAY['Hombros', 'Tríceps'], 'Peso corporal', 'Flexión invertida asistida', 'Avanzado', '/images/exercises/handstand-pushup.jpg', true, true, NOW()),
('Elevaciones frontales', 'Hombros', ARRAY['Deltoide anterior'], 'Mancuernas', 'Elevación frontal controlada', 'Principiante', '/images/exercises/front-raise.jpg', true, true, NOW()),

-- BRAZOS (61-78)
('Curl bíceps con barra', 'Brazos', ARRAY['Bíceps'], 'Barra', 'Curl clásico de pie', 'Principiante', '/images/exercises/barbell-curl.jpg', false, true, NOW()),
('Curl bíceps barra EZ', 'Brazos', ARRAY['Bíceps'], 'Barra EZ', 'Curl con agarre cómodo', 'Principiante', '/images/exercises/ez-curl.jpg', false, true, NOW()),
('Curl alterno', 'Brazos', ARRAY['Bíceps'], 'Mancuernas', 'Curl alternando brazos', 'Principiante', '/images/exercises/db-curl.jpg', true, true, NOW()),
('Curl martillo', 'Brazos', ARRAY['Bíceps', 'Antebrazo'], 'Mancuernas', 'Curl con agarre neutro', 'Principiante', '/images/exercises/hammer-curl.jpg', true, true, NOW()),
('Curl concentrado', 'Brazos', ARRAY['Bíceps'], 'Mancuerna', 'Curl apoyado unilateral', 'Intermedio', '/images/exercises/concentration-curl.jpg', true, true, NOW()),
('Curl predicador', 'Brazos', ARRAY['Bíceps'], 'Máquina', 'Curl apoyado en banco', 'Principiante', '/images/exercises/preacher-curl.jpg', false, true, NOW()),
('Curl en polea', 'Brazos', ARRAY['Bíceps'], 'Cable', 'Curl continuo en polea', 'Principiante', '/images/exercises/cable-curl.jpg', false, true, NOW()),
('Curl inverso', 'Brazos', ARRAY['Antebrazos'], 'Barra', 'Curl con agarre prono', 'Intermedio', '/images/exercises/reverse-curl.jpg', true, true, NOW()),
('Wrist curl', 'Brazos', ARRAY['Antebrazos'], 'Barra', 'Flexión de muñecas', 'Principiante', '/images/exercises/wrist-curl.jpg', true, true, NOW()),
('Dominada supina', 'Brazos', ARRAY['Bíceps', 'Dorsales'], 'Peso corporal', 'Dominada agarre supino', 'Intermedio', '/images/exercises/chin-up.jpg', true, true, NOW()),
('Extensión tríceps cuerda', 'Brazos', ARRAY['Tríceps'], 'Cable', 'Extensión con cuerda', 'Principiante', '/images/exercises/rope-extension.jpg', false, true, NOW()),
('Extensión tríceps overhead', 'Brazos', ARRAY['Tríceps'], 'Mancuerna', 'Extensión sobre cabeza', 'Principiante', '/images/exercises/overhead-extension.jpg', true, true, NOW()),
('Fondos en banco', 'Brazos', ARRAY['Tríceps'], 'Peso corporal', 'Descenso apoyado en banco', 'Principiante', '/images/exercises/bench-dips.jpg', true, true, NOW()),
('Press francés', 'Brazos', ARRAY['Tríceps'], 'Barra EZ', 'Extensión acostado', 'Intermedio', '/images/exercises/french-press.jpg', true, true, NOW()),
('Patada de tríceps', 'Brazos', ARRAY['Tríceps'], 'Mancuerna', 'Extensión posterior unilateral', 'Principiante', '/images/exercises/kickback.jpg', true, true, NOW()),
('Extensión unilateral cable', 'Brazos', ARRAY['Tríceps'], 'Cable', 'Extensión individual en polea', 'Principiante', '/images/exercises/single-cable-extension.jpg', false, true, NOW()),
('Flexiones cerradas', 'Brazos', ARRAY['Tríceps'], 'Peso corporal', 'Flexión enfocada en tríceps', 'Intermedio', '/images/exercises/close-grip-pushups.jpg', true, true, NOW()),
('Rompecráneos', 'Brazos', ARRAY['Tríceps'], 'Barra EZ', 'Extensión acostado pesada', 'Intermedio', '/images/exercises/skull-crushers.jpg', true, true, NOW()),

-- CORE (79-90)
('Plancha abdominal', 'Core', ARRAY['Core profundo'], 'Peso corporal', 'Mantener cuerpo estable', 'Principiante', '/images/exercises/plank.jpg', true, true, NOW()),
('Crunch abdominal', 'Core', ARRAY['Abdominales'], 'Peso corporal', 'Flexión abdominal básica', 'Principiante', '/images/exercises/crunch.jpg', true, true, NOW()),
('Crunch en polea', 'Core', ARRAY['Abdominales'], 'Cable', 'Flexión con resistencia', 'Principiante', '/images/exercises/cable-crunch.jpg', false, true, NOW()),
('Elevaciones de piernas', 'Core', ARRAY['Abdominales inferiores'], 'Peso corporal', 'Elevación de piernas controlada', 'Intermedio', '/images/exercises/leg-raises.jpg', true, true, NOW()),
('Russian twist', 'Core', ARRAY['Oblicuos'], 'Peso corporal', 'Giro de torso sentado', 'Principiante', '/images/exercises/russian-twist.jpg', true, true, NOW()),
('Mountain climbers', 'Core', ARRAY['Core', 'Cardio'], 'Peso corporal', 'Rodillas rápidas al pecho', 'Principiante', '/images/exercises/mountain-climbers.jpg', true, true, NOW()),
('Hollow hold', 'Core', ARRAY['Core profundo'], 'Peso corporal', 'Posición abdominal estática', 'Intermedio', '/images/exercises/hollow-hold.jpg', true, true, NOW()),
('Bird dog', 'Core', ARRAY['Lumbar', 'Core'], 'Peso corporal', 'Extensión alterna controlada', 'Principiante', '/images/exercises/bird-dog.jpg', true, true, NOW()),
('Side plank', 'Core', ARRAY['Oblicuos'], 'Peso corporal', 'Plancha lateral estática', 'Principiante', '/images/exercises/side-plank.jpg', true, true, NOW()),
('Toques al talón', 'Core', ARRAY['Oblicuos'], 'Peso corporal', 'Flexión lateral abdominal', 'Principiante', '/images/exercises/heel-touches.jpg', true, true, NOW()),
('Cable woodchopper', 'Core', ARRAY['Oblicuos'], 'Cable', 'Giro diagonal en polea', 'Intermedio', '/images/exercises/woodchopper.jpg', false, true, NOW()),
('Ab wheel rollout', 'Core', ARRAY['Core profundo'], 'Rueda abdominal', 'Extensión abdominal avanzada', 'Avanzado', '/images/exercises/ab-wheel.jpg', true, true, NOW()),

-- CARDIO & FULL BODY (91-100)
('Battle ropes', 'Cardio', ARRAY['Hombros', 'Core'], 'Cuerdas', 'Ondas explosivas con cuerdas', 'Intermedio', '/images/exercises/battle-ropes.jpg', false, true, NOW()),
('Burpees', 'Cardio', ARRAY['Cuerpo completo'], 'Peso corporal', 'Salto y flexión continua', 'Intermedio', '/images/exercises/burpees.jpg', true, true, NOW()),
('Jumping jacks', 'Cardio', ARRAY['Cuerpo completo'], 'Peso corporal', 'Saltos coordinados', 'Principiante', '/images/exercises/jumping-jacks.jpg', true, true, NOW()),
('Farmer walk', 'Brazos', ARRAY['Antebrazos', 'Trapecio'], 'Mancuernas', 'Caminata con carga', 'Intermedio', '/images/exercises/farmer-walk.jpg', true, true, NOW()),
('Sprints en cinta', 'Cardio', ARRAY['Piernas'], 'Caminadora', 'Carrera intensa corta', 'Intermedio', '/images/exercises/sprints.jpg', false, true, NOW()),
('Kettlebell swing', 'Piernas', ARRAY['Glúteos', 'Lumbar'], 'Kettlebell', 'Balanceo explosivo', 'Intermedio', '/images/exercises/kettlebell-swing.jpg', true, true, NOW()),
('Thrusters con mancuernas', 'Cuerpo completo', ARRAY['Piernas', 'Hombros'], 'Mancuernas', 'Sentadilla y press combinado', 'Intermedio', '/images/exercises/dumbbell-thrusters.jpg', true, true, NOW()),
('Clean and press', 'Cuerpo completo', ARRAY['Hombros', 'Piernas'], 'Barra', 'Levantamiento y press', 'Avanzado', '/images/exercises/clean-press.jpg', false, true, NOW()),
('Renegade row', 'Espalda', ARRAY['Core', 'Dorsales'], 'Mancuernas', 'Remo en posición de plancha', 'Intermedio', '/images/exercises/renegade-row.jpg', true, true, NOW()),
('Bear crawl', 'Core', ARRAY['Core', 'Hombros'], 'Peso corporal', 'Desplazamiento cuadrúpedo', 'Intermedio', '/images/exercises/bear-crawl.jpg', true, true, NOW());

SELECT COUNT(*) as total_exercises FROM exercises;
