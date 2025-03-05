import { TripType } from "@/types/TripTypes"

export const validateAirportParam = (
  param: string | null, 
  fieldName: string, 
  validateAirport: (airportId: string | null) => boolean,
  setParseErrors: (cb: (prev: Record<string, string>) => Record<string, string>) => void
): boolean => {
  if (param && !validateAirport(param)) {
    setParseErrors(prev => ({ 
      ...prev, 
      [fieldName]: `Invalid ${fieldName} airport: ${param}` 
    }))
    return false;
  }
  return param !== null && validateAirport(param);
}

export const validateTripType = (
  param: string | null,
  setParseErrors: (cb: (prev: Record<string, string>) => Record<string, string>) => void
): TripType => {
  const validTripTypes: TripType[] = ["one-way", "round-trip"];
  const defaultTripType: TripType = "one-way";
  
  if (!param) return defaultTripType;
  
  if (validTripTypes.includes(param as TripType)) {
    return param as TripType;
  } else {
    setParseErrors(prev => ({ 
      ...prev, 
      tripType: `Invalid trip type: ${param}. Must be "one-way" or "round-trip".` 
    }));
    return defaultTripType;
  }
}
