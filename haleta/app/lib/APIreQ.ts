import axios from "axios";

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

export async function logFavorite(data: FavoritePayload) {
  return axios.post(`${API_BASE}/log_favorite`, data);
}
