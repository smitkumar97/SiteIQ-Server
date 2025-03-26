const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateGeminiRecommendations(report) {
  const prompt = `
  Analyze the following Lighthouse audit report and suggest improvements:

  - Performance Score: ${report.performanceScore}
  - SEO Score: ${report.seoScore}
  - Accessibility Score: ${report.accessibilityScore}
  - Best Practices Score: ${report.bestPracticesScore}

  Recommendations:
  ${JSON.stringify(report.recommendations, null, 2)}

  Provide a list of **actionable suggestions** for improving the website performance.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: "You are an expert in web performance optimization." }],
        },
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const rawResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
    return rawResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI recommendation service is currently unavailable.";
  }
}

module.exports = generateGeminiRecommendations;