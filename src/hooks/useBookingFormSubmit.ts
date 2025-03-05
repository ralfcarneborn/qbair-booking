import { useCallback } from "react"
import { UseFormReturn } from "react-hook-form"
import { BookingFormValues, FormattedBookingFormValues } from "@/types/FormTypes"
import { formatDateForSubmission } from "@/utils/dateUtils"
import { useUrlParams } from "./useUrlParams"

export const useFormSubmit = (
  form: UseFormReturn<BookingFormValues>,
  setFormData: (data: BookingFormValues | null) => void,
  setParseErrors: (cb: (prev: Record<string, string>) => Record<string, string>) => void,
  setIsSubmitting: (isSubmitting: boolean) => void
) => {
  const { updateUrlParams } = useUrlParams()

  return useCallback(async (values: BookingFormValues) => {
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
        departureDate: formatDateForSubmission(values.departureDate)!,
        returnDate: formatDateForSubmission(values.returnDate),
      }
      
      updateUrlParams(values)
      
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
  }, [form, setFormData, setParseErrors, setIsSubmitting, updateUrlParams])
}

export const useFormReset = (
  form: UseFormReturn<BookingFormValues>,
  setFormData: (data: BookingFormValues | null) => void,
  setParseErrors: (cb: (prev: Record<string, string>) => Record<string, string>) => void
) => {
  const { clearUrlParams } = useUrlParams()

  return useCallback(() => {
    form.reset({
      tripType: "one-way",
      origin: "",
      destination: "",
      departureDate: undefined,
      returnDate: undefined
    })
    setFormData(null)
    setParseErrors(() => ({}))
    
    clearUrlParams()
  }, [form, setFormData, setParseErrors, clearUrlParams])
}
