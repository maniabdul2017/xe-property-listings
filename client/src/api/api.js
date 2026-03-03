/**

 * Backend base URL:
 * http://localhost:3001/api
 */

const BASE_URL = 'http://localhost:3001/api';


/**
 * Returns location suggestions for the area autocomplete.
 *
 * The backend handles the autocomplete lookup.
 *
 * @param {string} input  Partial text typed by the user (min 3 chars)

 */

export async function fetchAutocomplete(input) {
  const res = await fetch(
    `${BASE_URL}/autocomplete?input=${encodeURIComponent(input)}`
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Autocomplete failed.");
  }
  return res.json();
}


/**
 * Fetches property listings from the backend.
 *
 * All filter values are sent as query parameters.
 *
 * @param {object} [filters]
 * @param {"rent"|"buy"|"exchange"|"donation"} [filters.type]
 * @param {string} [filters.property_type]
 * @param {number|string} [filters.min_price]
 * @param {number|string} [filters.max_price]
 * @param {string} [filters.bedrooms]
 * @param {string[]} [filters.features]
 * @returns {Promise<object[]>}
 */
export async function fetchAds(filters = {}) {
  
  const params = new URLSearchParams();

  if (filters.type) params.append("type", filters.type);
  if (filters.property_type) params.append("property_type", filters.property_type);
  if (filters.min_price) params.append("min_price", filters.min_price);
  if (filters.max_price) params.append("max_price", filters.max_price);
  if (filters.bedrooms) params.append("bedrooms", filters.bedrooms);
  if (filters.features && filters.features.length > 0)
    params.append("features", filters.features.join(","));

  const query = params.toString();
  const url = query ? `${BASE_URL}/ads?${query}` : `${BASE_URL}/ads`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load ads.");
  return res.json();
}

/**
 * Fetch a single listing by its id.
 *
 * @param {number|string} id
 * @returns {Promise<object>}
 */
export async function fetchAd(id) {
  const res = await fetch(`${BASE_URL}/ads/${id}`);
  if (!res.ok) throw new Error("Ad not found.");
  return res.json();
}
/**
 * Creates a new property listing.
 *
 * Required fields:
 *   title, type, property_type, area_text, place_id
 *
 * @param {object} data
 * @returns {Promise<object>} The newly created listing
 */
export async function createAd(data) {
  const res = await fetch(`${BASE_URL}/ads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Failed to create ad.");
  return body;
}