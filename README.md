# Task A – Mini Full-Stack Search

## Objective
Develop a compact search user interface that interacts with a backend route to retrieve and display the top matches from a local JSON dataset. The application also includes a micro scraper endpoint for reference, but it is **not required for Task A functionality**.

---

## Task A – Search Functionality

### Frontend
- A single web page containing:
  - Search input field
  - Loading and empty states

### Backend
- POST `/api/search`
  - Accepts JSON body: `{ "query": string }`
  - Returns top 3 matches from `data/faqs.json` based on keyword relevance.
  - Returns a combined 2-3 sentence summary of top matches.
  - Includes a `sources` field with IDs of top results.

**The search endpoint queries a local JSON dataset containing objects with the following fields:**
- `id`: Unique identifier for each FAQ
- `title`: Title of the FAQ
- `body`: Content of the FAQ

Example Request :
```http
POST /api/search
Content-Type: application/json
{
  "query": "trust badges"
}
```

Example Response (200)
```json
{
  "status": "success",
  "results": [
    {
      "id": "1",
      "title": "Trust badges near CTA",
      "body": "Adding trust badges near the primary CTA increased signups by 12%.",
      "score": 2
    }
  ],
  "count": 1,
  "summary": "Adding trust badges near the primary CTA increased signups by 12%.",
  "sources": ["1"]
}
```

### Acceptance Criteria
- Query accuracy: "trust badges" returns item id 1 as the top result
- Result limit & ordering: Max 3 items ordered by relevance

### Error handling:
- Empty query → 400 status code
- No matches → empty array with friendly message

## Task B – Micro Scraper (Reference Only)
**Endpoint**
GET `/api/scrape?url=...`

Returns:
```json
{
  "title": "Example Domain",
  "metaDescription": "This domain is for use in illustrative examples in documents.",
  "h1": "Example Domain",
  "status": 200
}
```
- Timeout: 20 seconds
- Handles invalid/missing URLs → 400
- Handles timeouts → 504
- Bonus: User-Agent override implemented

**Note:** This endpoint is included in this repo for demonstration but is submitted separately in the [Task-B repository](https://github.com/Mohansai-M/Dev_Mohansai_TaskB).

**Setup Instructions**
1. Clone Repository
   
```
git clone https://github.com/Mohansai-M/Dev_Mohansai_TaskA.git
cd Dev_Mohansai_TaskA
```
2. Install Dependencies

```
npm install
```
3. Run Development Server
```
npm run dev
```
4. Test Search API

Use the search UI at `http://localhost:3000/search` Or call `/api/search directly` with Postman

(Optional) Test Scraper API

### Tech Stack
- Next.js (React + API Routes)
- JavaScript
- Puppeteer – only for Task B

### Testing Checklist
- Search query returns correct top results
- Maximum of 3 results
- Loading, empty, and error states are handled
