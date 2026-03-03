/**
 * @file AdDetailPage.jsx
 * @description Full view for a single property listing (/ads/:id)
 *
 * Layout:
 *  - Left column: main content — badges, title, location, price, stats, description, features.
 *  - Right column: sticky sidebar — structured property details + Google Maps link.
 *
 * Data is fetched from GET /api/ads/:id on mount (or if :id changes).
 */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAd } from "../api/api.js";
import { formatPrice, formatDate } from "../utils/formatters.js";
import { TYPE_LABELS, PROPERTY_TYPE_LABELS } from "../constants/propertyConstants.js";
import "./AdDetailPage.css";


export default function AdDetailPage() {
  const { id } = useParams();

  const [ad, setAd] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

    // Fetch ad details whenever the route param changes
  useEffect(() => {
    fetchAd(id)
      .then(setAd)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [id]);

    // ── Loading state ──
  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading ad...</p>
      </div>
    );
  }

  // ── Error / not found ──
  if (error || !ad) {
    return (
      <div className="detail-error">
        <h2>Ad not found</h2>
        <p>This ad may have been removed or does not exist.</p>
        <Link to="/ads" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          ← Back to Ads
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link to="/ads" className="back-link">← Back to Ads</Link>

      <div className="detail-wrapper">


        <div className="detail-main">

          {/* Badges */}
          <div className="ad-card-badges" style={{ marginBottom: "0.75rem" }}>
            <span className="badge badge-type">
              {TYPE_LABELS[ad.type] ?? ad.type}
            </span>
            {ad.property_type && (
              <span className="badge badge-property">
                {PROPERTY_TYPE_LABELS[ad.property_type] ?? ad.property_type}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="detail-title">{ad.title}</h1>

          {/* Location */}
          <div className="detail-area">
            <span>📍</span>
            <span>{ad.area_text}</span>
          </div>

          {/* Price — shown for rent/buy only */}
          {ad.price !== null && ad.price !== undefined && (
            <div className="detail-price">
              {formatPrice(ad.price, ad.type)}
            </div>
          )}

          {/* Contextual label when the listing has no monetary price */}
          {(ad.type === "exchange" || ad.type === "donation") && (
            <div className="detail-no-price">
              {ad.type === "exchange"
                ? "🔄 Available for exchange"
                : "🎁 Available for donation"}
            </div>
          )}

          {/* Quick-stat boxes */}
          {(ad.size_sqm || ad.bedrooms || ad.bathrooms || ad.levels) && (
            <div className="detail-stats">
              {ad.size_sqm && (
                <div className="detail-stat-box">
                  <span className="detail-stat-icon">📐</span>
                  <span className="detail-stat-value">{ad.size_sqm} m²</span>
                  <span className="detail-stat-label">Size</span>
                </div>
              )}
              {ad.bedrooms && (
                <div className="detail-stat-box">
                  <span className="detail-stat-icon">🛏</span>
                  <span className="detail-stat-value">{ad.bedrooms}</span>
                  <span className="detail-stat-label">Bedrooms</span>
                </div>
              )}
              {ad.bathrooms && (
                <div className="detail-stat-box">
                  <span className="detail-stat-icon">🚿</span>
                  <span className="detail-stat-value">{ad.bathrooms}</span>
                  <span className="detail-stat-label">Bathrooms</span>
                </div>
              )}
              {ad.levels && (
                <div className="detail-stat-box">
                  <span className="detail-stat-icon">🏢</span>
                  <span className="detail-stat-value">{ad.levels}</span>
                  <span className="detail-stat-label">Levels</span>
                </div>
              )}
            </div>
          )}

              {/* Description */}
          {ad.description && (
            <div className="detail-section">
              <h3 className="detail-section-title">Description</h3>
              <p className="detail-description">{ad.description}</p>
            </div>
          )}

           {/* Features */}
          {ad.features && ad.features.length > 0 && (
            <div className="detail-section">
              <h3 className="detail-section-title">Features</h3>
              <div className="detail-features">
                {ad.features.map((f) => (
                  <span key={f} className="detail-feature-tag">
                    ✓ {f.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

 
        {/* ── Right column: sticky sidebar ── */}
        <div className="detail-sidebar">
          <div className="detail-info-card">
            <h3 className="detail-section-title">Property Details</h3>

            <div className="detail-info-list">

              
              <div className="detail-info-row">
                <span className="detail-info-label">Listing Type</span>
                <span className="detail-info-value">
                  {TYPE_LABELS[ad.type] ?? ad.type}
                </span>
              </div>

              {ad.property_type && (
                <div className="detail-info-row">
                  <span className="detail-info-label">Property</span>
                  <span className="detail-info-value">
                    {PROPERTY_TYPE_LABELS[ad.property_type] ?? ad.property_type}
                  </span>
                </div>
              )}

              {ad.price !== null && ad.price !== undefined && (
                <div className="detail-info-row">
                  <span className="detail-info-label">Price</span>
                  <span className="detail-info-value">
                    {formatPrice(ad.price, ad.type)}
                  </span>
                </div>
              )}

              {ad.size_sqm && (
                <div className="detail-info-row">
                  <span className="detail-info-label">Size</span>
                  <span className="detail-info-value">{ad.size_sqm} m²</span>
                </div>
              )}

              {ad.bedrooms && (
                <div className="detail-info-row">
                  <span className="detail-info-label">Bedrooms</span>
                  <span className="detail-info-value">{ad.bedrooms}</span>
                </div>
              )}

              {ad.bathrooms && (
                <div className="detail-info-row">
                  <span className="detail-info-label">Bathrooms</span>
                  <span className="detail-info-value">{ad.bathrooms}</span>
                </div>
              )}

              {ad.levels && (
                <div className="detail-info-row">
                  <span className="detail-info-label">Levels</span>
                  <span className="detail-info-value">{ad.levels}</span>
                </div>
              )}

              <div className="detail-info-row">
                <span className="detail-info-label">Posted</span>
                <span className="detail-info-value">
                  {formatDate(ad.created_at)}
                </span>
              </div>

              <div className="detail-info-row">
                <span className="detail-info-label">Ad ID</span>
                <span className="detail-info-value">#{ad.id}</span>
              </div>

            </div>

            
             <div className="detail-place-id">
              <span>🗺 Place ID: </span>
              <code>{ad.place_id}</code>
            </div>

            {/* Deep-link to Google Maps using the stored place_id */}
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${ad.place_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="maps-link"
            >
              🗺 View on Google Maps →
            </a>
          </div>
        </div>

      </div>
    </>
  );
}