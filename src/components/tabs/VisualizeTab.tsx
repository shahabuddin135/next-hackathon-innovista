"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Palette, Download, Share } from "lucide-react"

export function VisualizeTab() {
  const [concept, setConcept] = useState("")
  const [visualType, setVisualType] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!concept.trim() || !visualType) return

    setIsGenerating(true)
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const visualTypes = [
    { value: "mindmap", label: "Mind Map" },
    { value: "flowchart", label: "Flowchart" },
    { value: "diagram", label: "Concept Diagram" },
    { value: "timeline", label: "Timeline" },
    { value: "hierarchy", label: "Hierarchy Chart" },
    { value: "process", label: "Process Flow" }
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Concept Visualization
        </h3>
        <p className="text-sm text-muted-foreground">
          Create visual representations to better understand complex concepts.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Generate Visualization</CardTitle>
          <CardDescription>
            Describe a concept and choose how you'd like to visualize it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="concept-input" className="text-sm font-medium">
                Concept to visualize
              </label>
              <Input
                id="concept-input"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g., photosynthesis, machine learning process, historical timeline..."
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="visual-type" className="text-sm font-medium">
                Visualization type
              </label>
              <Select value={visualType} onValueChange={setVisualType} disabled={isGenerating}>
                <SelectTrigger id="visual-type">
                  <SelectValue placeholder="Choose visualization style" />
                </SelectTrigger>
                <SelectContent>
                  {visualTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              disabled={!concept.trim() || !visualType || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  Generating visualization...
                </>
              ) : (
                <>
                  <Palette className="h-4 w-4 mr-2" />
                  Generate Visualization
                </>
              )}
            </Button>
          </form>

          {isGenerating && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground text-center">
                Creating your {visualTypes.find(t => t.value === visualType)?.label.toLowerCase()}...
              </div>
              <div className="animate-pulse bg-muted rounded-lg h-48 flex items-center justify-center">
                <Palette className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          )}

          {!isGenerating && concept && visualType && (
            <div className="space-y-3">
              <Badge variant="outline" className="w-fit">
                UI Demo - No actual visualization generated
              </Badge>
              <div className="border-2 border-dashed border-muted rounded-lg h-48 flex items-center justify-center bg-muted/30">
                <div className="text-center space-y-2">
                  <Eye className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Visualization Preview</p>
                  <p className="text-xs text-muted-foreground">
                    {visualTypes.find(t => t.value === visualType)?.label} of "{concept}"
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          )}

          {!concept && !isGenerating && (
            <div className="text-center py-8 space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Eye className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Ready to visualize</p>
                <p className="text-sm text-muted-foreground">
                  Enter a concept and choose a visualization type to get started
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}