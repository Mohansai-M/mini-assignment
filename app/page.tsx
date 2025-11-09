"use client";
import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Search and Scrap</h1>

      <div className="link-group">
        <Link href="/Search" className="nav-link search-link">
          Go to Search
        </Link>
      </div>
    </div>
  );
}
