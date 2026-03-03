const { getDb } = require("../db/index.js");

/**
 * Returns all ads ordered by newest first
 * @returns {Array}
 */
function getAllAds() {
  const db = getDb();
  const ads = db
    .prepare("SELECT * FROM ads ORDER BY created_at DESC")
    .all();
  return ads.map(parseAd);
}

/**
 * Returns a single ad by id
 * @param {number} id
 * @returns {Object|undefined}
 */
function getAdById(id) {
  const db = getDb();
  const ad = db
    .prepare("SELECT * FROM ads WHERE id = ?")
    .get(id);
  return ad ? parseAd(ad) : undefined;
}

/**
 * Creates a new ad in the database
 * @param {{
 *   title: string,
 *   type: string,
 *   property_type: string,
 *   area_text: string,
 *   place_id: string,
 *   price: number|null,
 *   bedrooms: number|null,
 *   bathrooms: number|null,
 *   levels: number|null,
 *   size_sqm: number|null,
 *   features: string[],
 *   description: string|null
 * }} data
 * @returns {Object} the created ad
 */
function createAd(data) {
  const db = getDb();

  // Price only applies to rent and buy
  const priceRequired = data.type === "rent" || data.type === "buy";

  const stmt = db.prepare(`
    INSERT INTO ads (
      title,
      type,
      property_type,
      area_text,
      place_id,
      price,
      bedrooms,
      bathrooms,
      levels,
      size_sqm,
      features,
      description
    ) VALUES (
      @title,
      @type,
      @property_type,
      @area_text,
      @place_id,
      @price,
      @bedrooms,
      @bathrooms,
      @levels,
      @size_sqm,
      @features,
      @description
    )
  `);

  const result = stmt.run({
    title:         data.title.trim(),
    type:          data.type,
    property_type: data.property_type,
    area_text:     data.area_text.trim(),
    place_id:      data.place_id.trim(),

    // Price — null for exchange and donation
    price:         priceRequired ? toNumber(data.price) : null,

    // Optional numeric fields
    bedrooms:      toNumber(data.bedrooms),
    bathrooms:     toNumber(data.bathrooms),
    levels:        toNumber(data.levels),
    size_sqm:      toNumber(data.size_sqm),

    // SQLite cannot store arrays — serialize to JSON string
    features:      JSON.stringify(
                     Array.isArray(data.features) ? data.features : []
                   ),

    description:   data.description ? data.description.trim() : null,
  });

  // Fetch and return the full created ad from db
  return getAdById(result.lastInsertRowid);
}

/**
 * Parses a raw database row into a proper ad object.
 * SQLite stores features as a JSON string — this converts it back to an array.
 * @param {Object} row - raw db row
 * @returns {Object} parsed ad
 */
function parseAd(row) {
  return {
    ...row,
    features: row.features ? JSON.parse(row.features) : [],
  };
}

/**
 * Converts a value to a number or null.
 * Handles empty strings, undefined, and null safely.
 * @param {any} value
 * @returns {number|null}
 */
function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  return Number(value);
}

module.exports = { getAllAds, getAdById, createAd };