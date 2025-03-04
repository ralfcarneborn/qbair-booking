export type TripType = "one-way" | "round-trip";

export interface Airport {
  id: string;
  name: string;
}

export const airports: Airport[] = [
  { id: "NYC", name: "New York (JFK)" },
  { id: "LAX", name: "Los Angeles (LAX)" },
  { id: "LHR", name: "London (LHR)" },
  { id: "CDG", name: "Paris (CDG)" },
  { id: "SYD", name: "Sydney (SYD)" },
  { id: "NRT", name: "Tokyo (NRT)" },
];
