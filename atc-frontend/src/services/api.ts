import axios from "axios";
import type { Flight } from "../types";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const getFlights = () => API.get<Flight[]>("/flights");
export const addFlight = (data: Flight) => API.post("/flights", data);
export const deleteFlight = (id: string) => API.delete(`/flights/${id}`);
export const startSim = () => API.post("/simulation/start");
export const stopSim = () => API.post("/simulation/stop");
