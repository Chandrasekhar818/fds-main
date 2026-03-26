
"use client";

import AdminNav from "@/components/AdminNav";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sidebar (overlay mode) */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="z-50">
            <AdminNav onClose={() => setOpen(false)} />
          </div>

          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* Top bar ONLY */}
      <header className="h-14 bg-white border-b flex items-center px-4">
        <button
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <Menu />
        </button>
        <h1 className="ml-4 font-semibold text-lg">
          Admin Dashboard
        </h1>
      </header>
    </>
  );
};
