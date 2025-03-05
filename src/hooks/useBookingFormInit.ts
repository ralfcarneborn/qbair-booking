import { useMemo } from "react"
import { UseFormReturn } from "react-hook-form"
import { BookingFormValues } from "@/types/FormTypes"
import { validateAirportParam, validateTripType } from "@/utils/urlParamUtils"
import { parseDate } from "@/utils/dateUtils"
import { useEffect } from "react"

export const useInitialFormValues = (
  params: URLSearchParams,
  validateAirport: (airportId: string | null) => boolean,
  setParseErrors: (cb: (prev: Record<string, string>) => Record<string, string>) => void
) => {
  return useMemo(() => {
    const originParam = params.get("origin")
    const destinationParam = params.get("destination")
    const tripTypeParam = params.get("tripType")
    
    const isOriginValid = validateAirportParam(originParam, "origin", validateAirport, setParseErrors);
    const isDestinationValid = validateAirportParam(destinationParam, "destination", validateAirport, setParseErrors);
    
    const tripType = validateTripType(tripTypeParam, setParseErrors);
    
    return {
      tripType,
      origin: isOriginValid ? originParam! : "",
      destination: isDestinationValid ? destinationParam! : "",
    }
  }, [params, validateAirport, setParseErrors])
}

export const useDatesFromUrl = (
  form: UseFormReturn<BookingFormValues>,
  params: URLSearchParams,
  setParseErrors: (cb: (prev: Record<string, string>) => Record<string, string>) => void
) => {
  useEffect(() => {
    const setDatesFromUrl = () => {
      try {
        const departureParam = params.get("departure")
        const returnParam = params.get("return")
        
        if (departureParam) {
          const departureDate = parseDate(departureParam, "departure", setParseErrors)
          
          if (departureDate) {
            form.setValue("departureDate", departureDate, { 
              shouldValidate: true,
              shouldDirty: true
            })
          }
        }
        
        if (returnParam) {
          const returnDate = parseDate(returnParam, "return", setParseErrors)
          
          if (returnDate) {
            form.setValue("returnDate", returnDate, { 
              shouldValidate: true,
              shouldDirty: true
            })
            
            form.setValue("tripType", "round-trip", { 
              shouldValidate: true,
              shouldDirty: true
            })
          }
        }
      } catch (error) {
        console.error("Error setting dates from URL:", error)
      }
    }

    const timer = setTimeout(() => {
      setDatesFromUrl()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [form, params, setParseErrors])
}
