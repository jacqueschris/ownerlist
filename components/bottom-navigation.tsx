"use client"

import { Home, Heart, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"

export function BottomNavigation() {
  const router = useRouter()

  const isActive = (path: string) => {
    return router.pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2B2D42] border-t border-gray-700 z-10">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center justify-center w-full">
          <Home className={`h-6 w-6 ${isActive("/") ? "text-[#F8F32B]" : "text-white"}`} />
          <span className={`text-xs mt-1 ${isActive("/") ? "text-[#F8F32B]" : "text-white"}`}>Home</span>
        </Link>
        <Link href="/favorites" className="flex flex-col items-center justify-center w-full">
          <Heart className={`h-6 w-6 ${isActive("/favorites") ? "text-[#F8F32B]" : "text-white"}`} />
          <span className={`text-xs mt-1 ${isActive("/favorites") ? "text-[#F8F32B]" : "text-white"}`}>Favorites</span>
        </Link>
        <Link href="/viewings" className="flex flex-col items-center justify-center w-full">
          <Calendar className={`h-6 w-6 ${isActive("/viewings") ? "text-[#F8F32B]" : "text-white"}`} />
          <span className={`text-xs mt-1 ${isActive("/viewings") ? "text-[#F8F32B]" : "text-white"}`}>Viewings</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center w-full">
          <User className={`h-6 w-6 ${isActive("/profile") ? "text-[#F8F32B]" : "text-white"}`} />
          <span className={`text-xs mt-1 ${isActive("/profile") ? "text-[#F8F32B]" : "text-white"}`}>Profile</span>
        </Link>
      </div>
    </div>
  )
}

