"use client";

import { useState } from "react";
import "./search.css";

interface Item {
  id: string;
  title: string;
  body: string;
}

interface SearchResponse {
  status: string;
  results: Item[];
  count: number;
  summary?: string;
  sources?: string[];
  message?: string;
  error?: string;
}

export default function Search() {
  const [search, setSearch] = useState("");
  const [apiRes, setApiRes] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (value: string) => {
    setSearch(value);
  };

 const handleSearch = async () => {
   if (!search.trim()) {
     setError("Please enter a search query");
     setApiRes(null);
     return;
   }

   if (search.trim().length < 2) {
     setError("Please enter at least 2 characters to search");
     setApiRes(null);
     return;
   }
   setLoading(true);
   setError("");
   setApiRes(null);

   try {
     const response = await fetch("/api/search", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ query: search }),
     });

     const data: SearchResponse = await response.json();

     if (data.status === "error") {
       setError(data.error || "Something went wrong");
       setApiRes(null);
     } else if (data.results?.length === 0) {
       setError(data.message || "No results found please try again");
       setApiRes(null);
     } else {
       setApiRes(data);
       setError("");
     }
   } catch (err) {
     setError("Network or server error. Please try again.");
     setApiRes(null);
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
        <button onClick={() => handleSearch()} className="search-button">
          Search
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="search-results-section">
        {apiRes?.results?.map((item) => (
          <div key={item?.id} className="result-card">
            <h3 className="result-title">{item?.title}</h3>
            <p className="result-body">
              {item.body.length > 60
                ? item.body.slice(0, 60) + "..."
                : item.body}
            </p>
          </div>
        ))}

        {apiRes?.summary && (
          <div className="summary-section">
            <h2 className="summary-title">Summary</h2>
            <p className="summary-text">{apiRes?.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
