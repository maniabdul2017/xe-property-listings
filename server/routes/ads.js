const express = require("express");
const router = express.Router();
const { getAds, getAd, postAd } = require("../controllers/adsController.js");

/**
 * GET /api/ads
 * Returns all ads, with optional query filters (type, property_type, price, bedrooms, features).
 */

router.get("/", getAds);

/**
 * GET /api/ads/:id
 * Returns a single ad by its numeric ID. Responds 404 if not found.
 */
router.get("/:id", getAd);

/**
 * POST /api/ads
 * Creates a new ad. Expects a valid ad payload in the request body.
 * Responds 201 on success, 422 if validation fails.
 */
router.post("/", postAd);

module.exports = router;