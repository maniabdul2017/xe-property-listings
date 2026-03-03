const { getAllAds, getAdById, createAd } = require("../services/adsService.js");

const VALID_TYPES = ["rent", "buy", "exchange", "donation"];

const VALID_PROPERTY_TYPES = [
  "house",
  "apartment",
  "studio",
  "maisonette",
  "villa",
  "land",
  "commercial",
  "other",
];
/**
 * Validate ad payload before creation.
 * @param {object} adData
 * @returns {string[]} validation errors
 */

function validateAd({
  title,
  type,
  area_text,
  place_id,
  price,
  property_type,
  bedrooms,
  bathrooms,
  levels,
  size_sqm,
  description,
}) {
  const errors = [];

  
  if (!title || !title.trim())
    errors.push("title is required.");
  if (title && title.length > 155)
    errors.push("title must be ≤ 155 characters.");

  if (!type)
    errors.push("type is required.");
  if (type && !VALID_TYPES.includes(type))
    errors.push("type must be one of: rent, buy, exchange, donation.");

  if (!property_type)
    errors.push("property_type is required.");
  if (property_type && !VALID_PROPERTY_TYPES.includes(property_type))
    errors.push("invalid property type.");

  if (!area_text || !area_text.trim())
    errors.push("area_text is required.");
  if (!place_id || !place_id.trim())
    errors.push("place_id is required.");

  
  const priceRequired = type === "rent" || type === "buy";
  if (priceRequired) {
    if (price === undefined || price === null || price === "")
      errors.push("price is required for rent and buy.");
    else if (isNaN(Number(price)) || Number(price) < 0)
      errors.push("price must be a non-negative number.");
  }


  if (type === "exchange" && (!description || !description.trim()))
    errors.push("description is required for exchange.");


  if (bedrooms !== undefined && bedrooms !== null && bedrooms !== "") {
    if (isNaN(Number(bedrooms)) || Number(bedrooms) < 0)
      errors.push("bedrooms must be a non-negative number.");
  }
  if (bathrooms !== undefined && bathrooms !== null && bathrooms !== "") {
    if (isNaN(Number(bathrooms)) || Number(bathrooms) < 0)
      errors.push("bathrooms must be a non-negative number.");
  }
  if (levels !== undefined && levels !== null && levels !== "") {
    if (isNaN(Number(levels)) || Number(levels) < 0)
      errors.push("levels must be a non-negative number.");
  }
  if (size_sqm !== undefined && size_sqm !== null && size_sqm !== "") {
    if (isNaN(Number(size_sqm)) || Number(size_sqm) < 0)
      errors.push("size_sqm must be a non-negative number.");
  }

  return errors;
}
/**
 * GET /api/ads
 */

function getAds(req, res) {
  const {
    type,
    property_type,
    min_price,
    max_price,
    bedrooms,
    features,
  } = req.query;

  let results = getAllAds();

  
  if (type) {
    results = results.filter((ad) => ad.type === type);
  }

  
  if (property_type) {
    results = results.filter((ad) => ad.property_type === property_type);
  }

  
  if (min_price) {
    results = results.filter(
      (ad) => ad.price !== null && ad.price >= Number(min_price)
    );
  }


  if (max_price) {
    results = results.filter(
      (ad) => ad.price !== null && ad.price <= Number(max_price)
    );
  }

  
  if (bedrooms) {
    
    if (bedrooms === "4+") {
      results = results.filter((ad) => ad.bedrooms >= 4);
    } else {
      results = results.filter((ad) => ad.bedrooms === Number(bedrooms));
    }
  }

  
  if (features) {
    const requiredFeatures = features.split(",");
    results = results.filter((ad) =>
      requiredFeatures.every((f) => ad.features.includes(f))
    );
  }

  return res.json(results);
}

function getAd(req, res) {
  const ad = getAdById(Number(req.params.id));
  if (!ad) return res.status(404).json({ error: "Ad not found." });
  return res.json(ad);
}
/**
 * POST /api/ads
 */

function postAd(req, res) {
  const errors = validateAd(req.body);
  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }
  const ad = createAd(req.body);
  return res.status(201).json(ad);
}

module.exports = { getAds, getAd, postAd };