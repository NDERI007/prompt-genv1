"use client";

import { useState } from "react";
import { rewritePrompt } from "../lib/APIreQ";
import { PromptResult } from "./result";
import { Favorite } from "./fav-prompt";
import { toast } from "sonner";
import { StarIcon, ChevronDown, ChevronUp } from "lucide-react";

export default function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const [variations, setVariations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

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
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Prompt Rewriter</h1>
        <button
          onClick={() => setShowFavorites((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded shadow transition"
        >
          <StarIcon size={18} />
          {showFavorites ? "Hide Favorites" : "Show Favorites"}
          {showFavorites ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      <textarea
        className="w-full p-3 border border-gray-600 bg-gray-900 text-white rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt like: 'How do I reset my password?'"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow disabled:opacity-50 transition"
      >
        {loading ? "Generating..." : "Generate Rewrites"}
      </button>

      {variations.length > 0 && (
        <PromptResult prompt={prompt} variations={variations} />
      )}

      {showFavorites && (
        <div className="pt-8 border-t border-gray-700">
          <Favorite />
        </div>
      )}
    </div>
  );
}
