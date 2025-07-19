"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface AIImprovementsProps {
  code: string;
  language: string;
}

interface ImprovementsResult {
  suggestions: string;
  model: string;
}

const AIImprovements: React.FC<AIImprovementsProps> = ({ code, language }) => {
  const [improvements, setImprovements] = useState<ImprovementsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [specificIssue, setSpecificIssue] = useState("");

  const getImprovements = async () => {
    if (!code.trim()) {
      toast.error("Please provide code to analyze");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://snippet-master-harsh810.onrender.com/api/v1/suggest-improvements",
        {
          code,
          language,
          specificIssue: specificIssue.trim() || undefined,
        },
        {
          withCredentials: true,
        }
      );

      setImprovements(response.data);
      toast.success("Code improvements generated!");
    } catch (error) {
      console.error("Error getting improvements:", error);
      toast.error("Failed to generate improvements");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-1 p-4 rounded-lg border border-rgba-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">AI Code Improvements</h3>
        <button
          onClick={getImprovements}
          disabled={loading}
          className="px-4 py-2 bg-[#7263F3] text-white rounded-lg hover:bg-[#6BBE92] transition-colors disabled:opacity-50"
        >
          {loading ? "Generating..." : "Get Improvements"}
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="specificIssue" className="block text-sm font-medium text-gray-300 mb-2">
          Specific Issue (Optional)
        </label>
        <input
          type="text"
          id="specificIssue"
          value={specificIssue}
          onChange={(e) => setSpecificIssue(e.target.value)}
          placeholder="e.g., performance, security, readability..."
          className="w-full px-3 py-2 bg-2 text-white rounded-lg border border-rgba-3 focus:border-[#7263F3] focus:outline-none"
        />
      </div>

      {improvements && (
        <div className="bg-2 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-400">Powered by {improvements.model}</span>
          </div>
          <div className="text-gray-300 whitespace-pre-wrap text-sm prose prose-invert max-w-none">
            {improvements.suggestions.split('\n').map((line, index) => {
              if (line.startsWith('#')) {
                return <h3 key={index} className="text-white font-semibold mt-4 mb-2">{line.replace(/^#+\s*/, '')}</h3>;
              } else if (line.startsWith('- ') || line.startsWith('* ')) {
                return <li key={index} className="ml-4">{line.replace(/^[-*]\s*/, '')}</li>;
              } else if (line.trim() === '') {
                return <br key={index} />;
              } else {
                return <p key={index} className="mb-2">{line}</p>;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIImprovements; 