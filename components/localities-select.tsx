"use client"
import { MultiSelect, type OptionType } from "@/components/ui/multi-select"
import { Label } from "@/components/ui/label"

// Comprehensive list of Malta localities
const maltaLocalities: OptionType[] = [
  // Main Malta localities
  { label: "Attard", value: "Attard" },
  { label: "Balzan", value: "Balzan" },
  { label: "Birgu", value: "Birgu" },
  { label: "Birkirkara", value: "Birkirkara" },
  { label: "Birzebbuga", value: "Birzebbuga" },
  { label: "Bormla", value: "Bormla" },
  { label: "Dingli", value: "Dingli" },
  { label: "Fgura", value: "Fgura" },
  { label: "Floriana", value: "Floriana" },
  { label: "Gudja", value: "Gudja" },
  { label: "Gzira", value: "Gzira" },
  { label: "Hamrun", value: "Hamrun" },
  { label: "Iklin", value: "Iklin" },
  { label: "Isla", value: "Isla" },
  { label: "Kalkara", value: "Kalkara" },
  { label: "Kirkop", value: "Kirkop" },
  { label: "Lija", value: "Lija" },
  { label: "Luqa", value: "Luqa" },
  { label: "Marsa", value: "Marsa" },
  { label: "Marsaskala", value: "Marsaskala" },
  { label: "Marsaxlokk", value: "Marsaxlokk" },
  { label: "Mdina", value: "Mdina" },
  { label: "Mellieha", value: "Mellieha" },
  { label: "Mgarr", value: "Mgarr" },
  { label: "Mosta", value: "Mosta" },
  { label: "Mqabba", value: "Mqabba" },
  { label: "Msida", value: "Msida" },
  { label: "Mtarfa", value: "Mtarfa" },
  { label: "Naxxar", value: "Naxxar" },
  { label: "Paola", value: "Paola" },
  { label: "Pembroke", value: "Pembroke" },
  { label: "Pieta", value: "Pieta" },
  { label: "Qormi", value: "Qormi" },
  { label: "Qrendi", value: "Qrendi" },
  { label: "Rabat", value: "Rabat" },
  { label: "Safi", value: "Safi" },
  { label: "San Gwann", value: "San Gwann" },
  { label: "Santa Lucija", value: "Santa Lucija" },
  { label: "Santa Venera", value: "Santa Venera" },
  { label: "Siggiewi", value: "Siggiewi" },
  { label: "Sliema", value: "Sliema" },
  { label: "St. Julian's", value: "St. Julian's" },
  { label: "St. Paul's Bay", value: "St. Paul's Bay" },
  { label: "Swieqi", value: "Swieqi" },
  { label: "Ta' Xbiex", value: "Ta' Xbiex" },
  { label: "Tarxien", value: "Tarxien" },
  { label: "Valletta", value: "Valletta" },
  { label: "Xghajra", value: "Xghajra" },
  { label: "Zabbar", value: "Zabbar" },
  { label: "Zebbug", value: "Zebbug" },
  { label: "Zejtun", value: "Zejtun" },
  { label: "Zurrieq", value: "Zurrieq" },

  // Gozo localities
  { label: "Gozo - Victoria", value: "Gozo - Victoria" },
  { label: "Gozo - Fontana", value: "Gozo - Fontana" },
  { label: "Gozo - Ghajnsielem", value: "Gozo - Ghajnsielem" },
  { label: "Gozo - Gharb", value: "Gozo - Gharb" },
  { label: "Gozo - Ghasri", value: "Gozo - Ghasri" },
  { label: "Gozo - Kercem", value: "Gozo - Kercem" },
  { label: "Gozo - Munxar", value: "Gozo - Munxar" },
  { label: "Gozo - Nadur", value: "Gozo - Nadur" },
  { label: "Gozo - Qala", value: "Gozo - Qala" },
  { label: "Gozo - San Lawrenz", value: "Gozo - San Lawrenz" },
  { label: "Gozo - Sannat", value: "Gozo - Sannat" },
  { label: "Gozo - Xaghra", value: "Gozo - Xaghra" },
  { label: "Gozo - Xewkija", value: "Gozo - Xewkija" },
  { label: "Gozo - Zebbug", value: "Gozo - Zebbug" },
]

interface LocalitiesSelectProps {
  selected: string[]
  onChange: (selected: string[]) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  multiple?: boolean
}

export function LocalitiesSelect({
  selected,
  onChange,
  label = "Localities",
  placeholder = "Select localities...",
  className,
  disabled = false,
  multiple = true,
}: LocalitiesSelectProps) {
  // Handle change based on multiple selection mode
  const handleChange = (newSelected: string[]) => {
    if (!multiple) {
      // If not multiple, just pass through the last selected value
      onChange(newSelected.length > 0 ? [newSelected[newSelected.length - 1]] : [])
    } else {
      // Normal case - just update the selection
      onChange(newSelected)
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <MultiSelect
        options={maltaLocalities}
        selected={selected}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        emptyMessage="No localities found."
        multiple={multiple}
      />
    </div>
  )
}

