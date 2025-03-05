import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"

import { useBookingForm } from "@/hooks/useBookingForm"
import { airports } from "@/types/TripTypes"
import { AirportSelector } from "./airport-selector"
import { DateRangeSelector } from "./date-range-selector"
import { TripTypeSelector } from "./trip-type-selector"

export function BookingForm() {
  const {
    form,
    tripType,
    formData,
    isSubmitting,
    isDepartureDateDisabled,
    onSubmit,
    resetForm
  } = useBookingForm()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>QbAir Booking</CardTitle>
          <CardDescription>Book your flight with QbAir</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TripTypeSelector control={form.control} />

              <AirportSelector 
                control={form.control} 
                name="origin" 
                label="Origin" 
                placeholder="Select origin airport" 
              />

              <AirportSelector 
                control={form.control} 
                name="destination" 
                label="Destination" 
                placeholder="Select destination airport" 
              />

              <DateRangeSelector
                control={form.control}
                label={tripType === "one-way" ? "Departure Date" : "Travel Dates"}
                description={tripType === "one-way" 
                  ? "Select your departure date (must be today or later)" 
                  : "Select your departure and return dates"}
                disabledDatesFn={isDepartureDateDisabled}
                tripType={tripType}
              />

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Booking..." : "Book Flight"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        
        {formData && (
          <CardFooter className="flex flex-col items-start">
            <div className="w-full p-4 mt-4 border rounded-md bg-muted">
              <h3 className="mb-2 text-lg font-medium">Booking Summary</h3>
              <p><strong>Trip Type:</strong> {formData.tripType === "one-way" ? "One-way" : "Round-trip"}</p>
              <p><strong>Origin:</strong> {airports.find(a => a.id === formData.origin)?.name}</p>
              <p><strong>Destination:</strong> {airports.find(a => a.id === formData.destination)?.name}</p>
              <p><strong>Departure Date:</strong> {format(formData.departureDate, "yyyy-MM-dd")}</p>
              {formData.returnDate && (
                <p><strong>Return Date:</strong> {format(formData.returnDate, "yyyy-MM-dd")}</p>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
