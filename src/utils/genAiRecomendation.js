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

**IMPORTANT: Return your response as a VALID JSON object with the following structure:**

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

**Do NOT include any extra text, explanations, or markdown formatting like \`\`\`json. Only return the raw JSON object.**

Here is the report:

Performance Score: ${report.performanceScore}
SEO Score: ${report.seoScore}
Accessibility Score: ${report.accessibilityScore}
Best Practices Score: ${report.bestPracticesScore}`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        response_mime_type: "application/json",
      },
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    const cleanedJson = responseText.replace(/```json\s*|\s*```/g, "").trim();
    try {
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error("Failed to parse JSON. Raw response:", cleanedJson);
      throw new Error(
        "AI returned invalid JSON. Try again or check the prompt."
      );
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI recommendation service is currently unavailable.");
  }
}

module.exports = generateGeminiRecommendations;
