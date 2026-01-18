-- Add foreign key relationship between members.user_id and profiles.id
-- This enables Supabase to understand the relationship for nested queries

ALTER TABLE public.members 
ADD CONSTRAINT members_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add comment explaining the relationship
COMMENT ON CONSTRAINT members_user_id_profiles_fkey ON public.members IS 'Links member to their profile via user_id = profiles.id';
