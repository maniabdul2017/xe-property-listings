const cache = require("../utils/cache.js");
const AUTOCOMPLETE_API = process.env.AUTOCOMPLETE_API_URL;

async function getSuggestions(input) {
  if (!AUTOCOMPLETE_API) {
    throw new Error("AUTOCOMPLETE_API_URL is not set in environment.");
  }
  const cacheKey = input.trim().toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  const response = await fetch(
    `${AUTOCOMPLETE_API}?input=${encodeURIComponent(input)}`
  );
  if (!response.ok) {
    throw new Error("Upstream autocomplete API error.");
  }
  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
}

module.exports = { getSuggestions };


