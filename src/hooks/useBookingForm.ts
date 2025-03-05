import { useState, useEffect, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, parse } from "date-fns"
import * as z from "zod"

import { airports, TripType } from "@/types/TripTypes"
import { bookingFormSchema, BookingFormValues, FormattedBookingFormValues } from "@/types/FormTypes"

export const isPastDate = (date: Date): boolean => {
  return date < new Date(new Date().setHours(0, 0, 0, 0))
}

export const isBeforeDepartureDate = (date: Date, departureDate: Date | undefined): boolean => {
  return departureDate ? date < departureDate : false
}

export function useBookingForm() {
  const [formData, setFormData] = useState<BookingFormValues | null>(null)
  const [parseErrors, setParseErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  
  const validateAirport = useCallback((airportId: string | null): boolean => {
    return airportId !== null && airports.some(airport => airport.id === airportId)
  }, [])
  
  const initialValues = useMemo(() => {
    const originParam = params.get("origin")
    const destinationParam = params.get("destination")
    const tripTypeParam = params.get("tripType")
    
    const validateAirportParam = (param: string | null, fieldName: string): boolean => {
      if (param && !validateAirport(param)) {
        setParseErrors(prev => ({ 
          ...prev, 
          [fieldName]: `Invalid ${fieldName} airport: ${param}` 
        }))
        return false;
      }
      return param !== null && validateAirport(param);
    };
    
    const isOriginValid = validateAirportParam(originParam, "origin");
    const isDestinationValid = validateAirportParam(destinationParam, "destination");
    
    const validateTripType = (param: string | null): TripType => {
      const validTripTypes: TripType[] = ["one-way", "round-trip"];
      const defaultTripType: TripType = "one-way";
      
      if (!param) return defaultTripType;
      
      if (validTripTypes.includes(param as TripType)) {
        return param as TripType;
      } else {
        setParseErrors(prev => ({ 
          ...prev, 
          tripType: `Invalid trip type: ${param}. Must be "one-way" or "round-trip".` 
        }));
        return defaultTripType;
      }
    };
    
    const tripType = validateTripType(tripTypeParam);
    
    return {
      tripType,
      origin: isOriginValid ? originParam! : "",
      destination: isDestinationValid ? destinationParam! : "",
    }
  }, [params, validateAirport])
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  })
  
  const tripType = form.watch("tripType")

  const parseDate = useCallback((dateString: string | null, paramName: string): Date | null => {
    if (!dateString) return null
    
    try {
      let date = new Date(dateString)
      
      if (isNaN(date.getTime())) {
        try {
          date = parse(dateString, "yyyy-MM-dd", new Date())
        } catch (e) {
          throw new Error(`Invalid date format: ${dateString}`)
        }
      }
      
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format: ${dateString}`)
      }
      
      return date
    } catch (error) {
      if (error instanceof Error) {
        setParseErrors(prev => ({ 
          ...prev, 
          [paramName]: `Failed to parse ${paramName}: ${error.message}` 
        }))
        console.warn(`Failed to parse ${paramName}:`, error)
      }
      return null
    }
  }, [])

  useEffect(() => {
    const setDatesFromUrl = () => {
      try {
        const departureParam = params.get("departure")
        const returnParam = params.get("return")
        
        if (departureParam) {
          const departureDate = parseDate(departureParam, "departure")
          
          if (departureDate) {
            form.setValue("departureDate", departureDate, { 
              shouldValidate: true,
              shouldDirty: true
            })
          }
        }
        
        if (returnParam) {
          const returnDate = parseDate(returnParam, "return")
          
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
  }, [form, parseDate, params])

  const isDepartureDateDisabled = useCallback((date: Date): boolean => {
    return isPastDate(date)
  }, [])

  const isReturnDateDisabled = useCallback((date: Date): boolean => {
    const departureDate = form.getValues("departureDate")
    return isPastDate(date) || isBeforeDepartureDate(date, departureDate)
  }, [form])

  const resetForm = useCallback(() => {
    form.reset({
      tripType: "one-way",
      origin: "",
      destination: "",
      departureDate: undefined,
      returnDate: undefined
    })
    setFormData(null)
    setParseErrors({})
  }, [form])

  const onSubmit = useCallback(async (values: BookingFormValues) => {
    console.log("onsubmit:", values)
    try {
      setIsSubmitting(true)
      
      const result = await form.trigger()
      
      if (!result) {
        console.error("Validation failed:", form.formState.errors)
        return
      }
      
      const formattedValues: FormattedBookingFormValues = {
        ...values,
        departureDate: format(values.departureDate, "yyyy-MM-dd"),
        returnDate: values.returnDate ? format(values.returnDate, "yyyy-MM-dd") : undefined,
      }
      
      setFormData(values)
      return formattedValues
    } catch (error) {
      console.error("Error submitting form:", error)
      if (error instanceof Error) {
        setParseErrors(prev => ({ 
          ...prev, 
          submit: `Failed to submit form: ${error.message}` 
        }))
      }
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [form])

  return {
    form,
    tripType,
    formData,
    formErrors: form.formState.errors,
    parseErrors,
    isSubmitting,
    isDepartureDateDisabled,
    isReturnDateDisabled,
    onSubmit,
    resetForm
  }
}
