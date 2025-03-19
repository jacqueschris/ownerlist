"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import type { Property } from "@/types/index"

interface PropertyBookingProps {
  property: Property
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  selectedTimeSlot: { start: string; end: string } | null
  setSelectedTimeSlot: (slot: { start: string; end: string } | null) => void
  getAvailableTimeSlots: (date: Date | undefined) => { start: string; end: string }[]
  handleBookViewing: () => Promise<void>
}

export function PropertyBooking({
  property,
  date,
  setDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  getAvailableTimeSlots,
  handleBookViewing,
}: PropertyBookingProps) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-4">Book a Viewing</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => {
          setDate(newDate)
          setSelectedTimeSlot(null)
        }}
        className="rounded-md border"
        disabled={(date) => {
          // Check if date is in the past (before today)
          const today = new Date()
          today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison

          if (date < today) return true

          if (!property.availabilitySchedule) return false

          const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          const dayOfWeek = daysOfWeek[date.getDay()]

          return !property.availabilitySchedule.some((availability) => availability.day === dayOfWeek)
        }}
      />

      {date && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Available Time Slots</h4>
          <div className="grid grid-cols-2 gap-2">
            {getAvailableTimeSlots(date).length > 0 ? (
              getAvailableTimeSlots(date).map((slot, index) => (
                <Button
                  key={index}
                  variant={selectedTimeSlot === slot ? "default" : "outline"}
                  className={`text-sm ${selectedTimeSlot === slot ? "bg-blue text-yellow hover:bg-blue hover:text-white" : ""}`}
                  onClick={() => setSelectedTimeSlot(slot)}
                >
                  {slot.start} - {slot.end}
                </Button>
              ))
            ) : (
              <p className="col-span-2 text-sm text-gray-500">No time slots available for this date.</p>
            )}
          </div>
        </div>
      )}

      <Button
        className="w-full mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
        disabled={!date || !selectedTimeSlot}
        onClick={handleBookViewing}
      >
        <CalendarIcon className="h-4 w-4 mr-2" />
        Request Viewing
      </Button>
    </div>
  )
}

