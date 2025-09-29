import axios from "axios";
import type { Flight } from "../types";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const getFlights = () => API.get<Flight[]>("/flights");
export const addFlight = (data: Flight) => API.post("/flights", data);
export const deleteFlight = (id: string) => API.delete(`/flights/${id}`);
export const startSim = (socketId: string) => API.post("/simulation/start", { socketId });
export const stopSim = (socketId: string) => API.post("/simulation/stop", { socketId });

// Summary endpoints
export const getSummaries = () => API.get("/summary");
export const getLatestSummary = () => API.get("/summary/latest");
export const getSummaryById = (id: number) => API.get(`/summary/${id}`);