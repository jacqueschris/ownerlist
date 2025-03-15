"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type TelegramWebApp = {
  ready: () => void
  expand: () => void
  close: () => void
  MainButton: {
    text: string
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    enable: () => void
    disable: () => void
  }
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
    }
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

type TelegramContextType = {
  webApp: TelegramWebApp | null
  user: {
    id: number
    first_name: string
    last_name?: string
    username?: string
  } | null
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
})

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramContextType["user"]>(null)

  useEffect(() => {
    if (window.Telegram) {
      const tgWebApp = window.Telegram.WebApp
      setWebApp(tgWebApp)
      tgWebApp.ready()
      tgWebApp.expand()

      if (tgWebApp.initDataUnsafe.user) {
        setUser(tgWebApp.initDataUnsafe.user)
      }
    }
  }, [])

  return <TelegramContext.Provider value={{ webApp, user }}>{children}</TelegramContext.Provider>
}

export function useTelegram() {
  return useContext(TelegramContext)
}

