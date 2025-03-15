import type React from "react"
import Head from "next/head"

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export function Layout({ children, title = "Real Estate Finder" }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Find your perfect property to buy or rent" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  )
}

