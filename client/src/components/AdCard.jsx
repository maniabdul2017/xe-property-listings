/**
 * Clickable card showing a property listing summary.
 *
 * Used in the AdsListPage grid. Clicking navigates to the detail view (/ads/:id).
 *
 * Shows:
 *  - Type and property type badges
 *  - Title, location, price
 *  - Quick stats (size, bedrooms, bathrooms, levels)
 *  - Feature tags
 *  - Short description (2 lines via CSS)
 *  - Footer with post date and listing ID
 *
 * @param {{ ad: object }} props
 * @param {object} props.ad - Listing object from GET /api/ads
 * @param {number} props.ad.id
 * @param {string} props.ad.type - "rent" | "buy" | "exchange" | "donation"
 * @param {string} props.ad.property_type - "house" | "apartment" | …
 * @param {string} props.ad.title
 * @param {string} props.ad.area_text
 * @param {number|null} props.ad.price
 * @param {number} [props.ad.size_sqm]
 * @param {number} [props.ad.bedrooms]
 * @param {number} [props.ad.bathrooms]
 * @param {number} [props.ad.levels]
 * @param {string[]} [props.ad.features]
 * @param {string} [props.ad.description]
 * @param {string} props.ad.created_at -  timestamp
 */


import { Link } from "react-router-dom";
import { TYPE_LABELS, PROPERTY_TYPE_LABELS } from "../constants/propertyConstants.js";
import { formatPrice, formatDate } from "../utils/formatters.js";
import "./AdCard.css";

/** Re-export format helpers for backward compatibility */
export { formatPrice, formatDate };


export default function AdCard({ ad }) {
  return (
    <Link to={`/ads/${ad.id}`} className="ad-card">

      {/* ── Type + property-type badges ── */}
      <div className="ad-card-badges">
        <span className="badge badge-type">
          {TYPE_LABELS[ad.type] ?? ad.type}
        </span>
        {ad.property_type && (
          <span className="badge badge-property">
            {PROPERTY_TYPE_LABELS[ad.property_type] ?? ad.property_type}
          </span>
        )}
      </div>

      {/* ── Title ── */}
      <h2 className="ad-title">{ad.title}</h2>

      {/* ── Location ── */}
      <div className="ad-area">
        <span>📍</span>
        <span>{ad.area_text}</span>
      </div>

      {/* ── Price — omitted for exchange/donation ── */}
      {ad.price !== null && (
        <div className="ad-price">
          {formatPrice(ad.price, ad.type)}
        </div>
      )}

      {/* ── Quick stats (size, bedrooms, bathrooms, levels) ── */}
      {(ad.size_sqm || ad.bedrooms || ad.bathrooms || ad.levels) && (
        <div className="ad-stats">
          {ad.size_sqm  && <span className="ad-stat">📐 {ad.size_sqm} m²</span>}
          {ad.bedrooms  && <span className="ad-stat">🛏 {ad.bedrooms} bed</span>}
          {ad.bathrooms && <span className="ad-stat">🚿 {ad.bathrooms} bath</span>}
          {ad.levels    && (
            <span className="ad-stat">
              🏢 {ad.levels} {ad.levels === 1 ? "level" : "levels"}
            </span>
          )}
        </div>
      )}

      {/* ── Feature tags ── */}
      {ad.features && ad.features.length > 0 && (
        <div className="ad-features">
          {ad.features.map((f) => (
            <span key={f} className="ad-feature-tag">
              {f.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      {/* ── Truncated description (2 lines) ── */}
      {ad.description && (
        <p className="ad-description">{ad.description}</p>
      )}

      {/* ── Footer: post date + ad ID ── */}
      <div className="ad-footer">
        <span>Posted {formatDate(ad.created_at)}</span>
        <span className="ad-id">#{ad.id}</span>
      </div>

    </Link>
  );
}