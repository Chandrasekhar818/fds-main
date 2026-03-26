"use client";

import { useState } from "react";
import { createUserAction } from "@/app/actions/user";

export default function Users() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const createUser = async () => {
    if (!form.email || !form.password) {
      setMessage("Email and password required");
      return;
    }

    const result = await createUserAction(
      form.email,
      form.password
    );

    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage("User created successfully!");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Manage Users</h1>

      <div className="mt-4 bg-white p-4 rounded shadow w-96 space-y-3">
        <input
          type="email"
          placeholder="User Email"
          className="p-2 border w-full rounded"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="p-2 border w-full rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={createUser}
          className="bg-green-600 text-white p-2 rounded w-full"
        >
          Create User
        </button>

        {message && (
          <p className="text-sm mt-2">{message}</p>
        )}
      </div>
    </div>
  );
}
