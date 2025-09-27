"use client"

export type LogLevel = "info" | "warn" | "error" | "debug"

export type AppEvent = {
  id: string
  ts: number
  scope?: string // e.g., "visualize", "network", "chat"
  level: LogLevel
  message: string
  data?: unknown
}

type Listener = (evt: AppEvent) => void

class EventBus {
  private listeners = new Set<Listener>()

  subscribe(fn: Listener) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  emit(evt: Omit<AppEvent, "id" | "ts"> & { id?: string; ts?: number }) {
    const payload: AppEvent = {
      id: evt.id ?? Math.random().toString(36).slice(2),
      ts: evt.ts ?? Date.now(),
      scope: evt.scope,
      level: evt.level,
      message: evt.message,
      data: evt.data,
    }
    this.listeners.forEach((l) => l(payload))
  }
}

export const eventBus = new EventBus()