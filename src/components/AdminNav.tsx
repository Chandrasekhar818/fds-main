"use client";

import Link from "next/link";
import { BrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function AdminNav({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const supabase = BrowserClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="w-64 bg-white border-r h-full p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button onClick={onClose} className="lg:hidden">
          <X />
        </button>
      </div>

      <Link href="/dashboard" onClick={onClose} className="block p-2 hover:bg-gray-100 rounded">
        Dashboard
      </Link>

      <Link href="/dashboard/insider-trading" onClick={onClose} className="block p-2 hover:bg-gray-100 rounded">
        Insider Trading
      </Link>

      <Link href="/dashboard/institutional-holdings" onClick={onClose} className="block p-2 hover:bg-gray-100 rounded">
        Institutional Holdings
      </Link>

      <Link href="/dashboard/cot-data" onClick={onClose} className="block p-2 hover:bg-gray-100 rounded">
        COT Data
      </Link>

      <Link href="/dashboard/price-analysis" onClick={onClose} className="block p-2 hover:bg-gray-100 rounded">
        Price Analysis
      </Link>
      <button
        onClick={logout}
        className="mt-6 w-full bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
