-- Ensure a profile row is created whenever a user is created in auth.users.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_display_name text;
  first_initial text;
  second_initial text;
begin
  resolved_display_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
    split_part(new.email, '@', 1),
    'Utilisateur'
  );

  first_initial := upper(substr(split_part(resolved_display_name, ' ', 1), 1, 1));
  second_initial := upper(substr(split_part(resolved_display_name, ' ', 2), 1, 1));

  insert into public.profiles (id, display_name, email, initials)
  values (
    new.id,
    resolved_display_name,
    coalesce(new.email, ''),
    coalesce(nullif(first_initial || second_initial, ''), 'U')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users created before this trigger existed.
insert into public.profiles (id, display_name, email, initials)
select
  u.id,
  coalesce(
    nullif(trim(u.raw_user_meta_data->>'display_name'), ''),
    split_part(u.email, '@', 1),
    'Utilisateur'
  ),
  coalesce(u.email, ''),
  coalesce(
    nullif(
      upper(substr(split_part(coalesce(nullif(trim(u.raw_user_meta_data->>'display_name'), ''), split_part(u.email, '@', 1), 'Utilisateur'), ' ', 1), 1, 1)) ||
      upper(substr(split_part(coalesce(nullif(trim(u.raw_user_meta_data->>'display_name'), ''), split_part(u.email, '@', 1), 'Utilisateur'), ' ', 2), 1, 1)),
      ''
    ),
    'U'
  )
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
