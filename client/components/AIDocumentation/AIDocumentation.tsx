"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface AIDocumentationProps {
  code: string;
  language: string;
}

interface DocumentationResult {
  documentation: string;
  model: string;
}

const AIDocumentation: React.FC<AIDocumentationProps> = ({ code, language }) => {
  const [documentation, setDocumentation] = useState<DocumentationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const generateDocumentation = async () => {
    if (!code.trim()) {
      toast.error("Please provide code to document");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://snippet-master-harsh810.onrender.com/api/v1/generate-documentation",
        {
          code,
          language,
        },
        {
          withCredentials: true,
        }
      );

      setDocumentation(response.data);
      toast.success("Documentation generated!");
    } catch (error) {
      console.error("Error generating documentation:", error);
      toast.error("Failed to generate documentation");
    } finally {
      setLoading(false);
    }
  };

  const copyDocumentation = async () => {
    if (documentation) {
      try {
        await navigator.clipboard.writeText(documentation.documentation);
        toast.success("Documentation copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy documentation");
      }
    }
  };

  const downloadDocumentation = () => {
    if (documentation) {
      const element = document.createElement("a");
      const file = new Blob([documentation.documentation], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `documentation.${language}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Documentation downloaded!");
    }
  };

  return (
    <div className="bg-1 p-4 rounded-lg border border-rgba-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">AI Documentation Generator</h3>
        <button
          onClick={generateDocumentation}
          disabled={loading}
          className="px-4 py-2 bg-[#7263F3] text-white rounded-lg hover:bg-[#6BBE92] transition-colors disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Docs"}
        </button>
      </div>

      {documentation && (
        <div className="bg-2 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Powered by {documentation.model}</span>
            <div className="flex gap-2">
              <button
                onClick={copyDocumentation}
                className="px-3 py-1 bg-rgba-3 text-gray-300 rounded hover:bg-rgba-2 transition-colors text-sm"
              >
                Copy
              </button>
              <button
                onClick={downloadDocumentation}
                className="px-3 py-1 bg-rgba-3 text-gray-300 rounded hover:bg-rgba-2 transition-colors text-sm"
              >
                Download
              </button>
            </div>
          </div>
          <div className="text-gray-300 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
            {documentation.documentation}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDocumentation; 