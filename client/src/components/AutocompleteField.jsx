/**
 * Controlled text input with live area autocomplete.
 *
 * The backend provides suggestions at GET /api/autocomplete.
 *
 * Features:
 *  - Only searches after MIN_CHARS (3) characters are typed.
 *  - Debounced by DEBOUNCE_MS (300ms) to reduce API calls.
 *  - Supports keyboard navigation (↑ ↓ Enter Escape).
 *  - Selected suggestions appear as a read-only badge. × clears it.
 *  - Closes dropdown on outside clicks.
 *
 * @param {object} props
 * @param {string} props.value - Current text value (controlled)
 * @param {object|null} props.selectedPlace - Selected place object or null
 * @param {string} [props.error] - Validation error message
 * @param {Function} props.onChange - Called on text change
 * @param {Function} props.onSelect - Called with chosen place
 * @param {Function} props.onClear - Called when selection is cleared
 */
import  { useState, useEffect, useRef, useCallback } from "react";
import { fetchAutocomplete } from "../api/api.js";
import "./AutocompleteField.css";

const DEBOUNCE_MS = 300;
const MIN_CHARS = 3;


export default function AutocompleteField({
  value,
  selectedPlace,
  error,
  onChange,
  onSelect,
  onClear,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
 // ── API call 
    /** Query the backend for autocomplete suggestions. */
  const search = useCallback(async (query) => {
    if (query.length < MIN_CHARS) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const data = await fetchAutocomplete(query);
      setSuggestions(data);
      setIsOpen(data.length > 0);
      setHighlightedIndex(-1);
    } catch (err) {
      setApiError("Could not load suggestions. Try again.");
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  // ── Debounced search

  /** Trigger search after debounce; skip if a place is already selected. */
  useEffect(() => {
    if (selectedPlace) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [value, selectedPlace, search]);

    /** Close dropdown when clicking outside input or dropdown. */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // ── Keyboard navigation
    /** Handle Arrow keys, Enter, Escape in dropdown. */
  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) handleSelect(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };
// ── Handlers
  /** Confirm a selection and notify parent. */
  const handleSelect = (place) => {
    onSelect(place);
    setIsOpen(false);
    setSuggestions([]);
  };
  /** Forward input changes to parent; clear selection if typing again. */
  const handleInputChange = (e) => {
    onChange(e.target.value);
    if (selectedPlace) onClear();
  };

    // ── Render: badge mode 
  if (selectedPlace) {
    return (
      <div className="autocomplete-wrapper">
        <input
          ref={inputRef}
          className={`form-input${error ? " error" : ""}`}
          value={selectedPlace.mainText}
          readOnly
        />
        <div className="selected-area-badge">
          📍 {selectedPlace.mainText}
          {selectedPlace.secondaryText && `, ${selectedPlace.secondaryText}`}
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear selected area"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

    // ── Render: free-text mode
  return (
    <div className="autocomplete-wrapper">
      <input
        ref={inputRef}
        type="text"
        className={`form-input${error ? " error" : ""}`}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder="e.g. Kolonaki, Nafplio…"
        autoComplete="off"
      />

       {/* Hint when more characters are needed */}
      {value.length > 0 && value.length < MIN_CHARS && (
        <p className="autocomplete-hint">
          Type {MIN_CHARS - value.length} more character
          {MIN_CHARS - value.length !== 1 ? "s" : ""} to search…
        </p>
      )}

      {isLoading && (
        <p className="autocomplete-hint">Searching…</p>
      )}

      {apiError && (
        <p className="autocomplete-error">⚠ {apiError}</p>
      )}

        {/* Dropdown list */}
      {isOpen && (
        <div
          className="autocomplete-dropdown"
          ref={dropdownRef}
          role="listbox"
        >
          {suggestions.length === 0 ? (
            <div className="autocomplete-empty">No results found.</div>
          ) : (
            suggestions.map((place, idx) => (
              <div
                key={place.placeId}
                role="option"
                className={`autocomplete-item${
                  idx === highlightedIndex ? " highlighted" : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onMouseDown={() => handleSelect(place)}
              >
                <span className="autocomplete-main">{place.mainText}</span>
                {place.secondaryText && (
                  <span className="autocomplete-secondary">
                    {place.secondaryText}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}