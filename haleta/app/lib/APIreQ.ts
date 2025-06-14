import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const API_BASE = "http://localhost:5000"; // Flask backend
type FavoritePayload = {
  prompt: string;
  favorite: string;
};
export const rewritePrompt = async (prompt: string): Promise<string[]> => {
  const response = await axios.post(`${API_BASE}/rewrite`, {
    prompt,
  });
  return response.data.variations; // this is a string[]
};

export const getFavorite = async () => {
  const { data, error } = await supabase
    .from("prompt_logs")
    .select("id,prompt,favorite")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteFavorite = async (id: string) => {
  const { error } = await supabase.from("prompt_logs").delete().eq("id", id);
  if (error) throw error;
};

export async function logFavorite(data: FavoritePayload) {
  return axios.post(`${API_BASE}/log_favorite`, data);
}
