const express = require("express");
const chromeLauncher = require("chrome-launcher");
const { verifyToken } = require("../middleware/authMiddleware");
const Report = require("../models/reportModel");
const generateGeminiRecommendations = require("../utils/genAiRecomendation");
const router = express.Router();

router.post("/generate", verifyToken, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    const { default: lighthouse } = await import("lighthouse");
    
    const chrome = await chromeLauncher.launch({ 
      chromeFlags: ["--headless"], 
    });

    const options = { logLevel: "info", output: "json", port: chrome.port };

    const runnerResult = await lighthouse(url, options);
    await chrome.kill();
    
    const { categories } = runnerResult.lhr;
    const reportData = {
      userId: req.user.userId,
      url,
      performanceScore: Math.round(categories.performance.score * 100),
      seoScore: Math.round(categories.seo.score * 100),
      accessibilityScore: Math.round(categories.accessibility.score * 100),
      bestPracticesScore: Math.round(categories["best-practices"].score * 100),
      recommendations: '',
    };

    const aiReport = await generateGeminiRecommendations(reportData);
    reportData.recommendations = aiReport;
    
    const newReport = new Report(reportData);
    await newReport.save();

    res.json(newReport);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

router.get("/history", verifyToken, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching report history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
