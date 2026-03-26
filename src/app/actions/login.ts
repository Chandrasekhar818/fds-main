"use server";

import { ServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/login";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);

  // ❌ Zod validation failed
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;
  const cookieStore = await cookies()
  const supabase = await ServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (!data.user) {
    return {
      success: false,
      message: "User data not found after login.",
    };
  }
  cookieStore.set('token', data.session?.access_token || '')
  revalidatePath('/dashboard')
  redirect('/dashboard');
}
