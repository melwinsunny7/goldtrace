"use client";

import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    console.log({ email, password });
  }

  return (
    <div className="flex min-h-dvh w-full flex-1 items-center justify-center overflow-x-hidden overflow-y-auto bg-[#FFFFFF] font-sans text-[#0F172A] pt-[max(1.5rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] sm:pt-[max(3rem,env(safe-area-inset-top))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] sm:pb-[max(3rem,env(safe-area-inset-bottom))] sm:pl-[max(1.5rem,env(safe-area-inset-left))]">
      <div className="w-full max-w-sm min-w-0 rounded-lg border border-slate-200 bg-[#FFFFFF] shadow-sm">
        <header className="px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <p className="text-xl font-semibold tracking-tight sm:text-2xl">
            GoldTrace
          </p>
          <p className="mt-1 text-sm text-[#0F172A]/70">User sign-in</p>
        </header>

        <div className="h-px bg-[#D4AF37]" aria-hidden="true" />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 px-5 py-6 sm:gap-5 sm:px-8 sm:py-8"
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full min-w-0 rounded-md border border-slate-200 bg-[#FFFFFF] px-3 text-base text-[#0F172A] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] sm:h-10 sm:text-sm"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full min-w-0 rounded-md border border-slate-200 bg-[#FFFFFF] px-3 text-base text-[#0F172A] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] sm:h-10 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-1 h-11 w-full rounded-md bg-[#D4AF37] text-base font-semibold text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:text-sm"
          >
            Sign in
          </button>

          <a
            href="#"
            className="py-1 text-center text-sm text-[#0F172A]/70 underline-offset-2 hover:underline sm:text-xs"
          >
            Forgot password?
          </a>
        </form>
      </div>
    </div>
  );
}
