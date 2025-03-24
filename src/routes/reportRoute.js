const express = require("express");
const chromeLauncher = require("chrome-launcher");
const { verifyToken } = require("../middleware/authMiddleware"); // Import JWT middleware
const Report = require("../models/reportModel"); // Import Sequelize model
// const generateAIRecommendations = require("../utils/aiRecommendations");

const router = express.Router();

router.post("/generate", verifyToken, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const { default: lighthouse } = await import("lighthouse");

    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    const options = { logLevel: "info", output: "json", port: chrome.port };

    const runnerResult = await lighthouse(url, options);
    // Generate AI-based recommendations
    // const aiRecommendations = await generateAIRecommendations(Report);
    await chrome.kill();

    const { categories } = runnerResult.lhr;
    const reportData = {
      userId: req.user.id, // Get user ID from token
      url,
      performanceScore: Math.round(categories.performance.score * 100),
      seoScore: Math.round(categories.seo.score * 100),
      accessibilityScore: Math.round(categories.accessibility.score * 100),
      bestPracticesScore: Math.round(categories["best-practices"].score * 100),
      // aiRecommendations: []
      recommendations: runnerResult.lhr.audits,
    };

    const newReport = await Report.create(reportData);
    res.json(newReport);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

router.get("/history", verifyToken, async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching report history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
