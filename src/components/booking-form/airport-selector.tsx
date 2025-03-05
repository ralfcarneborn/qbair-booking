import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookingFormValues } from "@/types/FormTypes"
import { airports } from "@/types/TripTypes"

interface AirportSelectorProps {
  control: Control<BookingFormValues>
  name: "origin" | "destination"
  label: string
  placeholder: string
  error?: string
}

export function AirportSelector({ 
  control, 
  name, 
  label, 
  placeholder,
  error
}: AirportSelectorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || ""}
            defaultValue=""
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.id} value={airport.id}>
                  {airport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(fieldState.error || error) && (
            <FormMessage className="text-red-500">{fieldState.error?.message || error}</FormMessage>
          )}
        </FormItem>
      )}
    />
  )
}
