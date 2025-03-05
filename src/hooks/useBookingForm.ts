import { useState, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { airports } from "@/types/TripTypes"
import { bookingFormSchema, BookingFormValues } from "@/types/FormTypes"
import { isPastDate } from "@/utils/dateUtils"
import { useInitialFormValues, useDatesFromUrl } from "./useBookingFormInit"
import { useFormSubmit, useFormReset } from "./useBookingFormSubmit"

export function useBookingForm() {
  const [formData, setFormData] = useState<BookingFormValues | null>(null)
  const [parseErrors, setParseErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  
  const validateAirport = useCallback((airportId: string | null): boolean => {
    return airportId !== null && airports.some(airport => airport.id === airportId)
  }, [])
  
  const initialValues = useInitialFormValues(params, validateAirport, setParseErrors)
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  })
  
  const tripType = form.watch("tripType")

  useDatesFromUrl(form, params, setParseErrors)

  const isDepartureDateDisabled = useCallback((date: Date): boolean => {
    return isPastDate(date)
  }, [])

  const onSubmit = useFormSubmit(form, setFormData, setParseErrors, setIsSubmitting)
  const resetForm = useFormReset(form, setFormData, setParseErrors)

  return {
    form,
    tripType,
    formData,
    formErrors: form.formState.errors,
    parseErrors,
    isSubmitting,
    isDepartureDateDisabled,
    onSubmit,
    resetForm
  }
}
