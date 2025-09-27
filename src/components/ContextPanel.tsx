"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Lightbulb, Keyboard } from "lucide-react"
import { type UserRole } from "@/components/Header"

interface ContextPanelProps {
  currentRole: UserRole
}

export function ContextPanel({ currentRole }: ContextPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Thread Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Thread Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Messages:</span>
              <Badge variant="secondary">2</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mode:</span>
              <Badge variant="outline" className="capitalize">{currentRole}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Started:</span>
              <span className="text-xs">Just now</span>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              {currentRole === "teach" ? "Teaching Tips" : "Learning Tips"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentRole === "teach" ? (
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  • Use the feature menu to create roadmaps and quizzes
                </p>
                <p className="text-muted-foreground">
                  • Break down complex topics into smaller steps
                </p>
                <p className="text-muted-foreground">
                  • Encourage questions and provide examples
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  • Ask specific questions about topics you want to understand
                </p>
                <p className="text-muted-foreground">
                  • Use the visualization tool for complex concepts
                </p>
                <p className="text-muted-foreground">
                  • Take quizzes to test your understanding
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Focus input</span>
                <Badge variant="outline" className="font-mono text-xs">Ctrl+/</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Send message</span>
                <Badge variant="outline" className="font-mono text-xs">Ctrl+↵</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Feature menu</span>
                <Badge variant="outline" className="font-mono text-xs">Ctrl+K</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Switch role</span>
                <Badge variant="outline" className="font-mono text-xs">Alt+T/L</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Interface Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <span className="text-muted-foreground">AI Integration Pending</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}