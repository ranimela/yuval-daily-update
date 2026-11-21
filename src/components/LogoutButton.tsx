"use client";

import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Settings"
      title="Lock Daily Dose"
      className="cartoon-menu-btn flex h-12 w-12 shrink-0 items-center justify-center bg-white text-ink transition active:translate-x-[1px] active:translate-y-[1px]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="22"
        height="22"
        className="stroke-ink"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </svg>
    </button>
  );
};
