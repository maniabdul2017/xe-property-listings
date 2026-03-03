const { getSuggestions } = require("../services/autocompleteService.js");

/**
 * GET /api/autocomplete
 */
async function getAutocomplete(req, res) {
  const { input } = req.query;

  if (!input || input.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Query must be at least 3 characters." });
  }

  try {
    const suggestions = await getSuggestions(input);
    return res.json(suggestions);
  } catch (err) {
    console.error("[autocomplete] error:", err.message);
    return res
      .status(502)
      .json({ error: "Failed to reach autocomplete service." });
  }
}

module.exports = { getAutocomplete };