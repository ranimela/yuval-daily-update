import { PasswordForm } from "@/components/PasswordForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-base px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"
      />

      <section className="glass-panel relative w-full max-w-md rounded-3xl p-8">
        <span className="inline-block rounded-full bg-tertiary px-3 py-1 font-mono text-xs font-medium text-gray-900">
          yuval.melameds.net
        </span>
        <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight text-gray-900">
          Yuval&apos;s Daily Update
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the password to view today&apos;s history and news.
        </p>

        <div className="mt-6">
          <PasswordForm />
        </div>
      </section>
    </main>
  );
}
