"use client";

import { useState } from "react";
import "./search.css";

interface Item {
  id: string;
  title: string;
  body: string;
}

export default function Search() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (value: string) => {
    setSearch(value);
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      setError("Please enter a search query");
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: search }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setResults([]);
      } else if (data.response?.length === 0) {
        setError(data.message || "No results found pleasse try again");
      } else {
        setResults(data.results);
      }
    } catch (err) {
      setError("error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1 className="search-title">FAQ Search</h1>

      <div className="search-input-group">
        <input
          type="text"
          value={search}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter search query"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="search-results-section">
        {results.map((item: Item) => (
          <div key={item.id} className="result-card">
            <h3 className="result-title">{item.title}</h3>
            <p className="result-body">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
