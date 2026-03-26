"use server";

import { ServerClient } from "@/lib/supabase/server";

export async function createUserAction(
  email: string,
  password: string
) {
  const supabase = await ServerClient();

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
