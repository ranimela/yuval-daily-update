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
        <label htmlFor="password-input" className="mb-1.5 block text-sm font-medium text-gray-800">
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
          className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition ${
            error
              ? "border-status-error bg-red-50 focus:ring-2 focus:ring-status-error/20"
              : "border-gray-300 bg-white hover:border-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/30"
          }`}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm font-medium text-status-error">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="h-11 w-full rounded-lg bg-primary px-6 font-headline text-sm font-semibold text-white shadow-accent transition duration-150 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "Checking..." : "Unlock Daily Update"}
      </button>
    </form>
  );
};
