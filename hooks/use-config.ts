"use client"

import * as React from "react"

export type Config = {
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
  installationType: "cli" | "manual"
}

const STORAGE_KEY = "config"

const DEFAULT_CONFIG: Config = {
  packageManager: "bun",
  installationType: "cli",
}

const listeners = new Set<() => void>()
let config: Config = DEFAULT_CONFIG
let hydrated = false

function readStorage(): Config {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG
  } catch {
    return DEFAULT_CONFIG
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): Config {
  if (!hydrated) {
    config = readStorage()
    hydrated = true
  }
  return config
}

function getServerSnapshot(): Config {
  return DEFAULT_CONFIG
}

export function setConfig(next: Config) {
  config = next
  hydrated = true
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Ignore private-mode/storage failures; state still updates in memory.
  }
  listeners.forEach((listener) => listener())
}

export function useConfig() {
  const value = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  return [value, setConfig] as const
}
