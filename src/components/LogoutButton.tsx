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
      className="rounded-lg border-[1.5px] border-primary px-4 py-2 text-xs font-semibold text-primary transition duration-150 hover:bg-primary hover:text-white"
    >
      Lock
    </button>
  );
};
