"use client"

import { useEffect, useMemo, useRef, useState } from "react"

export type NetworkStats = {
  downlinkMbps: number | null
  effectiveType: string | null
  rttMs: number | null
  lastUpdated: number | null
}

const PING_URL = "/favicon.ico"

export function useNetworkInfo(pingIntervalMs = 15000) {
  const [stats, setStats] = useState<NetworkStats>({
    downlinkMbps: null,
    effectiveType: null,
    rttMs: null,
    lastUpdated: null,
  })
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const updateFromNavigator = () => {
    // @ts-ignore - Network Information API is experimental
    const conn: any = typeof navigator !== "undefined" ? navigator.connection || navigator.webkitConnection || navigator.mozConnection : null
    if (conn) {
      setStats((s) => ({
        ...s,
        downlinkMbps: typeof conn.downlink === "number" ? conn.downlink : s.downlinkMbps,
        effectiveType: conn.effectiveType ?? s.effectiveType,
        rttMs: typeof conn.rtt === "number" ? conn.rtt : s.rttMs,
        lastUpdated: Date.now(),
      }))
    }
  }

  const ping = async () => {
    const start = performance.now()
    try {
      await fetch(`${PING_URL}?t=${Date.now()}`, { cache: "no-store" })
      const rtt = performance.now() - start
      setStats((s) => ({
        ...s,
        rttMs: Math.round(rtt),
        lastUpdated: Date.now(),
      }))
    } catch (_) {
      // ignore
    }
  }

  useEffect(() => {
    updateFromNavigator()
    ping()

    // @ts-ignore
    const conn: any = typeof navigator !== "undefined" ? navigator.connection || navigator.webkitConnection || navigator.mozConnection : null
    const onChange = () => updateFromNavigator()
    if (conn && conn.addEventListener) conn.addEventListener("change", onChange)

    timerRef.current = setInterval(() => {
      updateFromNavigator()
      ping()
    }, pingIntervalMs) as unknown as NodeJS.Timeout

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (conn && conn.removeEventListener) conn.removeEventListener("change", onChange)
    }
  }, [pingIntervalMs])

  const quality = useMemo<"good" | "ok" | "poor" | "unknown">(() => {
    if (stats.downlinkMbps == null && stats.rttMs == null) return "unknown"
    const d = stats.downlinkMbps ?? 0
    const r = stats.rttMs ?? 999
    if (d >= 20 && r <= 80) return "good"
    if (d >= 5 && r <= 200) return "ok"
    return "poor"
  }, [stats.downlinkMbps, stats.rttMs])

  return { ...stats, quality }
}