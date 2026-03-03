require("./setup.js");

const request = require("supertest");
const { app } = require("../index.js");
const {
  validRentAd,
  validExchangeAd,
  validDonationAd,
} = require("./helpers/adFixtures.js");

// ── Health ────────────────────────────────────────────────────

describe("GET /api/health", () => {
  test("returns status ok", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

// ── Autocomplete ──────────────────────────────────────────────

describe("GET /api/autocomplete", () => {
  test("returns 400 when input is missing", async () => {
    const res = await request(app).get("/api/autocomplete");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/3 characters/);
  });

  test("returns 400 when input is less than 3 chars", async () => {
    const res = await request(app).get("/api/autocomplete?input=at");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/3 characters/);
  });

  test("returns 200 with array for valid input", async () => {
    const res = await request(app).get("/api/autocomplete?input=athens");

    if (res.status === 502) {
      console.warn("Skipping — upstream XE API unreachable");
      return;
    }

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ── POST /api/ads ─────────────────────────────────────────────

describe("POST /api/ads", () => {

  // ── Happy paths ───────────────────────────────────────────
  describe("successful creation", () => {
    test("creates rent ad and returns all fields", async () => {
      const payload = validRentAd();
      const res = await request(app).post("/api/ads").send(payload);

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.title).toBe(payload.title);
      expect(res.body.type).toBe("rent");
      expect(res.body.price).toBe(800);
      expect(res.body.place_id).toBe(payload.place_id);
      expect(Array.isArray(res.body.features)).toBe(true);
      expect(res.body.features).toContain("garden");
      expect(res.body.created_at).toBeDefined();
    });

    test("creates exchange ad with null price", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validExchangeAd());

      expect(res.status).toBe(201);
      expect(res.body.price).toBeNull();
      expect(res.body.type).toBe("exchange");
    });

    test("creates donation ad with null price", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validDonationAd());

      expect(res.status).toBe(201);
      expect(res.body.price).toBeNull();
    });

    test("creates minimal ad without bonus fields", async () => {
      const res = await request(app).post("/api/ads").send({
        title:         "Simple apartment",
        type:          "rent",
        property_type: "apartment",
        area_text:     "Athens, Greece",
        place_id:      "ChIJmin001",
        price:         500,
      });

      expect(res.status).toBe(201);
      expect(res.body.bedrooms).toBeNull();
      expect(res.body.bathrooms).toBeNull();
      expect(res.body.size_sqm).toBeNull();
      expect(res.body.features).toEqual([]);
      expect(res.body.description).toBeNull();
    });
  });

  // ── Required field validation ─────────────────────────────
  describe("required field validation", () => {
    test("returns 422 with errors array when body is empty", async () => {
      const res = await request(app).post("/api/ads").send({});

      expect(res.status).toBe(422);
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    test("returns 422 when title is missing", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validRentAd({ title: "" }));

      expect(res.status).toBe(422);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining("title")])
      );
    });

    test("returns 422 when title exceeds 155 chars", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validRentAd({ title: "a".repeat(156) }));

      expect(res.status).toBe(422);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining("155")])
      );
    });

    test("returns 422 when area_text is missing", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validRentAd({ area_text: "" }));

      expect(res.status).toBe(422);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining("area_text")])
      );
    });

    test("returns 422 when place_id is missing", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validRentAd({ place_id: "" }));

      expect(res.status).toBe(422);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining("place_id")])
      );
    });

    test("returns 422 for invalid type", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validRentAd({ type: "lease" }));

      expect(res.status).toBe(422);
    });

    test("returns 422 for invalid property_type", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validRentAd({ property_type: "castle" }));

      expect(res.status).toBe(422);
    });
  });

  // ── Business rules ────────────────────────────────────────
  describe("business rules", () => {
    test("returns 422 when price missing for rent", async () => {
      const { price, ...rest } = validRentAd();
      const res = await request(app).post("/api/ads").send(rest);

      expect(res.status).toBe(422);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining("price")])
      );
    });

    test("returns 422 when price is negative", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validRentAd({ price: -100 }));

      expect(res.status).toBe(422);
    });

    test("price not required for exchange", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validExchangeAd());

      expect(res.status).toBe(201);
      expect(res.body.price).toBeNull();
    });

    test("price not required for donation", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validDonationAd());

      expect(res.status).toBe(201);
      expect(res.body.price).toBeNull();
    });

    test("price is forced null even if sent for exchange", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validExchangeAd({ price: 999 }));

      expect(res.status).toBe(201);
      expect(res.body.price).toBeNull();
    });

    test("returns 422 when description missing for exchange", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validExchangeAd({ description: "" }));

      expect(res.status).toBe(422);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining("description")])
      );
    });

    test("description optional for donation", async () => {
      const res = await request(app)
        .post("/api/ads")
        .send(validDonationAd({ description: null }));

      expect(res.status).toBe(201);
    });
  });
});



describe("GET /api/ads", () => {
  beforeAll(async () => {
    await request(app).post("/api/ads").send(validRentAd({ price: 400 }));
    await request(app).post("/api/ads").send(validRentAd({ price: 900, bedrooms: 3 }));
    await request(app).post("/api/ads").send(validExchangeAd());
  });

  test("returns array of ads", async () => {
    const res = await request(app).get("/api/ads");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("features returned as array not string", async () => {
    const res = await request(app).get("/api/ads");

    res.body.forEach((ad) => {
      expect(Array.isArray(ad.features)).toBe(true);
    });
  });

  test("filters by type", async () => {
    const res = await request(app).get("/api/ads?type=exchange");

    expect(res.status).toBe(200);
    expect(res.body.every((ad) => ad.type === "exchange")).toBe(true);
  });

  test("filters by min_price", async () => {
    const res = await request(app).get("/api/ads?min_price=800");

    expect(res.status).toBe(200);
    expect(res.body.every((ad) => ad.price >= 800)).toBe(true);
  });

  test("filters by max_price", async () => {
    const res = await request(app).get("/api/ads?max_price=500");

    expect(res.status).toBe(200);
    expect(res.body.every((ad) => ad.price <= 500)).toBe(true);
  });

  test("filters by bedrooms", async () => {
    const res = await request(app).get("/api/ads?bedrooms=3");

    expect(res.status).toBe(200);
    expect(res.body.every((ad) => ad.bedrooms === 3)).toBe(true);
  });
});

// ── GET /api/ads/:id ──────────────────────────────────────────

describe("GET /api/ads/:id", () => {
  let createdAd;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/ads")
      .send(validRentAd());
    createdAd = res.body;
  });

  test("returns correct ad by id", async () => {
    const res = await request(app).get(`/api/ads/${createdAd.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdAd.id);
    expect(res.body.title).toBe(createdAd.title);
    expect(res.body.place_id).toBe(createdAd.place_id);
  });

  test("features returned as array", async () => {
    const res = await request(app).get(`/api/ads/${createdAd.id}`);

    expect(Array.isArray(res.body.features)).toBe(true);
    expect(res.body.features).toContain("garden");
  });

  test("returns 404 for non-existent id", async () => {
    const res = await request(app).get("/api/ads/99999");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Ad not found.");
  });
});