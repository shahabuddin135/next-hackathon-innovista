"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessageCard } from "@/components/ChatMessageCard"
import { type Message } from "@/components/ChatInterface"

interface ChatMessagesProps {
  messages: Message[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-4 py-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Welcome to EduChat</p>
              <p className="text-sm">Start a conversation to begin learning or teaching.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageCard key={message.id} message={message} />
          ))
        )}
      </div>
    </ScrollArea>
  )
}