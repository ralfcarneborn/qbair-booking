import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BookingFormValues } from "@/types/FormTypes"

interface TripTypeSelectorProps {
  control: Control<BookingFormValues>
}

export function TripTypeSelector({ control }: TripTypeSelectorProps) {
  return (
    <FormField
      control={control}
      name="tripType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Trip Type</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-row space-x-4"
            >
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="one-way" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  One-way
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="round-trip" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Round-trip
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
