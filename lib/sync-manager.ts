// Real-time synchronization manager for multi-device support

export interface SyncEvent {
  type: "transaction" | "reminder" | "loan" | "quick_message"
  action: "create" | "update" | "delete"
  data: any
  timestamp: number
}

class SyncManager {
  private listeners: Map<string, Set<(event: SyncEvent) => void>> = new Map()
  private pendingChanges: SyncEvent[] = []
  private isOnline: boolean = navigator.onLine

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.handleOnline())
      window.addEventListener("offline", () => this.handleOffline())
    }
  }

  private handleOnline() {
    this.isOnline = true
    this.syncPendingChanges()
  }

  private handleOffline() {
    this.isOnline = false
  }

  private async syncPendingChanges() {
    // Sync any pending changes when connection is restored
    while (this.pendingChanges.length > 0) {
      const change = this.pendingChanges.shift()
      if (change) {
        this.emit(change.type, change)
      }
    }
  }

  subscribe(eventType: string, callback: (event: SyncEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(callback)

    return () => {
      this.listeners.get(eventType)?.delete(callback)
    }
  }

  emit(eventType: string, event: SyncEvent) {
    if (!this.isOnline) {
      this.pendingChanges.push(event)
      return
    }

    const callbacks = this.listeners.get(eventType)
    if (callbacks) {
      callbacks.forEach((callback) => callback(event))
    }
  }

  recordChange(type: SyncEvent["type"], action: SyncEvent["action"], data: any) {
    const event: SyncEvent = {
      type,
      action,
      data,
      timestamp: Date.now(),
    }

    this.emit(type, event)
  }

  isConnected(): boolean {
    return this.isOnline
  }
}

export const syncManager = new SyncManager()
