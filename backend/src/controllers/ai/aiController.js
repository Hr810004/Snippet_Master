import asyncHandler from "express-async-handler";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with multiple models
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model configurations with fallback - Best 3 models
const models = [
  { 
    name: "gemini-2.5-pro", 
    model: genAI.getGenerativeModel({ model: "gemini-2.5-pro" }),
    priority: 1
  },
  { 
    name: "gemini-2.5-flash", 
    model: genAI.getGenerativeModel({ model: "gemini-2.5-flash" }),
    priority: 2
  },
  { 
    name: "gemini-1.5-pro-latest", 
    model: genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }),
    priority: 3
  }
];

// Function to get available model with better error handling
const getAvailableModel = async () => {
  for (const modelConfig of models) {
    try {
      // Test the model with a simple prompt
      const result = await modelConfig.model.generateContent("test");
      if (result && result.response) {
        console.log(`✅ Using model: ${modelConfig.name}`);
        return modelConfig;
      }
    } catch (error) {
      console.log(`❌ Model ${modelConfig.name} not available: ${error.message}`);
      continue;
    }
  }
  throw new Error("All models are currently unavailable. Please try again later.");
};

export const analyzeCode = asyncHandler(async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const prompt = `Analyze this ${language || 'code'} and provide:
1. Code quality score (1-10)
2. Potential improvements
3. Security concerns
4. Performance suggestions
5. Best practices recommendations

Code:
${code}

Please provide a structured response in JSON format.`;

    const modelConfig = await getAvailableModel();
    const result = await modelConfig.model.generateContent(prompt);
    const analysis = result.response.text();

    res.status(200).json({
      analysis: analysis,
      model: modelConfig.name
    });
  } catch (error) {
    console.log("Error in analyzeCode", error);
    res.status(500).json({ message: "Error analyzing code" });
  }
});

export const suggestImprovements = asyncHandler(async (req, res) => {
  try {
    const { code, language, specificIssue } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const prompt = `Given this ${language || 'code'}${specificIssue ? ` and the specific issue: ${specificIssue}` : ''}, suggest specific improvements with code examples.

Code:
${code}

Please provide:
1. Specific issues identified
2. Improved code examples
3. Explanation of changes
4. Alternative approaches

Format as JSON.`;

    const modelConfig = await getAvailableModel();
    const result = await modelConfig.model.generateContent(prompt);
    const suggestions = result.response.text();

    res.status(200).json({
      suggestions: suggestions,
      model: modelConfig.name
    });
  } catch (error) {
    console.log("Error in suggestImprovements", error);
    res.status(500).json({ message: "Error generating suggestions" });
  }
});

export const generateDocumentation = asyncHandler(async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const prompt = `Generate comprehensive documentation for this ${language || 'code'} including:
1. Function/class descriptions
2. Parameter explanations
3. Return value descriptions
4. Usage examples
5. Edge cases and considerations

Code:
${code}

Please provide well-formatted documentation.`;

    const modelConfig = await getAvailableModel();
    const result = await modelConfig.model.generateContent(prompt);
    const documentation = result.response.text();

    res.status(200).json({
      documentation: documentation,
      model: modelConfig.name
    });
  } catch (error) {
    console.log("Error in generateDocumentation", error);
    res.status(500).json({ message: "Error generating documentation" });
  }
});

export const convertCode = asyncHandler(async (req, res) => {
  try {
    const { code, sourceLanguage, targetLanguage } = req.body;

    if (!code || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({ 
        message: "Code, source language, and target language are required" 
      });
    }

    const prompt = `Convert the following ${sourceLanguage} code to ${targetLanguage}. 
    
    Source Code (${sourceLanguage}):
    ${code}
    
    Please provide the converted code in ${targetLanguage} with proper syntax, formatting, and comments explaining any significant changes. 
    Make sure the converted code is functional and follows ${targetLanguage} best practices.
    
    Return only the converted code without any additional explanations.`;

    const modelConfig = await getAvailableModel();
    const result = await modelConfig.model.generateContent(prompt);
    const convertedCode = result.response.text();

    res.status(200).json({
      convertedCode: convertedCode,
      model: modelConfig.name,
      sourceLanguage,
      targetLanguage
    });
  } catch (error) {
    console.log("Error in convertCode", error);
    res.status(500).json({ message: "Error converting code" });
  }
}); 