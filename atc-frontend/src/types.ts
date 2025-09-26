export interface Flight {
  flightId: string;
  airline: string;
  arrivalTime: string;
  priority: "emergency" | "vip" | "normal";
  status: "scheduled" | "landing" | "landed" | "taxiing" | "docked" | "departed";
  runwayAssigned?: string | null;
  gateAssigned?: string | null;
}

export interface LogEvent {
  event: string;
  flightId?: string;
  from?: string;
  to?: string;
  timestamp: string;
}

export interface FlightSummary {
  flightId: string;
  date: string;
  airline: string;
  touchdownTime: string;
  taxiwayInTime: string;
  gateDockTime: string;
  gateAllotted: string;
  gateUndockTime: string;
  taxiwayOutTime: string;
  clearanceTime: string;
  takeoffTime: string;
  totalTurnaroundTime: string;
}
