export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <nav className="border-b border-[#E5E4E0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-2xl font-semibold">
            GoldTrace
            <span className="text-[#D4AF37]">.</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <a href="#services" className="nav-link">
              Services
            </a>

            <a href="#about" className="nav-link">
              About
            </a>

            <a href="#pricing" className="nav-link">
              Pricing
            </a>

            <a href="#support" className="nav-link">
              Support
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm">
              Log in
            </a>

            <button className="rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-medium">
              Sign up
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-[#C9973A] px-4 py-2 text-sm text-[#C9973A]">
            Built for retail gold buyers
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-tight">
            Every purchase,
            <br />
            priced right and{" "}
            <span className="text-[#C9973A]">
              audit-ready
            </span>
            .
          </h1>

          <p className="mt-6 text-lg text-[#334155]">
            Appraiser-backed pricing, pledge management and
            audit-ready reporting designed specifically for
            modern gold buying businesses.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-[#D4AF37] px-6 py-3 font-medium">
              Get started
            </button>

            <button className="rounded-full border border-[#0F172A] px-6 py-3">
              Log in
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}