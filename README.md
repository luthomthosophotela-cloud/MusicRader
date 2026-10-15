# Mzansi Music Radar (Next.js)

1. `npm install`
2. Create an app at https://developer.spotify.com/dashboard, copy `.env.example` to `.env.local`, add the Client ID and Secret.
3. `npm run dev` then open http://localhost:3000
4. Deploy: push to GitHub, import in Vercel, add the same two env vars.

Without credentials the page still works and labels releases as sample data.

- `lib/spotify.ts` server-only token + `GET /v1/browse/new-releases?country=ZA`, cached 1 hour
- `app/api/releases/route.ts` JSON endpoint for the same data
- `lib/sample.ts` invented chart data; replace with scores computed from stored snapshots
- Spotify has no public ZA chart endpoint, so rankings must come from your own score (view growth + popularity + recency).
