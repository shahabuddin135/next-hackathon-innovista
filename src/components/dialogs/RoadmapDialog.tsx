"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Plus, X, Calendar, BookOpen, Target } from "lucide-react"

interface RoadmapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoadmapDialog({ open, onOpenChange }: RoadmapDialogProps) {
  const [formData, setFormData] = useState({
    courseName: "",
    unitTitle: "",
    duration: "",
    description: "",
    gradeLevel: "",
    subject: ""
  })
  
  const [milestones, setMilestones] = useState<Array<{
    id: string
    title: string
    week: number
    description: string
  }>>([])

  const [isGenerating, setIsGenerating] = useState(false)

  const handleAddMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      title: "",
      week: milestones.length + 1,
      description: ""
    }
    setMilestones([...milestones, newMilestone])
  }

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id))
  }

  const updateMilestone = (id: string, field: string, value: string | number) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  const handleGenerate = async () => {
    if (!formData.courseName.trim() || !formData.unitTitle.trim()) return
    
    setIsGenerating(true)
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Add sample milestones
    const sampleMilestones = [
      {
        id: "1",
        title: "Introduction & Foundations",
        week: 1,
        description: "Cover basic concepts and set learning expectations"
      },
      {
        id: "2", 
        title: "Core Concepts Deep Dive",
        week: 2,
        description: "Explore the main topics in detail with examples"
      },
      {
        id: "3",
        title: "Practical Application",
        week: 3,
        description: "Apply learned concepts through hands-on exercises"
      }
    ]
    
    setMilestones(sampleMilestones)
    setIsGenerating(false)
  }

  const handleSave = () => {
    console.log("Roadmap data:", { formData, milestones })
    // Future: wire to FastAPI endpoint
    onOpenChange(false)
  }

  const gradelevels = ["K-2", "3-5", "6-8", "9-12", "College", "Adult Education"]
  const subjects = ["Mathematics", "Science", "English", "History", "Computer Science", "Art", "Music", "Other"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Create Learning Roadmap
          </DialogTitle>
          <DialogDescription>
            Design a structured learning pathway with milestones and timelines for your students.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-name">Course Name</Label>
                  <Input
                    id="course-name"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    placeholder="e.g., Introduction to Algebra"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-title">Unit/Module Title</Label>
                  <Input
                    id="unit-title"
                    value={formData.unitTitle}
                    onChange={(e) => setFormData({ ...formData, unitTitle: e.target.value })}
                    placeholder="e.g., Linear Equations"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Select 
                    value={formData.duration} 
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1} week{i !== 0 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade-level">Grade Level</Label>
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
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what students will learn..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={!formData.courseName.trim() || !formData.unitTitle.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    Generating milestones...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Generate Learning Milestones
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Learning Milestones */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Learning Milestones
                <Badge variant="secondary" className="ml-auto">
                  {milestones.length} milestone{milestones.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No milestones yet. Generate them above or add manually.</p>
                  <Button 
                    variant="outline" 
                    onClick={handleAddMilestone} 
                    className="mt-4"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Manual Milestone
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <Card key={milestone.id} className="relative">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`week-${milestone.id}`}>Week</Label>
                            <Input
                              id={`week-${milestone.id}`}
                              type="number"
                              min="1"
                              value={milestone.week}
                              onChange={(e) => updateMilestone(milestone.id, 'week', parseInt(e.target.value))}
                            />
                          </div>
                          <div className="md:col-span-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`title-${milestone.id}`}>Title</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMilestone(milestone.id)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <Input
                              id={`title-${milestone.id}`}
                              value={milestone.title}
                              onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                              placeholder="Milestone title..."
                            />
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          <Label htmlFor={`desc-${milestone.id}`}>Description</Label>
                          <Textarea
                            id={`desc-${milestone.id}`}
                            value={milestone.description}
                            onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                            placeholder="What will students learn or accomplish in this milestone?"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleAddMilestone} 
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Another Milestone
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Roadmap
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
          
          <Badge variant="outline" className="w-fit">
            UI Demo - No actual roadmap generation or saving
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  )
}