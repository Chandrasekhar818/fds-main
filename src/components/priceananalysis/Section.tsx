"use client";

import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 shadow-sm space-y-4">

      <h3 className="text-md font-semibold text-gray-800 uppercase tracking-wide">
        {title}
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        {children}
      </div>

    </div>
  );
}
