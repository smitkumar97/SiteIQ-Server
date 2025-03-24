const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateAIRecommendations(report) {
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are an expert in web performance optimization." },
                 { role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });
      
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "AI recommendation service is currently unavailable.";
  }
}

module.exports = generateAIRecommendations;
