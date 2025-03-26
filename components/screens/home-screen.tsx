"use client"

import { useEffect, useState } from "react"
import { SearchBar } from "../ui/search-bar"
import { PropertyFilters } from "../property-filters"
import { PropertyGrid } from "../property-grid"
import { BottomNavigation } from "../bottom-navigation"
import { Button } from "../ui/button"
import { LoaderCircle, Plus } from "lucide-react"
import { AddPropertyScreen } from "./add-property-screen"
import { useDisplayContext } from "@/contexts/Display"
import { useDataContext } from "@/contexts/Data"
import type { Filters } from "@/types"
import Header from "../header"
import EmptyScreen from "./empty-screen"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface HomeProps {
  initialFilters?: Filters
}

export function HomeScreen({ initialFilters }: HomeProps) {
  const { setDisplay, showAddPropertyButton, setShowAddPropertyButton } = useDisplayContext()
  const { properties, getProperties, addSearchAlert, isLoading } = useDataContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [propertiesLoading, setPropertiesLoading] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Initialize filters with default values
  const [filters, setFilters] = useState<Filters>(initialFilters ? initialFilters : {
    listingType: "all",
    priceRange: [0, 100000000],
    propertyType: [],
    bedrooms: "",
    bathrooms: "",
    size: [0, 10000],
    amenities: [],
    garageSpaces: "",
    locality: [],
  })

  useEffect(()=>{
    if(initialFilters){
      getProperties(window.Telegram.WebApp.initData, initialFilters)
      setFilters(initialFilters)
    }

  }, [initialFilters])

  const handleAddProperty = () => {
    setDisplay(<AddPropertyScreen />)
    setShowAddPropertyButton(false)
  }

  const handleApplyFilters = async (newFilters: Filters) => {
    setFilters(newFilters)
    setFiltersVisible(false)
    setShowAddPropertyButton(true)
    setPropertiesLoading(true)
    setCurrentPage(1) // Reset to first page when applying new filters

    try {
      await getProperties(window.Telegram.WebApp.initData, newFilters, currentPage, itemsPerPage)
      // If your API returns total count or pages, update totalPages here
      // For example: setTotalPages(response.totalPages);
      if (properties) {
        // This is a fallback if the API doesn't return total pages
        // Adjust this calculation based on your actual data structure
        setTotalPages(Math.ceil(properties.length / itemsPerPage))
      }
    } catch (error) {
      console.error(error)
    }

    setPropertiesLoading(false)
  }

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages) return

    setCurrentPage(page)
    setPropertiesLoading(true)

    try {
      await getProperties(window.Telegram.WebApp.initData, filters, page, itemsPerPage)
    } catch (error) {
      console.error(error)
    }

    setPropertiesLoading(false)
  }


  if (propertiesLoading || isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-auto pb-16">
          <Header title="Favourites" />

          <div className="p-4">
            <EmptyScreen
              icon={<LoaderCircle className="loader-circle h-6 w-6 text-muted-foreground" />}
              title="Loading properties"
              description="Please wait while we load the properties"
            />
          </div>
        </div>
      </div>
    )
  }

  const handleResetFilters = () => {
    setFilters({
      listingType: "all",
      priceRange: [0, 100000000],
      propertyType: [],
      bedrooms: "",
      bathrooms: "",
      garageSpaces: "",
      size: [0, 10000],
      amenities: [],
      locality: [],
    })
    setCurrentPage(1) // Reset to first page when resetting filters
  }

  const handleCloseFilters = () => {
    setFiltersVisible(false)
    setShowAddPropertyButton(true)
  }

  const handleFilterClick = () => {
    setFiltersVisible(!filtersVisible)
    setShowAddPropertyButton(!showAddPropertyButton)
  }

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = []

    // For small number of pages, show all
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // For larger number of pages, show current, first, last, and neighbors

      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(1)
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      )

      // Show ellipsis if current page is not near the beginning
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <span className="px-4">...</span>
          </PaginationItem>,
        )
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        if (i <= 1 || i >= totalPages) continue // Skip first and last pages as they're handled separately
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      // Show ellipsis if current page is not near the end
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <span className="px-4">...</span>
          </PaginationItem>,
        )
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(totalPages)
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <div className="sticky top-0 z-10 bg-blue shadow-sm">
          {properties ? (
            <div className="p-4">
              <SearchBar value={searchQuery} onChange={setSearchQuery} onFilterClick={handleFilterClick} />
            </div>
          ) : (
            <Header title="Search for properties" />
          )}
          {(filtersVisible || !properties) && (
            <PropertyFilters
              onClose={handleCloseFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              initialFilters={filters}
            />
          )}
        </div>
        {!filtersVisible && (
          <div className="p-4">
            <PropertyGrid properties={properties!} />

            {/* Pagination component */}
            {properties && properties.length > 0 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddPropertyButton && (
        <div className="fixed bottom-[75px] right-4 z-20">
          <Button
            className="rounded-full w-14 h-14 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
            onClick={handleAddProperty}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}

