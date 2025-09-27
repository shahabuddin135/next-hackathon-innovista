"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Plus, X, CheckCircle } from "lucide-react"

interface QuizDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export function QuizDialog({ open, onOpenChange }: QuizDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    gradeLevel: "",
    topic: "",
    difficulty: "",
    timeLimit: ""
  })
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }
    setQuestions([...questions, newQuestion])
  }

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ))
  }

  const handleGenerate = async () => {
    if (!formData.title.trim() || !formData.topic.trim()) return
    
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // Add sample questions
    const sampleQuestions: Question[] = [
      {
        id: "1",
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correctAnswer: 1,
        explanation: "Paris is the capital and most populous city of France."
      },
      {
        id: "2",
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correctAnswer: 2,
        explanation: "Mars is called the Red Planet due to iron oxide on its surface."
      }
    ]
    
    setQuestions(sampleQuestions)
    setIsGenerating(false)
  }

  const handleSave = () => {
    console.log("Quiz data:", { formData, questions })
    // Future: wire to FastAPI endpoint
    onOpenChange(false)
  }

  const gradelevels = ["K-2", "3-5", "6-8", "9-12", "College", "Adult Education"]
  const difficulties = ["Easy", "Medium", "Hard", "Mixed"]
  const timeLimits = ["No limit", "5 minutes", "10 minutes", "15 minutes", "30 minutes", "60 minutes"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Create Quiz
          </DialogTitle>
          <DialogDescription>
            Build an interactive quiz to assess student understanding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quiz Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Quiz Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-title">Quiz Title</Label>
                  <Input
                    id="quiz-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Geography Basics Quiz"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-topic">Topic</Label>
                  <Input
                    id="quiz-topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., European capitals, basic math"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-grade">Grade Level</Label>
                  <Select 
                    value={formData.gradeLevel} 
                    onValueChange={(value) => setFormData({ ...formData, gradeLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradelevels.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-difficulty">Difficulty</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-time">Time Limit</Label>
                  <Select 
                    value={formData.timeLimit} 
                    onValueChange={(value) => setFormData({ ...formData, timeLimit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time limit" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeLimits.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={!formData.title.trim() || !formData.topic.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    Generating questions...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Quiz Questions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                Questions
                <Badge variant="secondary" className="ml-auto">
                  {questions.length} question{questions.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGenerating && (
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground text-center">
                    Creating questions about "{formData.topic}"...
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="pt-4">
                          <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                          <div className="space-y-2">
                            {[1, 2, 3, 4].map((j) => (
                              <div key={j} className="h-3 bg-muted rounded w-1/2" />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {!isGenerating && questions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No questions yet. Generate them above or add manually.</p>
                  <Button 
                    variant="outline" 
                    onClick={handleAddQuestion} 
                    className="mt-4"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Manual Question
                  </Button>
                </div>
              )}

              {!isGenerating && questions.length > 0 && (
                <div className="space-y-4">
                  {questions.map((question, qIndex) => (
                    <Card key={question.id}>
                      <CardContent className="pt-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm text-muted-foreground">
                            Question {qIndex + 1}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(question.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`question-${question.id}`}>Question</Label>
                          <Textarea
                            id={`question-${question.id}`}
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                            placeholder="Enter your question..."
                            rows={2}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label>Answer Options</Label>
                          <div className="grid gap-3">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-3">
                                <Button
                                  variant={question.correctAnswer === optIndex ? "default" : "outline"}
                                  size="sm"
                                  className="h-8 w-8 p-0 shrink-0"
                                  onClick={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                                  aria-label={`Mark option ${optIndex + 1} as correct`}
                                >
                                  {question.correctAnswer === optIndex && (
                                    <CheckCircle className="h-3 w-3" />
                                  )}
                                  {question.correctAnswer !== optIndex && (
                                    <span className="text-xs font-medium">{optIndex + 1}</span>
                                  )}
                                </Button>
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                  placeholder={`Option ${optIndex + 1}...`}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Click the number to mark the correct answer
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`explanation-${question.id}`}>Explanation (Optional)</Label>
                          <Textarea
                            id={`explanation-${question.id}`}
                            value={question.explanation || ""}
                            onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                            placeholder="Explain why this is the correct answer..."
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleAddQuestion} 
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Another Question
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1" disabled={questions.length === 0}>
              Save Quiz
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
          
          <Badge variant="outline" className="w-fit">
            UI Demo - No actual quiz generation or saving
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  )
}