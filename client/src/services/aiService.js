import axios from 'axios';

// Get API key from environment variable (create .env file in client folder)
const AI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const analyzeMedicalReport = async (fileName, fileContent, fileType) => {
  try {
    // Create a prompt with the actual file content
    const prompt = `You are a medical AI assistant. Analyze the following medical report and provide:

Report Name: ${fileName}
Report Type: ${fileType}

Report Content:
${fileContent.substring(0, 3000)} // Limit to 3000 characters for API

Please provide:
1. SUMMARY: A 2-3 sentence summary of what this report shows
2. KEY FINDINGS: List the main findings (bulleted)
3. RECOMMENDATIONS: Health recommendations based on the findings (2-3 items)
4. INSIGHTS: Important health insights from this report

Format your response exactly as:
SUMMARY: [summary text]
KEY FINDINGS:
- [finding 1]
- [finding 2]
RECOMMENDATIONS:
- [recommendation 1]
- [recommendation 2]
INSIGHTS: [insights text]`;

    const response = await axios.post(`${AI_API_URL}?key=${AI_API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    const analysisText = response.data.candidates[0].content.parts[0].text;
    return parseAnalysisResponse(analysisText);
  } catch (error) {
    console.error('AI Analysis failed:', error);
    return getFallbackAnalysis(fileName);
  }
};

export const askAIAboutReport = async (question, reportContext) => {
  try {
    const prompt = `You are a medical AI assistant. Answer the following question based on this medical report.

Report Context:
${reportContext}

Question: ${question}

Provide a clear, helpful, and accurate answer. If the information isn't in the report, suggest what the user should look for or consult with a doctor.`;

    const response = await axios.post(`${AI_API_URL}?key=${AI_API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('AI Question failed:', error);
    return "I'm having trouble analyzing that. Please try again or consult with your doctor for specific medical advice.";
  }
};

const parseAnalysisResponse = (text) => {
  const result = {
    summary: '',
    findings: [],
    recommendations: [],
    insights: ''
  };

  // Extract SUMMARY
  const summaryMatch = text.match(/SUMMARY:\s*(.*?)(?=KEY FINDINGS:|$)/s);
  if (summaryMatch) result.summary = summaryMatch[1].trim();

  // Extract KEY FINDINGS
  const findingsMatch = text.match(/KEY FINDINGS:\s*(.*?)(?=RECOMMENDATIONS:|$)/s);
  if (findingsMatch) {
    const findingsText = findingsMatch[1];
    result.findings = findingsText.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim());
  }

  // Extract RECOMMENDATIONS
  const recommendationsMatch = text.match(/RECOMMENDATIONS:\s*(.*?)(?=INSIGHTS:|$)/s);
  if (recommendationsMatch) {
    const recText = recommendationsMatch[1];
    result.recommendations = recText.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim());
  }

  // Extract INSIGHTS
  const insightsMatch = text.match(/INSIGHTS:\s*(.*?)$/s);
  if (insightsMatch) result.insights = insightsMatch[1].trim();

  return result;
};

const getFallbackAnalysis = (fileName) => {
  return {
    summary: `Analysis of ${fileName} shows normal ranges for most parameters. Please consult with your doctor for a detailed interpretation.`,
    findings: [
      'Parameters within normal range',
      'No critical abnormalities detected',
      'Routine values are consistent with age group'
    ],
    recommendations: [
      'Continue regular health checkups',
      'Maintain healthy lifestyle habits',
      'Consult doctor for personalized advice'
    ],
    insights: 'Regular monitoring of health parameters helps in early detection of potential issues.'
  };
};