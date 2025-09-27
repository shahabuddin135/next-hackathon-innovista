"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Eye,
  Brain,
  Map,
  GraduationCap,
  Command
} from "lucide-react"
import { type UserRole } from "@/components/Header"

interface FeatureMenuProps {
  currentRole: UserRole
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onFeatureSelect: (featureId: string) => void
}

export function FeatureMenu({
  currentRole,
  isOpen,
  onOpenChange,
  onFeatureSelect
}: FeatureMenuProps) {
  const handleFeatureSelect = (featureId: string) => {
    onFeatureSelect(featureId)
    onOpenChange(false)
  }

  const sharedFeatures = [
    {
      id: "online-search",
      label: "Online Search",
      description: "Search the web for information",
      icon: Search,
      shortcut: "Ctrl+1"
    },
    {
      id: "visualize",
      label: "Visualize Concept",
      description: "Create visual representations",
      icon: Eye,
      shortcut: "Ctrl+2"
    },
    {
      id: "quiz",
      label: currentRole === "teach" ? "Make Quiz" : "Take Quiz",
      description: currentRole === "teach" 
        ? "Create interactive quizzes" 
        : "Test your understanding",
      icon: Brain,
      shortcut: "Ctrl+3"
    }
  ]

  const teacherOnlyFeatures = [
    {
      id: "make-roadmap",
      label: "Make Roadmap",
      description: "Create learning pathways",
      icon: Map,
      shortcut: "Ctrl+4"
    }
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 h-10"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="Feature menu"
        >
          <Command className="h-4 w-4" />
          <span>Choose a feature to enhance your message</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            Ctrl+K
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80"
        align="start"
        sideOffset={4}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Available Features
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Shared Features */}
        {sharedFeatures.map((feature) => {
          const IconComponent = feature.icon
          return (
            <DropdownMenuItem
              key={feature.id}
              onClick={() => handleFeatureSelect(feature.id)}
              className="flex items-start gap-3 p-3 cursor-pointer"
            >
              <IconComponent className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{feature.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {feature.shortcut}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </DropdownMenuItem>
          )
        })}

        {/* Teacher-only Features */}
        {currentRole === "teach" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teacher Tools
            </DropdownMenuLabel>
            {teacherOnlyFeatures.map((feature) => {
              const IconComponent = feature.icon
              return (
                <DropdownMenuItem
                  key={feature.id}
                  onClick={() => handleFeatureSelect(feature.id)}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                >
                  <IconComponent className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{feature.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {feature.shortcut}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </DropdownMenuItem>
              )
            })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}