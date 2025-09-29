
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const summaryPath = path.join(__dirname, "../data/summary.json");


router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(summaryPath)) return res.status(404).json({ error: "No summaries found" });
    const summaries = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
    res.json(summaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summaries" });
  }
});


router.get("/latest", (req, res) => {
  try {
    if (!fs.existsSync(summaryPath)) return res.status(404).json({ error: "No summaries found" });
    const summaries = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
    const latest = summaries[summaries.length - 1];
    res.json(latest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch latest summary" });
  }
});
router.get("/:id", (req, res) => {
  try {
    if (!fs.existsSync(summaryPath))
      return res.status(404).json({ error: "No summaries found" });

    const summaries = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
    const summaryId = parseInt(req.params.id);
    console.log("Looking for summaryId:", summaryId);
    console.log("Available summaries:", summaries.map(s => s.summaryId));
    const summary = summaries.find(s => s.summaryId === summaryId);

    if (!summary) return res.status(404).json({ error: "Summary not found" });

    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    if (!fs.existsSync(summaryPath)) return res.status(404).json({ error: "No summaries found" });
    let summaries = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
    const summaryId = parseInt(req.params.id);

    const index = summaries.findIndex(s => s.summaryId === summaryId);
    if (index === -1) return res.status(404).json({ error: "Summary not found" });

    summaries.splice(index, 1);
    fs.writeFileSync(summaryPath, JSON.stringify(summaries, null, 2));
    res.json({ message: `Summary ${summaryId} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete summary" });
  }
});

module.exports = router;
