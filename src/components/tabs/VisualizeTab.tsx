"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Palette, Download, Share } from "lucide-react"
import * as d3 from "d3"
import { eventBus } from "@/lib/events/eventBus"

export function VisualizeTab() {
  const [concept, setConcept] = useState("")
  const [visualType, setVisualType] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const vizRef = useRef<HTMLDivElement | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!concept.trim() || !visualType) return

    setIsGenerating(true)
    eventBus.emit({
      scope: "visualize",
      level: "info",
      message: `Starting visualization for "${concept}" as ${visualType}`,
      data: { concept, visualType }
    })
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    eventBus.emit({
      scope: "visualize",
      level: "debug",
      message: `Generation complete. Rendering D3 preview...`
    })
  }

  const visualTypes = [
    { value: "mindmap", label: "Mind Map" },
    { value: "flowchart", label: "Flowchart" },
    { value: "diagram", label: "Concept Diagram" },
    { value: "timeline", label: "Timeline" },
    { value: "hierarchy", label: "Hierarchy Chart" },
    { value: "process", label: "Process Flow" }
  ]

  // Render a minimal tree using d3 when we have inputs and not generating
  useEffect(() => {
    const container = vizRef.current
    if (!container) return
    // Clear previous svg
    container.innerHTML = ""

    if (!concept || !visualType || isGenerating) return

    try {
      // Build simple hierarchy: concept as root and top 3 keywords as children
      const words = concept.split(/[,;\-–—]|\s+/).filter(Boolean)
      const children = Array.from(new Set(words.map(w => w.trim()))).filter(w => w.toLowerCase() !== concept.toLowerCase()).slice(0, 6)
      const data = {
        name: concept,
        children: children.map((c) => ({ name: c }))
      }

      const width = container.clientWidth || 600
      const height = 260
      const margin = { top: 20, right: 40, bottom: 20, left: 40 }

      const root = d3.hierarchy<any>(data)
      const treeLayout = d3.tree<any>().size([width - margin.left - margin.right, height - margin.top - margin.bottom])
      const treeData = treeLayout(root)

      const svg = d3
        .select(container)
        .append("svg")
        .attr("role", "img")
        .attr("aria-label", `D3 ${visualType} preview for ${concept}`)
        .attr("width", width)
        .attr("height", height)
        .attr("class", "rounded-md bg-muted/30 border")

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      // Links
      g
        .selectAll("path.link")
        .data(treeData.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.25)
        .attr("d", d3.linkVertical<any, any>()
          .x((d: any) => d.x)
          .y((d: any) => d.y)
        )

      // Nodes
      const node = g
        .selectAll("g.node")
        .data(treeData.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`)

      node
        .append("circle")
        .attr("r", (d: any) => (d.depth === 0 ? 8 : 5))
        .attr("fill", (d: any) => (d.depth === 0 ? "#6d28d9" : "#0ea5e9"))
        .attr("opacity", 0.85)

      node
        .append("text")
        .attr("dy", -10)
        .attr("text-anchor", "middle")
        .attr("class", "text-xs fill-current")
        .text((d: any) => d.data.name)

      eventBus.emit({
        scope: "visualize",
        level: "info",
        message: `Rendered D3 ${visualType} preview with ${children.length} nodes`,
        data: { width, height, concept, children }
      })
    } catch (err) {
      eventBus.emit({
        scope: "visualize",
        level: "error",
        message: "Failed to render D3 visualization",
        data: String(err)
      })
    }
  }, [concept, visualType, isGenerating])

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
                D3 Preview - Demo only
              </Badge>
              <div ref={vizRef} className="rounded-lg h-64 w-full overflow-hidden" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  try {
                    const node = vizRef.current?.querySelector("svg")
                    if (!node) return
                    const serializer = new XMLSerializer()
                    const svgStr = serializer.serializeToString(node)
                    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `visualization-${visualType}.svg`
                    a.click()
                    URL.revokeObjectURL(url)
                    eventBus.emit({ scope: "visualize", level: "info", message: "Exported SVG visualization" })
                  } catch (err) {
                    eventBus.emit({ scope: "visualize", level: "error", message: "Failed to export SVG", data: String(err) })
                  }
                }}>
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  eventBus.emit({ scope: "visualize", level: "debug", message: "Share clicked (stub)" })
                }}>
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