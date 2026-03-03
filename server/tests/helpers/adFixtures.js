function validRentAd(overrides = {}) {
  return {
    title:         "Beautiful apartment in Kolonaki",
    type:          "rent",
    property_type: "apartment",
    area_text:     "Kolonaki, Athens, Ελλάδα",
    place_id:      "ChIJabc123",
    price:         800,
    bedrooms:      2,
    bathrooms:     1,
    levels:        1,
    size_sqm:      75,
    features:      ["garden", "balcony"],
    description:   "Nice place with a great view.",
    ...overrides,
  };
}

function validExchangeAd(overrides = {}) {
  return {
    title:         "Studio for exchange in Piraeus",
    type:          "exchange",
    property_type: "studio",
    area_text:     "Piraeus, Ελλάδα",
    place_id:      "ChIJghi789",
    features:      ["furnished"],
    description:   "Looking to exchange for a 2-bedroom apartment.",
    ...overrides,
  };
}

function validDonationAd(overrides = {}) {
  return {
    title:         "Land available for donation",
    type:          "donation",
    property_type: "land",
    area_text:     "Nafplio, Ελλάδα",
    place_id:      "ChIJjkl012",
    features:      [],
    description:   null,
    ...overrides,
  };
}

module.exports = { validRentAd, validExchangeAd, validDonationAd };