"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Message } from "@/components/ChatInterface"

interface ChatMessageCardProps {
  message: Message
}

export function ChatMessageCard({ message }: ChatMessageCardProps) {
  const isUser = message.role === "user"
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(date)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  const handleReaction = (type: "like" | "dislike") => {
    console.log(`${type} reaction for message:`, message.id)
    // Future: wire to feedback system
  }

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <Avatar className={cn("h-8 w-8 shrink-0", isUser && "order-last")}>
        <AvatarFallback className={cn(
          "text-xs font-medium",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}>
          {isUser ? "YU" : "AI"}
        </AvatarFallback>
      </Avatar>

      <Card className={cn(
        "max-w-[70%] transition-all hover:shadow-sm",
        isUser 
          ? "bg-primary text-primary-foreground ml-12" 
          : "bg-card mr-12"
      )}>
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-xs font-medium",
                isUser ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {isUser ? "You" : "Assistant"}
              </span>
              <span className={cn(
                "text-xs",
                isUser ? "text-primary-foreground/60" : "text-muted-foreground"
              )}>
                {formatTime(message.timestamp)}
              </span>
            </div>
            
            <p className={cn(
              "text-sm leading-relaxed",
              isUser ? "text-primary-foreground" : "text-foreground"
            )}>
              {message.content}
            </p>

            {!isUser && (
              <div className="flex items-center gap-1 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-secondary"
                  onClick={handleCopy}
                  aria-label="Copy message"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-secondary"
                  onClick={() => handleReaction("like")}
                  aria-label="Like message"
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-secondary"
                  onClick={() => handleReaction("dislike")}
                  aria-label="Dislike message"
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-secondary"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}