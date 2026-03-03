/**
 * @file NewAdPage.jsx
 * @description Form page for creating a new property listing (/ route).
 *
 * Users can fill in title, type, property type, area (autocomplete), price,
 * optional numeric fields, features, and description. After submission, a
 * success banner appears and the form resets.
 */
import  { useState } from "react";
import { Link } from "react-router-dom";
import AutocompleteField from "../components/AutocompleteField.jsx";
import { createAd } from "../api/api.js";
import { TYPES, PROPERTY_TYPES, FEATURES } from "../constants/propertyConstants.js";
import "./NewAdPage.css";


const TITLE_MAX = 155;


const emptyForm = {
  title:         "",
  type:          "",
  property_type: "",
  areaText:      "", 
  placeId:       "", 
  selectedPlace: null,
  price:         "",
  bedrooms:      "",
  bathrooms:     "",
  levels:        "",
  size_sqm:      "",
  features:      [],
  description:   "",
};

export default function NewAdPage() {
  const [form, setForm]           = useState(emptyForm);
  const [errors, setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAd, setSuccessAd] = useState(null);

  // ── Helpers ──
  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
  };

  
  const toggleFeature = (value) =>
    setForm((f) => ({
      ...f,
      features: f.features.includes(value)
        ? f.features.filter((v) => v !== value)
        : [...f.features, value],
    }));


  const showPrice = form.type === "rent" || form.type === "buy";

  
  const descriptionRequired = form.type === "exchange";

  // ── Validation ──
  const validate = () => {
    const e = {};

    if (!form.title.trim())
      e.title = "Title is required.";
    else if (form.title.length > TITLE_MAX)
      e.title = `Title must be ≤ ${TITLE_MAX} characters.`;

    if (!form.type)
      e.type = "Please select a type.";

    if (!form.property_type)
      e.property_type = "Please select a property type.";

   
    if (!form.placeId)
      e.area = "Please select an area from the suggestions.";

    if (showPrice) {
      if (form.price === "" || form.price === null)
        e.price = "Price is required.";
      else if (isNaN(Number(form.price)) || Number(form.price) < 0)
        e.price = "Price must be a non-negative number.";
    }

    if (descriptionRequired && !form.description.trim())
      e.description = "Description is required for exchange.";

  
    if (form.bedrooms !== "" && isNaN(Number(form.bedrooms)))
      e.bedrooms = "Must be a number.";
    if (form.bathrooms !== "" && isNaN(Number(form.bathrooms)))
      e.bathrooms = "Must be a number.";
    if (form.levels !== "" && isNaN(Number(form.levels)))
      e.levels = "Must be a number.";
    if (form.size_sqm !== "" && isNaN(Number(form.size_sqm)))
      e.size_sqm = "Must be a number.";

    return e;
  };
  // ── Submit handler ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    const ve = validate();
    if (Object.keys(ve).length > 0) {
      setErrors(ve);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const ad = await createAd({
        title:         form.title.trim(),
        type:          form.type,
        property_type: form.property_type,
       
        area_text:     form.selectedPlace
          ? `${form.selectedPlace.mainText}${
              form.selectedPlace.secondaryText
                ? ", " + form.selectedPlace.secondaryText
                : ""
            }`
          : form.areaText,
        place_id:      form.placeId,
        price:         showPrice ? Number(form.price) : null,
        bedrooms:      form.bedrooms  !== "" ? Number(form.bedrooms)  : null,
        bathrooms:     form.bathrooms !== "" ? Number(form.bathrooms) : null,
        levels:        form.levels    !== "" ? Number(form.levels)    : null,
        size_sqm:      form.size_sqm  !== "" ? Number(form.size_sqm)  : null,
        features:      form.features,
        description:   form.description.trim() || null,
      });

      setSuccessAd(ad);
      setForm(emptyForm);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <>
      <h1 className="page-title">New property classified</h1>
      <p className="page-subtitle">Fill in the details below to list your property.</p>

      {/* Success banner — shown after a successful submission */}
      {successAd && (
        <div className="success-banner">
          ✅ Ad <strong>"{successAd.title}"</strong> posted successfully!{" "}
          <Link to="/ads">Browse all ads →</Link>
        </div>
      )}

      {/* Top-level API / network error */}
      {errors.submit && (
        <div className="error-banner">⚠ {errors.submit}</div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">

            {/* ── Title ── */}
            <div className="form-field full-width">
              <label className="form-label" htmlFor="title">
                Title <span className="required-star">*</span>
              </label>
              <input
                id="title"
                type="text"
                className={`form-input${errors.title ? " error" : ""}`}
                placeholder="Classified title up to 155 chars"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {errors.title && (
                  <span className="field-error">⚠ {errors.title}</span>
                )}
                <span
                  className={`char-count${form.title.length > TITLE_MAX ? " warning" : ""}`}
                  style={{ marginLeft: "auto" }}
                >
                  {form.title.length}/{TITLE_MAX}
                </span>
              </div>
            </div>

            {/* ── Listing type ── */}
            <div className="form-field">
              <label className="form-label" htmlFor="type">
                Type <span className="required-star">*</span>
              </label>
              <select
                id="type"
                className={`form-select${errors.type ? " error" : ""}`}
                value={form.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  setField("type", newType);
                  /* Clear price when switching to a non-monetary type */
                  if (newType === "exchange" || newType === "donation") {
                    setField("price", "");
                  }
                }}
              >
                <option value="">Select type</option>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.type && (
                <span className="field-error">⚠ {errors.type}</span>
              )}
            </div>

            {/* ── Property type ── */}
            <div className="form-field">
              <label className="form-label" htmlFor="property_type">
                Property Type <span className="required-star">*</span>
              </label>
              <select
                id="property_type"
                className={`form-select${errors.property_type ? " error" : ""}`}
                value={form.property_type}
                onChange={(e) => setField("property_type", e.target.value)}
              >
                <option value="">Select property type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.property_type && (
                <span className="field-error">⚠ {errors.property_type}</span>
              )}
            </div>


            <div className="form-field full-width">
              <label className="form-label">
                Area <span className="required-star">*</span>
              </label>
              <AutocompleteField
                value={form.areaText}
                selectedPlace={form.selectedPlace}
                error={errors.area}
                onChange={(text) => setField("areaText", text)}
                onSelect={(place) => {
                  setForm((f) => ({
                    ...f,
                    areaText:      place.mainText,
                    placeId:       place.placeId,
                    selectedPlace: place,
                  }));
                  if (errors.area) setErrors((e) => ({ ...e, area: null }));
                }}
                onClear={() =>
                  setForm((f) => ({
                    ...f,
                    areaText:      "",
                    placeId:       "",
                    selectedPlace: null,
                  }))
                }
              />
              {errors.area && (
                <span className="field-error">⚠ {errors.area}</span>
              )}
            </div>

            {/* ── Price — only for rent/buy ── */}
            {showPrice && (
              <div className="form-field">
                <label className="form-label" htmlFor="price">
                  Price in Euros <span className="required-star">*</span>
                </label>
                <div className="price-input-wrapper">
                  <span className="price-prefix">€</span>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    className={`form-input${errors.price ? " error" : ""}`}
                    placeholder="Amount"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                  />
                </div>
                {errors.price && (
                  <span className="field-error">⚠ {errors.price}</span>
                )}
              </div>
            )}

            {/* ── Optional numeric fields ── */}

            <div className="form-field">
              <label className="form-label" htmlFor="size_sqm">Size (sq.m)</label>
              <input
                id="size_sqm" type="number" min="0"
                className={`form-input${errors.size_sqm ? " error" : ""}`}
                placeholder="e.g. 85"
                value={form.size_sqm}
                onChange={(e) => setField("size_sqm", e.target.value)}
              />
              {errors.size_sqm && <span className="field-error">⚠ {errors.size_sqm}</span>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="bedrooms">Bedrooms</label>
              <input
                id="bedrooms" type="number" min="0"
                className={`form-input${errors.bedrooms ? " error" : ""}`}
                placeholder="e.g. 2"
                value={form.bedrooms}
                onChange={(e) => setField("bedrooms", e.target.value)}
              />
              {errors.bedrooms && <span className="field-error">⚠ {errors.bedrooms}</span>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="bathrooms">Bathrooms</label>
              <input
                id="bathrooms" type="number" min="0"
                className={`form-input${errors.bathrooms ? " error" : ""}`}
                placeholder="e.g. 1"
                value={form.bathrooms}
                onChange={(e) => setField("bathrooms", e.target.value)}
              />
              {errors.bathrooms && <span className="field-error">⚠ {errors.bathrooms}</span>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="levels">Levels</label>
              <input
                id="levels" type="number" min="0"
                className={`form-input${errors.levels ? " error" : ""}`}
                placeholder="e.g. 1"
                value={form.levels}
                onChange={(e) => setField("levels", e.target.value)}
              />
              {errors.levels && <span className="field-error">⚠ {errors.levels}</span>}
            </div>

            {/* ── Features — multi-select checkboxes ── */}
            <div className="form-field full-width">
              <label className="form-label">Features</label>
              <div className="features-grid">
                {FEATURES.map((f) => (
                  <label key={f.value} className="feature-checkbox">
                    <input
                      type="checkbox"
                      checked={form.features.includes(f.value)}
                      onChange={() => toggleFeature(f.value)}
                    />
                    <span>{f.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Description — required for exchange, optional otherwise ── */}
            <div className="form-field full-width">
              <label className="form-label" htmlFor="description">
                Description{" "}
                {descriptionRequired ? (
                  <span className="required-star">*</span>
                ) : (
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                    (optional)
                  </span>
                )}
              </label>
              <textarea
                id="description"
                className={`form-textarea${errors.description ? " error" : ""}`}
                placeholder={
                  descriptionRequired
                    ? "Describe what you want to exchange and what you are looking for…"
                    : "Additional details about your property…"
                }
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={4}
              />
              {errors.description && (
                <span className="field-error">⚠ {errors.description}</span>
              )}
            </div>

          </div>

          {/* ── Form actions ── */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting…" : "Submit Ad"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              disabled={isSubmitting}
              onClick={() => {
                setForm(emptyForm);
                setErrors({});
                setSuccessAd(null);
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
}