// app/login/page.tsx
"use client";

import { loginAction, LoginState } from "@/app/actions/login";
import { useActionState } from "react";

const initialState: LoginState = {
  success: false,
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl ">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <form action={formAction} className="space-y-4 max-w-sm">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="border p-2 w-full"
                data-testid="email-input"
              />
              {state.fieldErrors?.email && (
                <p data-testid="email-error" className="text-blue-500 text-sm">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="border p-2 w-full"
                data-testid="password-input"
              />
              {state.fieldErrors?.password && (
                <p data-testid="password-error" className="text-red-500 text-sm">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            {state.message && (
              <p data-testid="message" className={state.success ? "text-green-600" : "text-red-600"}>
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="bg-blue-600 text-white px-4 py-2"
              data-testid="submit-button"
            >
              {pending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
