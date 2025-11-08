"use client";

import { useState } from "react";
import "./scrap.css";

function Scrap() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setError("");
    setData(null);

    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/scrap?url=${encodeURIComponent(url)}`);
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
      } else {
        setData(result);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scrap-container">
      <h2 className="scrap-title">Web Page Scraper</h2>

      <div className="scrap-input-section">
        <input
          type="text"
          placeholder="Enter a valid URL (https://...)"
          className="scrap-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleScrape}
          disabled={loading}
          className="scrap-button"
        >
          {loading ? "Scraping..." : "Scrape"}
        </button>
      </div>

      {error && <p className="scrap-error">{error}</p>}

      {data && (
        <div className="scrap-result">
          <h3>Scraped Data</h3>
          <p>
            <strong>Title:</strong> {data.title || "N/A"}
          </p>
          <p>
            <strong>Meta Description:</strong> {data.metaDescription || "N/A"}
          </p>
          {data.h1 && data.h1.length > 0 && (
            <div>
              <strong>H3 Tags:</strong>
              <ul className="heading-list">
                {data.h1.map((h1, index) => (
                  <li key={index}>{h1}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Scrap;
