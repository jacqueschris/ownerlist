"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onFilterClick: () => void
}

export function SearchBar({ value, onChange, onFilterClick }: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <div className="absolute left-3 text-gray-400">
        <Search className="h-5 w-5" />
      </div>
      <Input
        type="text"
        placeholder="Search properties..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:border-[#F8F32B] focus:ring-[#F8F32B]"
      />
      <Button variant="ghost" size="icon" className="absolute right-1" onClick={onFilterClick}>
        <SlidersHorizontal className="h-5 w-5" />
      </Button>
    </div>
  )
}

