"use client"

import { useState } from "react"
import { QuizBuilder, type QuizSpec } from "@/components/quiz/QuizBuilder"
import { QuizRunner } from "@/components/quiz/QuizRunner"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function QuizPage() {
  const [spec, setSpec] = useState<QuizSpec | null>(null)
  const [role, setRole] = useState<"teach" | "learn">("learn")

  return (
    <main id="main-content" className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-100/40 to-background dark:from-cyan-400/10">
        <div className="grain-texture w-full h-full" />
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-6">
          {!spec ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {role === "teach" ? "Make a quiz" : "Take a quiz"}
                  </h1>
                  <p className="text-muted-foreground">
                    Choose topic, number of questions, difficulty, optional PDF, and hints.
                  </p>
                </div>
                <ToggleGroup type="single" value={role} onValueChange={(v)=> v && setRole(v as any)} className="hidden sm:flex">
                  <ToggleGroupItem value="teach" aria-label="Teach" className="px-3">Teach</ToggleGroupItem>
                  <ToggleGroupItem value="learn" aria-label="Learn" className="px-3">Learn</ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Mobile role toggle */}
              <ToggleGroup type="single" value={role} onValueChange={(v)=> v && setRole(v as any)} className="sm:hidden">
                <ToggleGroupItem value="teach" aria-label="Teach" className="px-3">Teach</ToggleGroupItem>
                <ToggleGroupItem value="learn" aria-label="Learn" className="px-3">Learn</ToggleGroupItem>
              </ToggleGroup>

              <QuizBuilder onBuild={setSpec} role={role} />
            </>
          ) : (
            <>
              <QuizRunner spec={spec} onExit={() => setSpec(null)} />
            </>
          )}
        </div>
      </div>
    </main>
  )
}