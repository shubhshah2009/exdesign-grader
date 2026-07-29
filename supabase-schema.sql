-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- This app is now dedicated to a single event (Rickards Invitational) with two
-- divisions (B and C), so there is no more "invitationals" table -- just a
-- teams table keyed by (division, number), and one shared settings row for
-- the Regional / State-Nationals judging level toggle.
--
-- Safe to re-run: drops the old multi-invitational schema from an earlier
-- version of this app if it exists, then creates the current schema.

drop table if exists teams cascade;
drop table if exists invitationals cascade;

create table teams (
  division text not null check (division in ('B','C')),
  number text not null,
  name text default '',
  scores jsonb not null default '{}',
  finalized boolean not null default false,
  images jsonb not null default '[]',
  mult jsonb not null default '{"materials":false,"fake":false,"offTopic":1}',
  section_pages jsonb not null default '{}',
  final numeric,
  updated_at timestamptz not null default now(),
  primary key (division, number)
);

create table if not exists event_settings (
  id int primary key default 1,
  level text not null default 'regional',
  constraint event_settings_singleton check (id = 1)
);
insert into event_settings (id, level) values (1, 'regional')
on conflict (id) do nothing;

alter table teams enable row level security;
alter table event_settings enable row level security;

-- Starter policies are intentionally open (anyone with your anon key can
-- read/write) so you can get grading immediately with a small trusted group
-- of judges. Add Supabase Auth later if you want real access control.
create policy "public all teams" on teams
  for all using (true) with check (true);
create policy "public all event_settings" on event_settings
  for all using (true) with check (true);

-- Storage bucket for report photos (public read so <img> tags can load them
-- directly; write/delete open to anyone with the anon key, same tradeoff as above).
insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

drop policy if exists "public read report-photos" on storage.objects;
drop policy if exists "public write report-photos" on storage.objects;
drop policy if exists "public delete report-photos" on storage.objects;
create policy "public read report-photos" on storage.objects
  for select using (bucket_id = 'report-photos');
create policy "public write report-photos" on storage.objects
  for insert with check (bucket_id = 'report-photos');
create policy "public delete report-photos" on storage.objects
  for delete using (bucket_id = 'report-photos');
