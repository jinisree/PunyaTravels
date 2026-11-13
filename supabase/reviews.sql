-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Creates the reviews table, lets website visitors read and add reviews,
-- and turns on Realtime so new reviews appear on open pages instantly.

create table if not exists public.reviews (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(trim(name)) between 1 and 80),
  location    text check (location is null or char_length(location) <= 80),
  rating      smallint not null default 5 check (rating between 1 and 5),
  message     text not null check (char_length(trim(message)) between 1 and 1000),
  created_at  timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "Anyone can read reviews" on public.reviews;
create policy "Anyone can read reviews"
  on public.reviews for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can add a review" on public.reviews;
create policy "Anyone can add a review"
  on public.reviews for insert
  to anon, authenticated
  with check (true);
-- No update/delete policies: visitors cannot edit or remove reviews.
-- Delete unwanted reviews from the Supabase Table Editor.

-- Realtime: broadcast new rows to connected browsers.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reviews'
  ) then
    alter publication supabase_realtime add table public.reviews;
  end if;
end $$;

-- Seed the existing website reviews (only if the table is empty).
insert into public.reviews (name, location, rating, message, created_at)
select * from (values
  ('Siddharth Rao', 'Hyderabad, Telangana', 5, 'Awesome Wayanad wildlife jeep adventure and Varkala beach trip! Transparent communication via WhatsApp and custom re-planning whenever we requested changes.', now() - interval '5 days'),
  ('David Wilson', 'International Traveler', 5, 'Exceptional tour covering both Kerala and Tamil Nadu! From tea gardens to ancient shore temples in Mahabalipuram, everything was top-notch and stress-free.', now() - interval '4 days'),
  ('Priya Sharma', 'Bangalore, Karnataka', 5, 'The spiritual and heritage tour to Madurai Meenakshi Temple, Rameswaram, and Kanyakumari was spiritually uplifting. Courteous drivers and 24/7 travel support!', now() - interval '3 days'),
  ('Rajesh Kumar', 'Chennai, Tamil Nadu', 5, 'Flawless arrangement for our family trip of 14 people across Ooty and Kodaikanal. The custom itinerary flexibility allowed us to adjust sightseeing as needed. Highly recommended!', now() - interval '2 days'),
  ('Ananya Nair', 'Kochi, Kerala', 5, 'Exploring Munnar tea hills and Alleppey backwater houseboats was a dream come true! The team arranged a comfortable AC vehicle for our group of 8 guests and high-quality stays.', now() - interval '1 day')
) as seed(name, location, rating, message, created_at)
where not exists (select 1 from public.reviews);
