import { format } from "date-fns"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

import { airports } from "@/types/TripTypes"
import { TripTypeSelector } from "./trip-type-selector"
import { AirportSelector } from "./airport-selector"
import { DateSelector } from "./date-selector"
import { useBookingForm } from "@/hooks/useBookingForm"

export function BookingForm() {
  const {
    form,
    tripType,
    formData,
    parseErrors,
    isSubmitting,
    isDepartureDateDisabled,
    isReturnDateDisabled,
    onSubmit,
    resetForm
  } = useBookingForm()

  const hasParseErrors = Object.keys(parseErrors).length > 0

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>QbAir Booking</CardTitle>
          <CardDescription>Book your flight with QbAir</CardDescription>
        </CardHeader>
        <CardContent>
          {hasParseErrors && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5">
                  {Object.entries(parseErrors).map(([key, error]) => (
                    <li key={key}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

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

              <DateSelector
                control={form.control}
                name="departureDate"
                label="Departure Date"
                description="Select your departure date (must be today or later)"
                disabledDatesFn={isDepartureDateDisabled}
              />

              {tripType === "round-trip" && (
                <DateSelector
                  control={form.control}
                  name="returnDate"
                  label="Return Date"
                  description="Select your return date (must be same or later than departure date)"
                  disabledDatesFn={isReturnDateDisabled}
                />
              )}

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
