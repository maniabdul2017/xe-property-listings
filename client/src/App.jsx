/**
 * Root application component.
 *
 * Renders the main layout (header + page content) and defines
 * the top-level routes of the app.
 */

import { Routes, Route, NavLink } from "react-router-dom";
import NewAdPage from "./pages/NewAdPage.jsx";
import AdsListPage from "./pages/AdsListPage.jsx";
import AdDetailPage from "./pages/AdDetailPage.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app-wrapper">
       {/* Header with main navigation */}
      <header className="site-header">
        <div className="header-inner">
           {/* Logo – links to the new ad page */}
          <NavLink to="/" className="logo">
            <div className="logo-circle">xe</div>
            <span className="logo-text">Property Ads</span>
          </NavLink>
          <nav className="header-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              + Post Ad
            </NavLink>
            <NavLink
              to="/ads"
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              Browse Ads
            </NavLink>
          </nav>
        </div>
      </header>
        {/* Routed page content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<NewAdPage />} />
          <Route path="/ads" element={<AdsListPage />} />
          <Route path="/ads/:id" element={<AdDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}