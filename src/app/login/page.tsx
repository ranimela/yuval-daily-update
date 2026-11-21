import { PasswordForm } from "@/components/PasswordForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sky px-4 py-8">
      <section className="cartoon-card w-full max-w-[420px]">
        <div className="border-b-4 border-ink bg-dose-yellow px-5 py-4">
          <div className="-rotate-1 inline-block">
            <span className="font-headline text-3xl uppercase tracking-wide text-ink">
              DAILY DOSE
            </span>
          </div>
          <p className="mt-0.5 text-sm font-extrabold text-ink">for Yuval</p>
        </div>

        <div className="p-5">
          <h1 className="font-headline text-2xl uppercase text-ink">Unlock Today&apos;s Page</h1>
          <p className="mt-1 text-sm font-semibold text-ink/80">
            Enter your password to see history, news, term of the day, and a brain teaser.
          </p>

          <div className="mt-5">
            <PasswordForm />
          </div>
        </div>
      </section>
    </main>
  );
}
