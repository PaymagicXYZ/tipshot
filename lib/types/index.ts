import { Tables } from './supabase';

export type Nullable<T> = T | null;

export type TokenTossUser = Tables<'token_toss_users'>;
