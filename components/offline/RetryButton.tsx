"use client";

import { RefreshCw } from "lucide-react";

export function RetryButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="btn-primary w-full justify-center"
    >
      <RefreshCw className="h-4 w-4" />
      {label}
    </button>
  );
}
