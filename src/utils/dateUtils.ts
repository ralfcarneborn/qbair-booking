import { format, parse } from "date-fns"

export const isPastDate = (date: Date): boolean => {
  return date < new Date(new Date().setHours(0, 0, 0, 0))
}

export const isBeforeDepartureDate = (date: Date, departureDate: Date | undefined): boolean => {
  return departureDate ? date < departureDate : false
}

export const parseDate = (dateString: string | null, paramName: string, setParseErrors: (cb: (prev: Record<string, string>) => Record<string, string>) => void): Date | null => {
  if (!dateString) return null
  
  try {
    let date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      try {
        date = parse(dateString, "yyyy-MM-dd", new Date())
      } catch (e) {
        throw new Error(`Invalid date format: ${dateString}`)
      }
    }
    
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateString}`)
    }
    
    return date
  } catch (error) {
    if (error instanceof Error) {
      setParseErrors(prev => ({ 
        ...prev, 
        [paramName]: `Failed to parse ${paramName}: ${error.message}` 
      }))
      console.warn(`Failed to parse ${paramName}:`, error)
    }
    return null
  }
}

export const formatDateForSubmission = (date: Date | undefined): string | undefined => {
  return date ? format(date, "yyyy-MM-dd") : undefined
}
