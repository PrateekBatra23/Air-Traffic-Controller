const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const flightsFile = path.join(__dirname, "../data/flights.json");
const readFlights = () => JSON.parse(fs.readFileSync(flightsFile, "utf-8"));
const writeFlights = (flights) => fs.writeFileSync(flightsFile, JSON.stringify(flights, null, 2));


router.post("/", (req, res) => {
  const flights = readFlights();
  const newFlight = req.body;
  if (!newFlight.flightId) {
    return res.status(400).json({ error: "flightId is required" });
  }
  flights.push(newFlight);
  writeFlights(flights);
  res.status(201).json(newFlight);
});

router.get("/", (req, res) => {
  const flights = readFlights();
  res.json(flights);
});

router.get("/:id", (req, res) => {
  const flights = readFlights();
  const flight = flights.find((f) => f.flightId === req.params.id);
  if (!flight) return res.status(404).json({ error: "Flight not found" });
  res.json(flight);
});

router.put("/:id", (req, res) => {
  const flights = readFlights();
  const index = flights.findIndex((f) => f.flightId === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Flight not found" });
  flights[index] = { ...flights[index], ...req.body };
  writeFlights(flights);
  res.json(flights[index]);
});

router.delete("/:id", (req, res) => {
  const flights = readFlights();
  const newFlights = flights.filter((f) => f.flightId !== req.params.id);
  if (newFlights.length === flights.length)
    return res.status(404).json({ error: "Flight not found" });
  writeFlights(newFlights);
  res.json({ message: "Flight deleted" });
});

module.exports = router;
