import { NextResponse } from "next/server";
import searchUtils from '../../utils/searchUtils'

export async function POST(req) {

  try {
    const body = await req.json();
    if (!body.query || !body.query.trim()) {
      return NextResponse.json(
        { error: "Query cannot be empty" },
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
        { message: "No matches found Please Try again", response: [] },
        { status: 200 }
      );
    }
   return NextResponse.json(
     {
       status: "success",
       results: topMatches,
       count: topMatches.length,
     },
     { status: 200 }
   );
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
