"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileIcon, Loader2, Brain, CheckCircle2 } from "lucide-react"
import * as pdfjs from "pdfjs-dist"

// Configure pdfjs worker (fallback inline for sandbox)
// @ts-ignore
pdfjs.GlobalWorkerOptions.workerSrc = pdfjs.GlobalWorkerOptions.workerSrc ||
  `https://unpkg.com/pdfjs-dist@${(pdfjs as any).version}/build/pdf.worker.min.js`

export type Difficulty = "easy" | "medium" | "hard"

export interface QuizSpec {
  topic: string
  numQuestions: number
  difficulty: Difficulty
  enableHints: boolean
  sourceText?: string
}

interface QuizBuilderProps {
  onBuild: (spec: QuizSpec) => void
  role?: "teach" | "learn"
}

export const QuizBuilder = ({ onBuild, role = "learn" }: QuizBuilderProps) => {
  const [topic, setTopic] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [enableHints, setEnableHints] = useState(true)
  const [pdfName, setPdfName] = useState<string>("")
  const [sourceText, setSourceText] = useState<string>("")

  // Teacher guided Q&A (lightweight)
  const [gradeLevel, setGradeLevel] = useState<string>("")
  const [questionType, setQuestionType] = useState<string>("mcq")
  const [objectives, setObjectives] = useState<string>("")

  // Agent status messages: Loading → Thinking → Visualizing (simple, plain English)
  const [status, setStatus] = useState<"idle" | "loading" | "thinking" | "visualizing" | "ready">("idle")

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const canBuild = topic.trim().length > 0 || sourceText.trim().length > 0

  const handlePDF = async (file: File) => {
    setPdfName(file.name)
    setStatus("loading")
    try {
      const arrayBuffer = await file.arrayBuffer()
      // @ts-ignore
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      let text = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        // @ts-ignore
        const page = await pdf.getPage(i)
        // @ts-ignore
        const content = await page.getTextContent()
        const strings = content.items?.map((it: any) => it.str) || []
        text += strings.join(" ") + "\n"
        if (text.length > 10000) break // cap to keep things snappy
      }
      setStatus("thinking")
      // simple normalization step
      const normalized = text.replace(/\s+/g, " ").trim()
      setSourceText(normalized)
      // brief visualization phase to mimic pipeline
      setTimeout(() => setStatus("ready"), 400)
    } catch (e) {
      console.error(e)
      setStatus("idle")
    }
  }

  const build = async () => {
    setStatus("visualizing")
    // brief staged status updates to mimic agent steps
    await new Promise((r) => setTimeout(r, 300))
    setStatus("ready")
    const enrichedSource = [
      sourceText,
      role === "teach" && gradeLevel ? `\nGrade: ${gradeLevel}` : "",
      role === "teach" && questionType ? `\nQuestion type: ${questionType}` : "",
      role === "teach" && objectives ? `\nObjectives: ${objectives}` : "",
    ]
      .filter(Boolean)
      .join(" ")
    onBuild({ topic, numQuestions, difficulty, enableHints, sourceText: enrichedSource })
  }

  return (
    <Card className="backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-white/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" /> {role === "teach" ? "Make a quiz" : "Take a quiz"}
        </CardTitle>
        <CardDescription>
          Topic, question count, difficulty, optional PDF, and hints. Simple status messages show each step.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Teacher guided Q&A */}
        {role === "teach" && (
          <div className="rounded-lg border p-3 sm:p-4 bg-background">
            <div className="text-sm font-medium mb-2">Quick teacher setup</div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="grade">Grade level</Label>
                <Input id="grade" placeholder="e.g., 6th, 10th, college" value={gradeLevel} onChange={(e)=>setGradeLevel(e.target.value)} />
              </div>
              <div>
                <Label>Question type</Label>
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple choice</SelectItem>
                    <SelectItem value="truefalse">True/False</SelectItem>
                    <SelectItem value="mix">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-1 sm:hidden" />
              <div className="sm:col-span-3">
                <Label htmlFor="obj">Learning objectives (optional)</Label>
                <Input id="obj" placeholder="e.g., Identify key steps, apply formula, compare concepts" value={objectives} onChange={(e)=>setObjectives(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" placeholder="e.g., Photosynthesis" value={topic} onChange={(e)=>setTopic(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="count">Number of questions</Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={25}
              value={numQuestions}
              onChange={(e)=>setNumQuestions(Math.max(1, Math.min(25, Number(e.target.value || 1))))}
            />
          </div>

          <div>
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={(v)=>setDifficulty(v as Difficulty)}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-3">
              <Switch id="hints" checked={enableHints} onCheckedChange={setEnableHints} />
              <Label htmlFor="hints">Enable hints</Label>
            </div>
            <Badge variant="outline" className="text-xs">{enableHints ? "Hints on" : "Hints off"}</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label>PDF (optional)</Label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e)=>{
                const f = e.target.files?.[0]
                if (f) void handlePDF(f)
              }}
            />
            <Button variant="outline" type="button" onClick={()=>fileInputRef.current?.click()} className="gap-2">
              <FileIcon className="h-4 w-4" /> {pdfName ? pdfName : "Upload PDF"}
            </Button>
            {sourceText && (
              <Badge variant="secondary" className="text-xs">PDF parsed</Badge>
            )}
          </div>
          {status !== "idle" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {status === "loading" && (<><Loader2 className="h-4 w-4 animate-spin"/> Loading PDF…</>)}
              {status === "thinking" && (<><Loader2 className="h-4 w-4 animate-spin"/> Thinking…</>)}
              {status === "visualizing" && (<><Loader2 className="h-4 w-4 animate-spin"/> Visualizing…</>)}
              {status === "ready" && (<><CheckCircle2 className="h-4 w-4 text-emerald-600"/> Ready</>)}
            </div>
          )}
        </div>

      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="button" disabled={!canBuild} onClick={build}>Start</Button>
      </CardFooter>
    </Card>
  )
}

export default QuizBuilder