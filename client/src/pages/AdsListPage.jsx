/**
 * @file AdsListPage.jsx
 * @description Page for browsing/searching property listings (/ads).
 *
 * Responsibilities:
 *  - Fetch ads from the API on mount.
 *  - Re-fetch when filters change.
 *  - Show loading, error, empty, or results states.
 *  - Display ads in a responsive grid using AdCard components.
 */
import  { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchAds } from "../api/api.js";
import AdCard from "../components/AdCard.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import "./AdsListPage.css";

export default function AdsListPage() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  // ── Fetch ads from API ──
  const loadAds = useCallback((filters = {}) => {
    setIsLoading(true);
    setError(null);
    fetchAds(filters)
      .then(setAds)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Load all ads on mount
  useEffect(() => {
    loadAds();
  }, [loadAds]);
 // ── Handle filters applied/reset from FilterPanel ──
  const handleFilter = (filters) => {
    setActiveFilters(filters);
    loadAds(filters);
  };
  // ── Render ──
  return (
    <>
      {/* Header */}
      <div className="list-header">
        <div>
          <h1 className="page-title">Browse Ads</h1>
          <p className="page-subtitle">
            {isLoading
              ? "Loading..."
              : `${ads.length} ${ads.length === 1 ? "listing" : "listings"} found`}
          </p>
        </div>
        <Link to="/" className="btn btn-primary">
          + Post New Ad
        </Link>
      </div>

      {/* Filter panel */}
      <FilterPanel onFilter={handleFilter} />

      {/* Loading */}
      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading ads...</p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="error-state">⚠ Could not load ads: {error}</div>
      )}

      {/* Empty state */}
      {!isLoading && !error && ads.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <h3>No ads found</h3>
          <p>
            {Object.values(activeFilters).some((v) =>
              Array.isArray(v) ? v.length > 0 : Boolean(v)
            )
              ? "Try adjusting your filters."
              : "Be the first to post a property!"}
          </p>
          <Link
            to="/"
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            + Post Ad
          </Link>
        </div>
      )}

      {/* Ads grid */}
      {!isLoading && !error && ads.length > 0 && (
        <div className="ads-grid">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </>
  );
}