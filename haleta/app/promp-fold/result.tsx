import { useState } from "react";
import { logFavorite } from "../lib/APIreQ";
import { toast } from "sonner";

type _prompt = {
  prompt: string;
  variations: string[];
};

export function PromptResult({ prompt, variations }: _prompt) {
  const [favoritedIndex, setFavoritedIndex] = useState<number | null>(null);

  const handleFavorite = async (variation: string, index: number) => {
    try {
      await logFavorite({ prompt, favorite: variation });
      setFavoritedIndex(index);
      toast.success("Saved to favorites!");
    } catch (err) {
      toast.error("Failed to save.");
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {variations.map((text, i) => (
        <div key={i} className="p-3 border rounded relative bg-black">
          <p>{text}</p>
          <button
            onClick={() => handleFavorite(text, i)}
            disabled={favoritedIndex === i}
            className={`absolute top-2 right-2 ${
              favoritedIndex === i ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            ⭐
          </button>
        </div>
      ))}
    </div>
  );
}
