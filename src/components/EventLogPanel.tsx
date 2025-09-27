"use client"

import { useEffect, useMemo, useState } from "react"
import { eventBus, type AppEvent } from "@/lib/events/eventBus"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Download, Trash2, ScrollText } from "lucide-react"

function levelClass(level: AppEvent["level"]) {
  switch (level) {
    case "error":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
    case "warn":
      return "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100"
    case "debug":
      return "bg-sky-100 text-sky-900 dark:bg-sky-900/30 dark:text-sky-100"
    default:
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100"
  }
}

export function EventLogButtonWithPanel() {
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState<AppEvent[]>([])

  useEffect(() => {
    const unsub = eventBus.subscribe((evt) => {
      setEvents((prev) => {
        const next = [evt, ...prev]
        return next.slice(0, 200)
      })
    })
    return unsub
  }, [])

  const unreadCount = 0 // could add later

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `event-log-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const grouped = useMemo(() => events, [events])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2" aria-label="Open event log">
          <ScrollText className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="ml-1 h-4 px-1 text-[10px]" variant="secondary">{unreadCount}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[420px] sm:w-[520px] p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>Event Log</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadJson}>
                <Download className="w-3 h-3 mr-1" /> Export
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setEvents([])}>
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-3">
          <ul className="space-y-2">
            {grouped.length === 0 && (
              <li className="text-sm text-muted-foreground px-1 py-6 text-center">No events yet. Interact with the UI to see logs.</li>
            )}
            {grouped.map((e) => (
              <li key={e.id} className="rounded-md border p-2 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={levelClass(e.level)}>{e.level}</Badge>
                    {e.scope && (
                      <Badge variant="outline" className="capitalize">{e.scope}</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {new Date(e.ts).toLocaleTimeString()}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="text-sm whitespace-pre-wrap break-words">{e.message}</div>
                {e.data && (
                  <pre className="mt-2 text-xs bg-muted p-2 rounded-md overflow-auto max-h-40">
                    {JSON.stringify(e.data, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default EventLogButtonWithPanel