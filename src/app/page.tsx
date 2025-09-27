import { redirect } from 'next/navigation'

export default function Home() {
  return (
    <main id="main-content" className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/40 to-background">
        <div className="grain-texture w-full h-full" />
      </div>

      <section className="container max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-white/5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Offline-first learning
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              No internet? <span className="text-muted-foreground">No No problem</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-prose">
              Learn, teach, and quiz anywhere. Our offline-first platform adapts to your connection and switches models automatically for a seamless experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/chat" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-primary-foreground font-medium shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Get Started
              </a>
              <a href="/quiz" className="inline-flex items-center justify-center rounded-md border px-5 py-3 font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Make / Take a Quiz
              </a>
            </div>
            <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> Auto / Online / Offline
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Works great offline
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-cyan-200/50 to-blue-200/40 dark:from-cyan-400/10 dark:to-blue-400/10 rounded-2xl blur-2xl" />
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-white/5">
              <div className="p-6 border-b">
                <div className="text-sm text-muted-foreground">Quiz preview</div>
                <div className="mt-2 font-semibold">Photosynthesis Basics</div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Q1. Plants convert light energy into?</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button className="text-left rounded-md border px-3 py-2 hover:bg-muted">Thermal energy</button>
                    <button className="text-left rounded-md border px-3 py-2 hover:bg-muted">Chemical energy</button>
                    <button className="text-left rounded-md border px-3 py-2 hover:bg-muted">Sound energy</button>
                    <button className="text-left rounded-md border px-3 py-2 hover:bg-muted">Kinetic energy</button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">Hints</span>
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">Timer</span>
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">Difficulty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border p-6 bg-card backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-white/5">
            <h3 className="font-semibold mb-2">Offline-first</h3>
            <p className="text-sm text-muted-foreground">Create and take quizzes without internet. Syncs when you're back online.</p>
          </div>
          <div className="rounded-xl border p-6 bg-card backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-white/5">
            <h3 className="font-semibold mb-2">PDF to Quiz</h3>
            <p className="text-sm text-muted-foreground">Upload a PDF; we extract key concepts to build tailored questions.</p>
          </div>
          <div className="rounded-xl border p-6 bg-card backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-white/5">
            <h3 className="font-semibold mb-2">Adaptive Models</h3>
            <p className="text-sm text-muted-foreground">Auto switches between local and cloud models based on connectivity.</p>
          </div>
        </div>
      </section>
    </main>
  )
}