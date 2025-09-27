"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  GraduationCap, 
  BookOpen, 
  Settings, 
  Info,
  Wifi,
  WifiOff,
  RotateCcw
} from "lucide-react"

export type UserRole = "teach" | "learn"
export type ConnectionMode = "online" | "offline" | "auto"

interface HeaderProps {
  onRoleChange?: (role: UserRole) => void
  onModeChange?: (mode: ConnectionMode) => void
}

export function Header({ onRoleChange, onModeChange }: HeaderProps) {
  const pathname = usePathname()
  const [currentRole, setCurrentRole] = useState<UserRole>("learn")
  const [currentMode, setCurrentMode] = useState<ConnectionMode>("auto")

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role)
    onRoleChange?.(role)
  }

  const handleModeChange = (mode: ConnectionMode) => {
    setCurrentMode(mode)
    onModeChange?.(mode)
  }

  const getModeIcon = () => {
    switch (currentMode) {
      case "online":
        return <Wifi className="w-4 h-4" />
      case "offline":
        return <WifiOff className="w-4 h-4" />
      case "auto":
        return <RotateCcw className="w-4 h-4" />
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium z-50"
      >
        Skip to main content
      </a>
      
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/chat" className="mr-4 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              EduChat
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/chat"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/chat" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Chat
            </Link>
            <Link
              href="/settings"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/settings" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Settings
            </Link>
            <Link
              href="/about"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/about" ? "text-foreground" : "text-foreground/60"
              )}
            >
              About
            </Link>
          </nav>
        </div>

        {/* Mobile navigation */}
        <div className="flex md:hidden mr-4">
          <Link href="/chat" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-bold">EduChat</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Role Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Role:</span>
            <div 
              className="inline-flex items-center rounded-md bg-muted p-1"
              role="radiogroup"
              aria-label="Select user role"
            >
              <Button
                variant={currentRole === "teach" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => handleRoleChange("teach")}
                role="radio"
                aria-checked={currentRole === "teach"}
                aria-label="Switch to Teacher mode"
              >
                <GraduationCap className="w-3 h-3 mr-1" />
                Teach
              </Button>
              <Button
                variant={currentRole === "learn" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => handleRoleChange("learn")}
                role="radio"
                aria-checked={currentRole === "learn"}
                aria-label="Switch to Learner mode"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Learn
              </Button>
            </div>
          </div>

          {/* Mode Indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Mode:</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => {
                const modes: ConnectionMode[] = ["auto", "online", "offline"]
                const currentIndex = modes.indexOf(currentMode)
                const nextMode = modes[(currentIndex + 1) % modes.length]
                handleModeChange(nextMode)
              }}
              aria-label={`Current mode: ${currentMode}. Click to cycle through modes`}
            >
              {getModeIcon()}
              <span className="ml-1 capitalize">{currentMode}</span>
            </Button>
          </div>

          {/* Mobile menu icons */}
          <div className="flex md:hidden items-center space-x-2">
            <Link href="/settings" aria-label="Settings">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about" aria-label="About">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Info className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export { type UserRole, type ConnectionMode }