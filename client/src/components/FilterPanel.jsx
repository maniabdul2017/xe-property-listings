/**
 * @file FilterPanel.jsx
 * @description Collapsible filter panel for filtering property listings on AdsListPage.
 *
 * By default the panel is collapsed. Expanding it shows:
 *  - Listing type pills       (rent / buy / exchange / donation)
 *  - Property type pills      (house / apartment / studio / …)
 *  - Price range inputs       (hidden for exchange & donation)
 *  - Bedroom count pills      (1 / 2 / 3 / 4+)
 *  - Feature multi-select pills (garden / balcony / parking / …)
 *
 * This component only handles local state for the filters.
 * The parent component is responsible for fetching the ads based on the filters.
 *
 * Props:
 *  - onFilter(filters) → called when "Apply" or "Reset" is clicked.
 */
import  { useState } from "react";
import {
  TYPES,
  PROPERTY_TYPES,
  FEATURES,
  BEDROOM_OPTIONS,
} from "../constants/propertyConstants.js";
import "./FilterPanel.css";


const emptyFilters = {
  type:          "",
  property_type: "",
  min_price:     "",
  max_price:     "",
  bedrooms:      "",
  features:      [],
};

export default function FilterPanel({ onFilter }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [isOpen, setIsOpen] = useState(false); // panel collapsed by default

   // Update a single filter field (like type, bedrooms, min_price)
  const setFilter = (name, value) =>
    setFilters((f) => ({ ...f, [name]: value }));

   // Toggle a feature on/off (multi-select)
  const toggleFeature = (value) =>
    setFilters((f) => ({
      ...f,
      features: f.features.includes(value)
        ? f.features.filter((v) => v !== value)
        : [...f.features, value],
    }));

  
 // ── Actions ──
  const handleApply = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    onFilter(emptyFilters);
    setIsOpen(false);
  };

   // Count active filters for badge
  const activeCount =
    [
      filters.type,
      filters.property_type,
      filters.min_price,
      filters.max_price,
      filters.bedrooms,
    ].filter(Boolean).length + filters.features.length;

  // Show price range inputs only for rent/buy, or if no type is selected
  const showPrice =
    filters.type === "rent" || filters.type === "buy" || filters.type === "";

  return (
    <div className="filter-panel">

      
      {/* Toggle button */}
      <button
        className="filter-toggle-btn"
        onClick={() => setIsOpen((o) => !o)}
        type="button"
        aria-expanded={isOpen}
      >
        <span>🔍 Filters</span>
        {activeCount > 0 && (
          <span className="filter-badge">{activeCount}</span>
        )}
        <span className="filter-chevron">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* ── Collapsible body ── */}
      {isOpen && (
        <div className="filter-body">
          <div className="filter-grid">

            {/* Listing type pills */}
            <div className="filter-field">
              <label className="filter-label">Type</label>
              <div className="filter-pills">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`filter-pill${
                      filters.type === t.value ? " active" : ""
                    }`}
                    onClick={() =>
                      setFilter("type", filters.type === t.value ? "" : t.value)
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property type pills */}
            <div className="filter-field">
              <label className="filter-label">Property Type</label>
              <div className="filter-pills">
                {PROPERTY_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`filter-pill${
                      filters.property_type === t.value ? " active" : ""
                    }`}
                    onClick={() =>
                      setFilter(
                        "property_type",
                        filters.property_type === t.value ? "" : t.value
                      )
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range — only shown for rent/buy */}
            {showPrice && (
              <div className="filter-field">
                <label className="filter-label">Price Range (€)</label>
                <div className="filter-price-row">
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="Min"
                    min="0"
                    value={filters.min_price}
                    onChange={(e) => setFilter("min_price", e.target.value)}
                  />
                  <span className="filter-price-separator">—</span>
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="Max"
                    min="0"
                    value={filters.max_price}
                    onChange={(e) => setFilter("max_price", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Bedroom quick-filters */}
            <div className="filter-field">
              <label className="filter-label">Bedrooms</label>
              <div className="filter-pills">
                {BEDROOM_OPTIONS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`filter-pill${
                      filters.bedrooms === b ? " active" : ""
                    }`}
                    onClick={() =>
                      setFilter("bedrooms", filters.bedrooms === b ? "" : b)
                    }
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Features — multi-select pills, spans full grid width */}
            <div className="filter-field full-width">
              <label className="filter-label">Features</label>
              <div className="filter-pills">
                {FEATURES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    className={`filter-pill${
                      filters.features.includes(f.value) ? " active" : ""
                    }`}
                    onClick={() => toggleFeature(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── Actions ── */}
          <div className="filter-actions">
            <button type="button" className="btn btn-primary" onClick={handleApply}>
              Apply Filters
            </button>
            <button type="button" className="btn btn-outline" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}