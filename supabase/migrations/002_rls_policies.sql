-- Enable row-level security and user-owned policies.

alter table public.profiles enable row level security;
alter table public.skills_progress enable row level security;
alter table public.weekly_plans enable row level security;
alter table public.plan_sessions enable row level security;
alter table public.session_runs enable row level security;

drop policy if exists "profiles owner read" on public.profiles;
create policy "profiles owner read"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles owner write" on public.profiles;
create policy "profiles owner write"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "skills progress owner all" on public.skills_progress;
create policy "skills progress owner all"
on public.skills_progress for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "weekly plans owner all" on public.weekly_plans;
create policy "weekly plans owner all"
on public.weekly_plans for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "plan sessions owner all" on public.plan_sessions;
create policy "plan sessions owner all"
on public.plan_sessions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "session runs owner all" on public.session_runs;
create policy "session runs owner all"
on public.session_runs for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
