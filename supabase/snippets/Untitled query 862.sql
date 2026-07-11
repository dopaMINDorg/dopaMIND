create table public."Preferences" (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  activity text not null,
  time_hours smallint null default 0,
  time_minutes smallint not null,
  user_id uuid null,
  constraint Preferences_pkey primary key (id)
);