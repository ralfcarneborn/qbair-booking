import { useCallback } from "react"
import { BookingFormValues } from "@/types/FormTypes"
import { formatDateForSubmission } from "@/utils/dateUtils"

export function useUrlParams() {
  const updateUrlParams = useCallback((values: BookingFormValues) => {
    const params = new URLSearchParams()
    params.set("tripType", values.tripType)
    
    if (values.origin) {
      params.set("origin", values.origin)
    }
    
    if (values.destination) {
      params.set("destination", values.destination)
    }
    
    const departureDate = formatDateForSubmission(values.departureDate)
    if (departureDate) {
      params.set("departure", departureDate)
    }
    
    if (values.tripType === "round-trip" && values.returnDate) {
      const returnDate = formatDateForSubmission(values.returnDate)
      if (returnDate) {
        params.set("return", returnDate)
      }
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({ path: newUrl }, '', newUrl)
  }, [])

  const clearUrlParams = useCallback(() => {
    window.history.pushState({}, '', window.location.pathname)
  }, [])

  return {
    updateUrlParams,
    clearUrlParams
  }
}
