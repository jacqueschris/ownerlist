"use client"
import { MultiSelect, type OptionType } from "@/components/ui/multi-select"
import { Label } from "@/components/ui/label"

// Comprehensive list of Malta localities
const maltaLocalities: OptionType[] = [
  // Main Malta localities
  { label: "Attard", value: "attard" },
  { label: "Balzan", value: "balzan" },
  { label: "Birgu (Vittoriosa)", value: "birgu" },
  { label: "Birkirkara", value: "birkirkara" },
  { label: "Birzebbuga", value: "birzebbuga" },
  { label: "Bormla (Cospicua)", value: "bormla" },
  { label: "Dingli", value: "dingli" },
  { label: "Fgura", value: "fgura" },
  { label: "Floriana", value: "floriana" },
  { label: "Gudja", value: "gudja" },
  { label: "Gzira", value: "gzira" },
  { label: "Hamrun", value: "hamrun" },
  { label: "Iklin", value: "iklin" },
  { label: "Isla (Senglea)", value: "isla" },
  { label: "Kalkara", value: "kalkara" },
  { label: "Kirkop", value: "kirkop" },
  { label: "Lija", value: "lija" },
  { label: "Luqa", value: "luqa" },
  { label: "Marsa", value: "marsa" },
  { label: "Marsaskala", value: "marsaskala" },
  { label: "Marsaxlokk", value: "marsaxlokk" },
  { label: "Mdina", value: "mdina" },
  { label: "Mellieha", value: "mellieha" },
  { label: "Mgarr", value: "mgarr" },
  { label: "Mosta", value: "mosta" },
  { label: "Mqabba", value: "mqabba" },
  { label: "Msida", value: "msida" },
  { label: "Mtarfa", value: "mtarfa" },
  { label: "Naxxar", value: "naxxar" },
  { label: "Paola", value: "paola" },
  { label: "Pembroke", value: "pembroke" },
  { label: "Pieta", value: "pieta" },
  { label: "Qormi", value: "qormi" },
  { label: "Qrendi", value: "qrendi" },
  { label: "Rabat", value: "rabat" },
  { label: "Safi", value: "safi" },
  { label: "San Gwann", value: "san-gwann" },
  { label: "Santa Lucija", value: "santa-lucija" },
  { label: "Santa Venera", value: "santa-venera" },
  { label: "Siggiewi", value: "siggiewi" },
  { label: "Sliema", value: "sliema" },
  { label: "St. Julian's", value: "st-julians" },
  { label: "St. Paul's Bay", value: "st-pauls-bay" },
  { label: "Swieqi", value: "swieqi" },
  { label: "Ta' Xbiex", value: "ta-xbiex" },
  { label: "Tarxien", value: "tarxien" },
  { label: "Valletta", value: "valletta" },
  { label: "Xghajra", value: "xghajra" },
  { label: "Zabbar", value: "zabbar" },
  { label: "Zebbug", value: "zebbug" },
  { label: "Zejtun", value: "zejtun" },
  { label: "Zurrieq", value: "zurrieq" },

  // Gozo localities
  { label: "Fontana", value: "gozo-fontana" },
  { label: "Ghajnsielem", value: "gozo-ghajnsielem" },
  { label: "Gharb", value: "gozo-gharb" },
  { label: "Ghasri", value: "gozo-ghasri" },
  { label: "Kercem", value: "gozo-kercem" },
  { label: "Munxar", value: "gozo-munxar" },
  { label: "Nadur", value: "gozo-nadur" },
  { label: "Qala", value: "gozo-qala" },
  { label: "San Lawrenz", value: "gozo-san-lawrenz" },
  { label: "Sannat", value: "gozo-sannat" },
  { label: "Victoria (Rabat)", value: "gozo-victoria" },
  { label: "Xaghra", value: "gozo-xaghra" },
  { label: "Xewkija", value: "gozo-xewkija" },
  { label: "Zebbug", value: "gozo-zebbug" },
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

