import { Calendar } from "@/components/ui/calendar"
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { BookingFormValues } from "@/types/FormTypes"
import { Control } from "react-hook-form"

interface DateSelectorProps {
  control: Control<BookingFormValues>
  name: "departureDate" | "returnDate"
  label: string
  description: string
  disabledDatesFn: (date: Date) => boolean
}

export function DateSelector({
  control,
  name,
  label,
  description,
  disabledDatesFn
}: DateSelectorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={disabledDatesFn}
            className="rounded-md border"
          />
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
