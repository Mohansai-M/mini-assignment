import { NextResponse } from "next/server";
import searchUtils from '../../utils/searchUtils'

export async function POST(req) {

  try {
    const body = await req.json();
    if (!body.query || !body.query.trim()) {
      return NextResponse.json(
        {
          status: "error",
          error: "Query cannot be empty",
          results: [],
          count: 0,
        },
        { status: 400 }
      );
    }
    const searchWords = body.query.toLowerCase().split(" ");
    const searchResults = searchUtils(searchWords);
    searchResults.sort((a, b) => b.score - a.score);
    const topMatches = searchResults
      .filter((item) => item.score > 0)
      .slice(0, 3);
    if (topMatches.length === 0) {
      return NextResponse.json(
        {
          status: "success",
          results: [],
          count: 0,
          message: "No matches found. Please try again.",
        },
        { status: 200 }
      );
    }

    const combinedText = topMatches.map((item) => item.body).join(" ");
    const sentences =  combinedText.split(".").filter(Boolean).slice(0, 3).join(". ") + ".";
    const sources = topMatches.map((item) => item.id);

    return NextResponse.json(
      {
        status: "success",
        results: topMatches,
        count: topMatches.length,
        summary: sentences,
        sources: sources,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: "Invalid request or server error",
        results: [],
        count: 0,
      },
      { status: 400 }
    );
  }
}
