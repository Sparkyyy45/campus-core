-- ============================================================
-- CampusCore MVP: Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- ENUMS
-- ────────────────────────────────────────────────────────────
create type user_role as enum ('STUDENT', 'ADMIN');
create type resource_status as enum ('DRAFT', 'PUBLISHED');

-- ────────────────────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ────────────────────────────────────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text not null,
  email        text not null,
  roll_no      text not null unique,
  branch_code  text not null,
  semester     smallint not null check (semester between 1 and 8),
  year         smallint not null,
  role         user_role not null default 'STUDENT',
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-create profile on signup via auth metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Only auto-create profile if roll_no is provided in user metadata (i.e. via standard signup form)
  -- Google OAuth users will not have roll_no, so they bypass this and are routed to /onboarding
  if new.raw_user_meta_data->>'roll_no' is not null and new.raw_user_meta_data->>'roll_no' != '' then
    insert into public.profiles (id, full_name, email, roll_no, branch_code, semester, year)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', ''),
      new.email,
      lower(new.raw_user_meta_data->>'roll_no'),
      lower(new.raw_user_meta_data->>'branch_code'),
      coalesce((new.raw_user_meta_data->>'semester')::smallint, 1),
      coalesce((new.raw_user_meta_data->>'year')::smallint, extract(year from now())::smallint)
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ────────────────────────────────────────────────────────────
-- SUBJECTS
-- ────────────────────────────────────────────────────────────
create table public.subjects (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  branch_code  text not null,
  semester     smallint not null check (semester between 1 and 8),
  created_at   timestamptz not null default now(),
  unique(name, branch_code, semester)
);

-- ────────────────────────────────────────────────────────────
-- RESOURCE TYPES
-- ────────────────────────────────────────────────────────────
create table public.resource_types (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  is_pyq     boolean not null default false,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed defaults
insert into public.resource_types (name, is_pyq, is_active) values
  ('Notes', false, true),
  ('PYQ', true, true),
  ('Other', false, true);

-- ────────────────────────────────────────────────────────────
-- RESOURCES
-- ────────────────────────────────────────────────────────────
create table public.resources (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  description           text,
  cloudinary_public_id  text not null unique,
  cloudinary_url        text not null,
  file_size_bytes       bigint,
  subject_id            uuid not null references public.subjects(id) on delete restrict,
  resource_type_id      uuid not null references public.resource_types(id) on delete restrict,
  branch_code           text not null,
  semester              smallint not null check (semester between 1 and 8),
  exam_year             smallint,
  status                resource_status not null default 'PUBLISHED',
  uploader_id           uuid not null references public.profiles(id) on delete restrict,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger resources_updated_at
  before update on public.resources
  for each row execute procedure public.set_updated_at();

create index resources_branch_semester_idx on public.resources(branch_code, semester);
create index resources_type_idx on public.resources(resource_type_id);

-- ────────────────────────────────────────────────────────────
-- ANNOUNCEMENTS
-- ────────────────────────────────────────────────────────────
create table public.announcements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,
  is_pinned   boolean not null default false,
  created_by  uuid not null references public.profiles(id) on delete restrict,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger announcements_updated_at
  before update on public.announcements
  for each row execute procedure public.set_updated_at();

create index announcements_pinned_idx on public.announcements(is_pinned, created_at desc);

-- ────────────────────────────────────────────────────────────
-- ROADMAPS
-- ────────────────────────────────────────────────────────────
create table public.roadmaps (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  branch_code  text not null,
  semester     smallint not null check (semester between 1 and 8),
  order_idx    integer not null,
  created_at   timestamptz not null default now()
);

create index roadmaps_branch_semester_idx on public.roadmaps(branch_code, semester, order_idx);

-- ────────────────────────────────────────────────────────────
-- TRACKING TABLES
-- ────────────────────────────────────────────────────────────
create table public.announcement_reads (
  user_id         uuid not null references public.profiles(id) on delete cascade,
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  read_at         timestamptz not null default now(),
  primary key (user_id, announcement_id)
);

create table public.roadmap_completions (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  roadmap_id  uuid not null references public.roadmaps(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, roadmap_id)
);

create table public.resource_downloads (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  resource_id    uuid not null references public.resources(id) on delete cascade,
  downloaded_at  timestamptz not null default now()
);

create index downloads_resource_idx on public.resource_downloads(resource_id);
create index downloads_user_idx on public.resource_downloads(user_id);

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY POLICIES
-- ────────────────────────────────────────────────────────────

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.resource_types enable row level security;
alter table public.resources enable row level security;
alter table public.announcements enable row level security;
alter table public.roadmaps enable row level security;
alter table public.announcement_reads enable row level security;
alter table public.roadmap_completions enable row level security;
alter table public.resource_downloads enable row level security;

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'ADMIN'
  );
$$ language sql security definer stable;

-- Helper: get current user's branch
create or replace function public.my_branch()
returns text as $$
  select branch_code from public.profiles
  where id = auth.uid();
$$ language sql security definer stable;

-- PROFILES
create policy "Users can view own profile"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Admin can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- SUBJECTS (read-only for students, full admin)
create policy "Students can view subjects in their branch"
  on public.subjects for select
  using (branch_code = public.my_branch() or public.is_admin());

create policy "Admin can manage subjects"
  on public.subjects for all
  using (public.is_admin());

-- RESOURCE TYPES (read-only for students)
create policy "Everyone can view active resource types"
  on public.resource_types for select
  using (is_active = true or public.is_admin());

create policy "Admin can manage resource types"
  on public.resource_types for all
  using (public.is_admin());

-- RESOURCES (students restricted to own branch)
create policy "Students can view published resources in their branch"
  on public.resources for select
  using (
    status = 'PUBLISHED'
    and (branch_code = public.my_branch() or public.is_admin())
  );

create policy "Admin can manage all resources"
  on public.resources for all
  using (public.is_admin());

-- ANNOUNCEMENTS
create policy "All authenticated users can view announcements"
  on public.announcements for select
  using (auth.uid() is not null);

create policy "Admin can manage announcements"
  on public.announcements for all
  using (public.is_admin());

-- ROADMAPS (students see their branch only)
create policy "Students can view roadmaps for their branch"
  on public.roadmaps for select
  using (branch_code = public.my_branch() or public.is_admin());

create policy "Admin can manage roadmaps"
  on public.roadmaps for all
  using (public.is_admin());

-- ANNOUNCEMENT READS
create policy "Users can manage own reads"
  on public.announcement_reads for all
  using (user_id = auth.uid());

-- ROADMAP COMPLETIONS
create policy "Users can manage own completions"
  on public.roadmap_completions for all
  using (user_id = auth.uid());

-- RESOURCE DOWNLOADS
create policy "Users can view own downloads"
  on public.resource_downloads for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Users can insert own downloads"
  on public.resource_downloads for insert
  with check (user_id = auth.uid());
