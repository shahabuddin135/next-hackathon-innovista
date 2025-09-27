"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Play, CheckCircle } from "lucide-react"
import { type UserRole } from "@/components/Header"
import { useI18n } from "@/lib/i18n"

interface QuizTabProps {
  currentRole: UserRole
}

export function QuizTab({ currentRole }: QuizTabProps) {
  const { t } = useI18n()
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showResults, setShowResults] = useState(false)

  // Sample quiz data
  const sampleQuiz = {
    title: "Basic Mathematics",
    questions: [
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: "4"
      },
      {
        question: "What is 5 × 3?",
        options: ["12", "15", "18", "20"],
        correct: "15"
      }
    ]
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsGenerating(false)
  }

  const handleStartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setShowResults(false)
  }

  const handleAnswerSubmit = () => {
    if (currentQuestion < sampleQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer("")
    } else {
      setShowResults(true)
    }
  }

  if (currentRole === "teach") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t("quiz_creator")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("quiz_creator_desc")}
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{t("create_new_quiz")}</CardTitle>
            <CardDescription>
              {t("create_new_quiz_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="quiz-topic" className="text-sm font-medium">
                  {t("quiz_topic")}
                </label>
                <Input
                  id="quiz-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t("quiz_topic_ph")}
                  disabled={isGenerating}
                />
              </div>

              <Button 
                type="submit" 
                disabled={!topic.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    {t("generating_quiz")}
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    {t("generate_quiz_btn")}
                  </>
                )}
              </Button>
            </form>

            {isGenerating && (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground text-center">
                  {t("generating_for")} "{topic}"...
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-3 border rounded">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="space-y-1">
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isGenerating && topic && (
              <div className="space-y-3">
                <Badge variant="outline" className="w-fit">
                  {t("ui_demo_note")}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {t("ui_demo_desc")}
                </div>
              </div>
            )}

            {!topic && !isGenerating && (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Brain className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{t("ready_to_create")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("enter_topic_to_generate")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Learner mode
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {t("practice_quiz")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("practice_quiz_desc")}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t("sample_quiz")}: {sampleQuiz.title}</CardTitle>
          <CardDescription>
            {t("try_sample_quiz")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion < sampleQuiz.questions.length && !showResults ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  {t("question")} {currentQuestion + 1} {t("of") ?? "of"} {sampleQuiz.questions.length}
                </Badge>
                <Badge variant="secondary">
                  {t("progress")}: {Math.round(((currentQuestion + 1) / sampleQuiz.questions.length) * 100)}%
                </Badge>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">
                  {sampleQuiz.questions[currentQuestion].question}
                </h4>

                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  {sampleQuiz.questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button 
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer}
                  className="w-full"
                >
                  {currentQuestion < sampleQuiz.questions.length - 1 ? t("next_question") : t("finish_quiz")}
                </Button>
              </div>
            </div>
          ) : showResults ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">{t("quiz_complete")}</h4>
                <p className="text-muted-foreground">
                  {t("quiz_complete_desc")}
                </p>
              </div>
              <Button onClick={handleStartQuiz} variant="outline">
                {t("retake_quiz")}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">{t("ready_to_start")}</h4>
                <p className="text-muted-foreground">
                  {t("sample_quiz_intro")}
                </p>
              </div>
              <Button onClick={handleStartQuiz}>
                <Play className="h-4 w-4 mr-2" />
                {t("start_sample_quiz")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}