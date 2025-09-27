"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FeatureMenu } from "@/components/FeatureMenu"
import { Send, Command } from "lucide-react"
import { type UserRole } from "@/components/Header"

interface ChatComposerProps {
  currentRole: UserRole
  onSendMessage: (message: string) => void
  onFeatureSelect: (featureId: string) => void
  onRoleChange?: (role: UserRole) => void
}

export function ChatComposer({ 
  currentRole, 
  onSendMessage, 
  onFeatureSelect,
  onRoleChange 
}: ChatComposerProps) {
  const [message, setMessage] = useState("")
  const [isFeatureMenuOpen, setIsFeatureMenuOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleSubmit(e)
    }
    
    // Ctrl/Cmd + K to open feature menu
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      setIsFeatureMenuOpen(true)
    }
  }

  // Focus input with Ctrl+/
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault()
        textareaRef.current?.focus()
      }
      
      // Alt+T for Teacher, Alt+L for Learner
      if (e.altKey) {
        if (e.key === "t" || e.key === "T") {
          e.preventDefault()
          onRoleChange?.("teach")
        } else if (e.key === "l" || e.key === "L") {
          e.preventDefault()
          onRoleChange?.("learn")
        }
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [onRoleChange])

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentRole === "teach" 
                  ? "Share your knowledge or create content..." 
                  : "Ask a question or describe what you'd like to learn..."
              }
              className="min-h-[44px] max-h-32 resize-none pr-12"
              rows={1}
              style={{
                height: "44px",
                overflow: "hidden"
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = "44px"
                target.style.height = Math.min(target.scrollHeight, 128) + "px"
              }}
              aria-label="Type your message"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-6 w-6 p-0"
              onClick={() => setIsFeatureMenuOpen(true)}
              aria-label="Open feature menu (Ctrl+K)"
            >
              <Command className="h-3 w-3" />
            </Button>
          </div>

          <Button 
            type="submit" 
            disabled={!message.trim()}
            className="h-11 px-4"
            aria-label="Send message (Ctrl+Enter)"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Feature Menu */}
      <FeatureMenu
        currentRole={currentRole}
        isOpen={isFeatureMenuOpen}
        onOpenChange={setIsFeatureMenuOpen}
        onFeatureSelect={onFeatureSelect}
      />

      {/* Keyboard hint */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>
            Press <kbd className="px-1 py-0.5 bg-muted rounded font-mono">Ctrl+Enter</kbd> to send
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-muted rounded font-mono">Ctrl+K</kbd> for features
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span>Role shortcuts:</span>
          <kbd className="px-1 py-0.5 bg-muted rounded font-mono">Alt+T</kbd>
          <kbd className="px-1 py-0.5 bg-muted rounded font-mono">Alt+L</kbd>
        </div>
      </div>
    </div>
  )
}