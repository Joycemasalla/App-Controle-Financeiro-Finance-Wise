"use client"

import { useEffect } from "react"
import { syncManager, type SyncEvent } from "@/lib/sync-manager"

export const useSync = (eventType: string, callback: (event: SyncEvent) => void) => {
  useEffect(() => {
    const unsubscribe = syncManager.subscribe(eventType, callback)
    return unsubscribe
  }, [eventType, callback])

  return {
    recordChange: syncManager.recordChange.bind(syncManager),
    isConnected: syncManager.isConnected.bind(syncManager),
  }
}
