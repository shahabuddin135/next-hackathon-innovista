"use client"

import { useEffect, useState } from "react"
import { ChatMessages } from "@/components/ChatMessages"
import { ChatComposer } from "@/components/ChatComposer"
import { ContextPanel } from "@/components/ContextPanel"
import { FeatureTabs } from "@/components/FeatureTabs"
import { type UserRole } from "@/components/Header"
import { eventBus } from "@/lib/events/eventBus"

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function ChatInterface() {
  const [currentRole, setCurrentRole] = useState<UserRole>("learn")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm here to help you learn. What would you like to explore today?",
      role: "assistant",
      timestamp: new Date(Date.now() - 120000) // 2 minutes ago
    }
  ])

  useEffect(() => {
    // Listen for header role changes (message pattern: "role:teach" | "role:learn")
    const unsubscribe = eventBus.subscribe((evt) => {
      if (evt.scope === "role" && typeof evt.message === "string" && evt.message.startsWith("role:")) {
        const role = evt.message.split(":")[1] as UserRole
        if (role === "teach" || role === "learn") setCurrentRole(role)
      }
    })
    return unsubscribe
  }, [])

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    
    // Simulate assistant response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your message! This is a UI demo, so I can't provide real responses yet. The interface is ready for integration with FastAPI backend services.",
        role: "assistant",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  const handleFeatureSelect = (featureId: string) => {
    console.log("Feature selected:", featureId)
    // Future: wire to FastAPI endpoints
  }

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role)
  }

  return (
    <div id="main-content" className="flex-1 flex flex-col">
      <div className="flex-1 flex">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 flex">
            <div className="flex-1 min-w-0">
              <ChatMessages messages={messages} />
            </div>
            
            {/* Context Panel - hidden on mobile */}
            <div className="hidden lg:block w-80 border-l border-border">
              <ContextPanel currentRole={currentRole} />
            </div>
          </div>

          {/* Chat Composer */}
          <div className="border-t border-border bg-background/95 backdrop-blur">
            <div className="p-4">
              <ChatComposer
                currentRole={currentRole}
                onSendMessage={handleSendMessage}
                onFeatureSelect={handleFeatureSelect}
                onRoleChange={handleRoleChange}
              />
            </div>
          </div>

          {/* Feature Tabs */}
          <FeatureTabs currentRole={currentRole} />
        </div>
      </div>
    </div>
  )
}