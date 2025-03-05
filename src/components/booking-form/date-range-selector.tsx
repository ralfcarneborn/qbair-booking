import { Calendar } from "@/components/ui/calendar"
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { BookingFormValues } from "@/types/FormTypes"
import { DateRange } from "react-day-picker"
import { Control } from "react-hook-form"

interface DateRangeSelectorProps {
  control: Control<BookingFormValues>
  label: string
  description: string
  disabledDatesFn: (date: Date) => boolean
  tripType: "one-way" | "round-trip"
  error?: string
}

export function DateRangeSelector({
  control,
  label,
  description,
  disabledDatesFn,
  tripType,
  error
}: DateRangeSelectorProps) {
  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div className="flex flex-col">
        <FormField
          control={control}
          name="departureDate"
          render={({ field: departureDateField, fieldState: departureDateState }) => (
            <FormField
              control={control}
              name="returnDate"
              render={({ field: returnDateField, fieldState: returnDateState }) => (
                <FormItem className="flex flex-col">
                  {tripType === "one-way" ? (
                    <Calendar
                      mode="single"
                      selected={departureDateField.value}
                      onSelect={(date: Date | undefined) => {
                        departureDateField.onChange(date);
                      }}
                      disabled={disabledDatesFn}
                      className="rounded-md border"
                    />
                  ) : (
                    <Calendar
                      mode="range"
                      selected={{
                        from: departureDateField.value,
                        to: returnDateField.value
                      }}
                      onSelect={(range: DateRange | undefined) => {
                        if (range?.from) {
                          departureDateField.onChange(range.from);
                        }
                        if (range?.to) {
                          returnDateField.onChange(range.to);
                        }
                      }}
                      disabled={disabledDatesFn}
                      className="rounded-md border"
                    />
                  )}
                  <FormDescription>
                    {description}
                  </FormDescription>
                  {(departureDateState.error || error) && (
                    <FormMessage className="text-red-500">{departureDateState.error?.message || error}</FormMessage>
                  )}
                  {returnDateState.error && tripType === "round-trip" && (
                    <FormMessage className="text-red-500">{returnDateState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          )}
        />
      </div>
    </div>
  )
}
