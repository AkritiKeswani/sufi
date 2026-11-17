-- Sufi: saved shayari, saved words, and the user's own shayari.
-- Run once in Supabase → SQL Editor. Users are Clerk users: each row's
-- user_id is the Clerk user id from the session token ("sub"), and Row Level
-- Security lets people see and change only their own rows.

create table if not exists public.favorites (
  user_id    text        not null default (auth.jwt() ->> 'sub'),
  kind       text        not null check (kind in ('shayari', 'word')),
  item_id    text        not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, item_id)
);

create table if not exists public.writings (
  id         uuid        primary key default gen_random_uuid(),
  user_id    text        not null default (auth.jwt() ->> 'sub'),
  title      text        not null default '' check (char_length(title) <= 200),
  body       text        not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists writings_user_created on public.writings (user_id, created_at desc);

alter table public.favorites enable row level security;
alter table public.writings  enable row level security;

grant select, insert, update, delete on public.favorites to authenticated;
grant select, insert, update, delete on public.writings  to authenticated;

create policy "favorites: read own"   on public.favorites for select to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);
create policy "favorites: add own"    on public.favorites for insert to authenticated
  with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "favorites: remove own" on public.favorites for delete to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);

create policy "writings: read own"   on public.writings for select to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);
create policy "writings: add own"    on public.writings for insert to authenticated
  with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "writings: edit own"   on public.writings for update to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "writings: delete own" on public.writings for delete to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);
