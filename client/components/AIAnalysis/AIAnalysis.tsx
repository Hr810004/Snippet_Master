"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface AIAnalysisProps {
  code: string;
  language: string;
}

interface AnalysisResult {
  analysis: string;
  model: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ code, language }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) {
      toast.error("Please provide code to analyze");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://snippet-master-harsh810.onrender.com/api/v1/analyze-code",
        {
          code,
          language,
        },
        {
          withCredentials: true,
        }
      );

      setAnalysis(response.data);
      toast.success("Code analysis completed!");
    } catch (error) {
      console.error("Error analyzing code:", error);
      toast.error("Failed to analyze code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-1 p-4 rounded-lg border border-rgba-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">AI Code Analysis</h3>
        <button
          onClick={analyzeCode}
          disabled={loading}
          className="px-4 py-2 bg-[#7263F3] text-white rounded-lg hover:bg-[#6BBE92] transition-colors disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Code"}
        </button>
      </div>

      {analysis && (
        <div className="bg-2 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-400">Powered by {analysis.model}</span>
          </div>
          <div className="text-gray-300 whitespace-pre-wrap text-sm">
            {analysis.analysis}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis; 