"use client";

import { useState } from "react";
import { rewritePrompt } from "../lib/APIreQ"; // Make sure this path is correct
import { PromptResult } from "./result";
import { toast } from "sonner"; // Optional: for nice toasts

export default function PromptForm() {
  const [prompt, setPrompt] = useState(""); //tores the text the user enters into the prompt textarea

  const [variations, setVariations] = useState<string[]>([]); //Holds the AI generated variations
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result = await rewritePrompt(prompt);
      setVariations(result);
    } catch (err) {
      toast.error("Failed to get variations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      <textarea
        className="w-full p-3 border rounded resize-none"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt like: 'How do I reset my password?'"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Rewrites"}
      </button>

      {variations.length > 0 && (
        <PromptResult prompt={prompt} variations={variations} />
      )}
    </div>
  );
}
