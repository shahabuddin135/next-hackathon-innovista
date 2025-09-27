"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { TimerReset, Lightbulb, Check, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import type { QuizSpec } from "./QuizBuilder"

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  hint?: string
}

interface QuizRunnerProps {
  spec: QuizSpec
  onExit?: () => void
}

export const QuizRunner = ({ spec, onExit }: QuizRunnerProps) => {
  const secondsPerQuestion = 30
  const totalTime = secondsPerQuestion * spec.numQuestions
  const [remaining, setRemaining] = useState(totalTime)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(spec.numQuestions).fill(null))
  const [showHint, setShowHint] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout)
          setSubmitted(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const questions: QuizQuestion[] = useMemo(() => {
    // Very lightweight generation: derive tokens from sourceText when present; fallback to a canned set
    const fallback = [
      { q: `What is a key concept in ${spec.topic || "this topic"}?`, hint: "Recall the main definition.", options: ["Definition A", "Definition B", "Definition C", "Definition D"], correct: 1 },
      { q: `Which statement best describes ${spec.topic || "the subject"}?`, hint: "Eliminate extremes.", options: ["Too broad", "Balanced statement", "Too specific", "Unrelated"], correct: 1 },
      { q: `Pick the correct relation about ${spec.topic || "the idea"}`, hint: "Think about cause→effect.", options: ["X causes Y", "Y always causes X", "No relation", "Contradiction"], correct: 0 },
    ]
    const tokens = (spec.sourceText || "")
      .replace(/\s+/g, " ")
      .split(" ")
      .filter((w) => w.length > 5)
      .slice(0, 50)

    const base: QuizQuestion[] = Array.from({ length: spec.numQuestions }).map((_, i) => {
      const word = tokens[i % Math.max(tokens.length, 1)] || spec.topic || "Concept"
      const options = [
        `${word} concept`,
        `${word} definition`,
        `${word} example`,
        `${word} exception`,
      ]
      const correctIndex = (i + 1) % 4
      const hint = spec.enableHints ? `Focus on ${word} in context.` : undefined
      return { question: `Q${i + 1}. Identify the best match for ${word}.`, options, correctIndex, hint }
    })

    // Mix in fallback if source sparse
    for (let i = 0; i < Math.min(fallback.length, base.length); i++) {
      if (!spec.sourceText) {
        base[i] = {
          question: fallback[i].q,
          options: fallback[i].options,
          correctIndex: fallback[i].correct,
          hint: spec.enableHints ? fallback[i].hint : undefined,
        }
      }
    }

    // Adjust difficulty very lightly by shuffling or similar cues
    if (spec.difficulty === "hard") {
      base.reverse()
    }

    return base
  }, [spec])

  const correctCount = useMemo(() => {
    if (!submitted) return 0
    return answers.reduce((acc, a, i) => acc + (a === questions[i].correctIndex ? 1 : 0), 0)
  }, [answers, questions, submitted])

  const progress = Math.round(((idx + 1) / questions.length) * 100)

  const selectAnswer = (val: number) => {
    const next = [...answers]
    next[idx] = val
    setAnswers(next)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{spec.topic || "Custom Quiz"} <Badge variant="outline">{spec.difficulty}</Badge></CardTitle>
        <CardDescription>
          {spec.numQuestions} questions • {secondsPerQuestion}s per question • {spec.enableHints ? "Hints on" : "Hints off"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="tabular-nums"><TimerReset className="h-3 w-3 mr-1"/>{Math.floor(remaining/60).toString().padStart(2,'0')}:{(remaining%60).toString().padStart(2,'0')}</Badge>
          <div className="w-1/2">
            <Progress value={progress} />
          </div>
          <Badge variant="outline" className="tabular-nums">{idx+1}/{questions.length}</Badge>
        </div>

        {!submitted ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{questions[idx].question}</h3>

            <RadioGroup value={answers[idx] !== null ? String(answers[idx]) : ""} onValueChange={(v)=>selectAnswer(Number(v))}>
              {questions[idx].options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <RadioGroupItem id={`opt-${idx}-${i}`} value={String(i)} />
                  <Label htmlFor={`opt-${idx}-${i}`}>{opt}</Label>
                </div>
              ))}
            </RadioGroup>

            {spec.enableHints && (
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={()=>setShowHint((s)=>!s)}>
                  <Lightbulb className="h-4 w-4 mr-2"/>
                  {showHint ? "Hide hint" : "Show hint"}
                </Button>
                {showHint && questions[idx].hint && (
                  <span className="text-sm text-muted-foreground">{questions[idx].hint}</span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={()=>setIdx((i)=>Math.max(0, i-1))} disabled={idx===0}>
                <ChevronLeft className="h-4 w-4 mr-1"/>Prev
              </Button>
              {idx < questions.length - 1 ? (
                <Button type="button" onClick={()=>setIdx((i)=>Math.min(questions.length-1, i+1))} disabled={answers[idx]===null}>
                  Next<ChevronRight className="h-4 w-4 ml-1"/>
                </Button>
              ) : (
                <Button type="button" onClick={()=>setSubmitted(true)} disabled={answers[idx]===null}>Submit</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              {correctCount >= Math.ceil(questions.length*0.7) ? (
                <Check className="h-8 w-8 text-emerald-600"/>
              ) : (
                <XCircle className="h-8 w-8 text-red-600"/>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Quiz complete</h3>
              <p className="text-muted-foreground">Score: {correctCount} / {questions.length}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onExit}>Exit</Button>
      </CardFooter>
    </Card>
  )
}

export default QuizRunner