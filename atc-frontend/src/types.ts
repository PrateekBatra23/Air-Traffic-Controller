export interface Flight {
  flightId: string;
  airline: string;
  arrivalTime: string;
  priority: "emergency" | "vip" | "normal";
  status: "scheduled" | "landed" | "docked" | "departed";
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
