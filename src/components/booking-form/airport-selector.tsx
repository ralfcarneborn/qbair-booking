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
}

export function AirportSelector({ 
  control, 
  name, 
  label, 
  placeholder 
}: AirportSelectorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
