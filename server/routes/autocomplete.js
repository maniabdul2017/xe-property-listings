const express = require("express");
const router = express.Router();
const { getAutocomplete } = require("../controllers/autocompleteController.js");

/** GET /api/autocomplete */
router.get("/", getAutocomplete);

module.exports = router;