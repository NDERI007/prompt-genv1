"use client";

import { useEffect, useState } from "react";
import { getFavorite, deleteFavorite } from "../lib/APIreQ"; // We'll write these
import { toast } from "sonner";

type FavoriteItem = {
  id: string;
  prompt: string;
  favorite: string;
};

export function Favorite() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFavorite();
        setFavorites(data);
      } catch (err) {
        toast.error("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  if (loading) return <p className="text-center">Loading favorites...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Your Favorite Prompts</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        favorites.map((fav) => (
          <div key={fav.id} className="p-4 border rounded bg-black relative">
            <p className="text-gray-400 text-sm mb-1">Prompt:</p>
            <p className="font-semibold mb-2">{fav.prompt}</p>
            <p className="text-gray-400 text-sm mb-1">Favorite:</p>
            <p>{fav.favorite}</p>
            <button
              onClick={() => handleDelete(fav.id)}
              className="absolute top-2 right-2 text-red-500"
            >
              🗑️
            </button>
          </div>
        ))
      )}
    </div>
  );
}
