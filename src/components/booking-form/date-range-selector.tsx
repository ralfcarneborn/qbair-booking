import { Calendar } from "@/components/ui/calendar"
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { BookingFormValues } from "@/types/FormTypes"
import { DateRange } from "react-day-picker"
import { Control, useFormContext } from "react-hook-form"

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
  const { setValue, getValues } = useFormContext<BookingFormValues>();
  
  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div className="flex flex-col">
        {tripType === "one-way" ? (
          <FormField
            control={control}
            name="departureDate"
            render={({ field, fieldState }) => (
              <FormItem className="flex flex-col">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date: Date | undefined) => {
                    field.onChange(date);
                  }}
                  disabled={disabledDatesFn}
                  className="rounded-md border"
                />
                <FormDescription>
                  {description}
                </FormDescription>
                {(fieldState.error || error) && (
                  <FormMessage className="text-red-500">{fieldState.error?.message || error}</FormMessage>
                )}
              </FormItem>
            )}
          />
        ) : (
          <div>
            <FormField
              control={control}
              name="departureDate"
              render={({ field: departureDateField, fieldState: departureDateState }) => (
                <FormItem className="flex flex-col">
                  <Calendar
                    mode="range"
                    selected={{
                      from: departureDateField.value,
                      to: getValues("returnDate")
                    }}
                    onSelect={(range: DateRange | undefined) => {
                      if (range?.from) {
                        departureDateField.onChange(range.from);
                      }
                      
                      if (range?.to) {
                        setValue("returnDate", range.to, { 
                          shouldValidate: true, 
                          shouldDirty: true    
                        });
                      }
                    }}
                    disabled={disabledDatesFn}
                    className="rounded-md border"
                  />
                  <FormDescription>
                    {description}
                  </FormDescription>
                  {(departureDateState.error || error) && (
                    <FormMessage className="text-red-500">{departureDateState.error?.message || error}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="returnDate"
              render={({ fieldState }) => (
                <>
                  {fieldState.error && (
                    <FormMessage className="text-red-500">{fieldState.error.message}</FormMessage>
                  )}
                </>
              )}
            />
          </div>
        )}
      </div>
    </div>
  )
}
