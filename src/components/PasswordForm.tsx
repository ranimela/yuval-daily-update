"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export const PasswordForm = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Incorrect password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password-input" className="mb-1.5 block text-sm font-extrabold text-ink">
          Password
        </label>
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          placeholder="Enter password"
          className={`min-h-[48px] w-full rounded-[14px] border-[3px] px-3.5 text-[16px] font-bold text-ink outline-none transition ${
            error
              ? "border-dose-red bg-red-50 focus:ring-4 focus:ring-dose-red/30"
              : "border-ink bg-white focus:ring-4 focus:ring-dose-yellow/60"
          }`}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm font-extrabold text-dose-red">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="cartoon-pill min-h-[48px] w-full bg-dose-yellow px-6 font-headline text-lg uppercase tracking-wide text-ink transition active:translate-x-[1px] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Checking..." : "Open Daily Dose"}
      </button>
    </form>
  );
};
