-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Sets up the two tables the app needs and opens them up to anyone with your
-- anon public key (same trust tradeoff as the old Firebase starter rules:
-- fine for a small trusted group of judges sharing a link, since nothing
-- sensitive lives here. Add Supabase Auth later if you want real access
-- control, and tighten these policies to require auth.uid().

create table if not exists invitationals (
  id text primary key,
  name text not null,
  level text not null default 'regional',
  updated_at timestamptz not null default now()
);

create table if not exists teams (
  invitational_id text not null references invitationals(id) on delete cascade,
  number text not null,
  name text default '',
  scores jsonb not null default '{}',
  finalized boolean not null default false,
  images jsonb not null default '[]',
  mult jsonb not null default '{"materials":false,"fake":false,"offTopic":1}',
  final numeric,
  updated_at timestamptz not null default now(),
  primary key (invitational_id, number)
);

alter table invitationals enable row level security;
alter table teams enable row level security;

create policy "public all invitationals" on invitationals
  for all using (true) with check (true);
create policy "public all teams" on teams
  for all using (true) with check (true);

-- Storage bucket for report photos (public read so <img> tags can load them
-- directly; write/delete open to anyone with the anon key, same tradeoff as above).
insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

create policy "public read report-photos" on storage.objects
  for select using (bucket_id = 'report-photos');
create policy "public write report-photos" on storage.objects
  for insert with check (bucket_id = 'report-photos');
create policy "public delete report-photos" on storage.objects
  for delete using (bucket_id = 'report-photos');
