"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Play, CheckCircle, XCircle } from "lucide-react"
import { type UserRole } from "@/components/Header"

interface QuizTabProps {
  currentRole: UserRole
}

export function QuizTab({ currentRole }: QuizTabProps) {
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
            Quiz Creator
          </h3>
          <p className="text-sm text-muted-foreground">
            Generate interactive quizzes to test your students' understanding.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Create New Quiz</CardTitle>
            <CardDescription>
              Specify a topic and we'll generate relevant questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="quiz-topic" className="text-sm font-medium">
                  Quiz topic
                </label>
                <Input
                  id="quiz-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., algebra basics, world history, biology..."
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
                    Generating quiz...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </form>

            {isGenerating && (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground text-center">
                  Creating questions for "{topic}"...
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
                  UI Demo - No actual quiz generation
                </Badge>
                <div className="text-sm text-muted-foreground">
                  In the full version, this will generate custom quiz questions 
                  based on your specified topic using AI.
                </div>
              </div>
            )}

            {!topic && !isGenerating && (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Brain className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Ready to create</p>
                  <p className="text-sm text-muted-foreground">
                    Enter a topic to generate quiz questions
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
          Practice Quiz
        </h3>
        <p className="text-sm text-muted-foreground">
          Test your knowledge with interactive quizzes.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Sample Quiz: {sampleQuiz.title}</CardTitle>
          <CardDescription>
            Try this sample quiz to see how the feature works
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion < sampleQuiz.questions.length && !showResults ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {sampleQuiz.questions.length}
                </Badge>
                <Badge variant="secondary">
                  Progress: {Math.round(((currentQuestion + 1) / sampleQuiz.questions.length) * 100)}%
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
                  {currentQuestion < sampleQuiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </div>
            </div>
          ) : showResults ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">Quiz Complete!</h4>
                <p className="text-muted-foreground">
                  Great job finishing the sample quiz. In the full version, 
                  you'd see your detailed results here.
                </p>
              </div>
              <Button onClick={handleStartQuiz} variant="outline">
                Retake Quiz
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">Ready to start?</h4>
                <p className="text-muted-foreground">
                  This sample quiz will demonstrate the quiz-taking experience.
                </p>
              </div>
              <Button onClick={handleStartQuiz}>
                <Play className="h-4 w-4 mr-2" />
                Start Sample Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}