-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS public.workout_plans CASCADE;
DROP TABLE IF EXISTS public.nutrition_plans CASCADE;
DROP TABLE IF EXISTS public.fitness_data CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT
);

-- Create fitness_data table
CREATE TABLE IF NOT EXISTS public.fitness_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  height_inches NUMERIC NOT NULL,
  weight NUMERIC NOT NULL,
  fitness_goal TEXT NOT NULL,
  available_time TEXT NOT NULL,
  dietary_restrictions TEXT,
  dietary_preferences TEXT
);

-- Create nutrition_plans table
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  fitness_data_id UUID REFERENCES public.fitness_data ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  plan_content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Create workout_plans table
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  fitness_data_id UUID REFERENCES public.fitness_data ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  plan_content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view their own fitness data" ON public.fitness_data;
DROP POLICY IF EXISTS "Users can update their own fitness data" ON public.fitness_data;
DROP POLICY IF EXISTS "Users can insert their own fitness data" ON public.fitness_data;

DROP POLICY IF EXISTS "Users can view their own nutrition plans" ON public.nutrition_plans;
DROP POLICY IF EXISTS "Users can update their own nutrition plans" ON public.nutrition_plans;
DROP POLICY IF EXISTS "Users can insert their own nutrition plans" ON public.nutrition_plans;

DROP POLICY IF EXISTS "Users can view their own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can update their own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can insert their own workout plans" ON public.workout_plans;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create policies for fitness_data
CREATE POLICY "Users can view their own fitness data"
ON public.fitness_data FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own fitness data"
ON public.fitness_data FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fitness data"
ON public.fitness_data FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policies for nutrition_plans
CREATE POLICY "Users can view their own nutrition plans"
ON public.nutrition_plans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition plans"
ON public.nutrition_plans FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition plans"
ON public.nutrition_plans FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policies for workout_plans
CREATE POLICY "Users can view their own workout plans"
ON public.workout_plans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans"
ON public.workout_plans FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout plans"
ON public.workout_plans FOR INSERT
WITH CHECK (auth.uid() = user_id); 