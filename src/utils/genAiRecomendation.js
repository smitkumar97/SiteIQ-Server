const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateGeminiRecommendations(report) {
  const prompt = `
You are an expert in web performance, SEO, accessibility, and best practices for web development.

Below is a Lighthouse audit report. Based on the scores and findings, generate **actionable recommendations**. Organize them clearly under the following categories:

1. Performance
2. SEO
3. Accessibility
4. Best Practices

Return your response as a object with the following structure:

{
  "Performance": {
    "keyIssuesObserved": [...],
    "recommendedActions": [
      {
        "action": "...",
        "impact": "High | Medium | Low",
        "details": "..."
      }
    ]
  },
  "SEO": { ... },
  "Accessibility": { ... },
  "BestPractices": { ... }
}

  Here is the report:

  Performance Score: ${report.performanceScore}
  SEO Score: ${report.seoScore}
  Accessibility Score: ${report.accessibilityScore}
  Best Practices Score: ${report.bestPracticesScore}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: "You are an expert in web performance optimization." },
          ],
        },
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const cleanedJson = result.response.candidates?.[0]?.content?.parts?.[0]?.text
      .replace(/```json\s*|\s*```/g, '')
      .trim();
    
    let finalResponse;
    try {
      finalResponse = JSON.parse(cleanedJson);
      console.log("Successfully parsed JSON:", finalResponse);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }

    return finalResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI recommendation service is currently unavailable.";
  }
}

module.exports = generateGeminiRecommendations;
