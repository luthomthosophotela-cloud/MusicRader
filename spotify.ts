import "server-only";
import type { Release } from "./types";
import { SAMPLE_RELEASES } from "./sample";

let cached: { token: string; exp: number } | null = null;

async function getToken(): Promise<string | null> {
  if (cached && cached.exp > Date.now()) return cached.token;
  const id = process.env.SPOTIFY_CLIENT_ID, secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!r.ok) return null;
  const j = await r.json();
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 };
  return cached.token;
}

const ago = (d: string) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 864e5);
  return days <= 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
};

export type ReleasesResult = { releases: Release[]; live: boolean; note?: string };

// Spotify's "new releases" for the ZA market. It lists releases available in South Africa,
// not only South African artists, so the UI says so. Cached for an hour to protect rate limits.
export async function getNewReleases(): Promise<ReleasesResult> {
  try {
    const token = await getToken();
    if (!token) return { releases: SAMPLE_RELEASES, live: false, note: "Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to show live releases." };
    const r = await fetch("https://api.spotify.com/v1/browse/new-releases?country=ZA&limit=12", {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });
    if (!r.ok) return { releases: SAMPLE_RELEASES, live: false, note: `Spotify returned ${r.status}. Showing sample releases.` };
    const j = await r.json();
    const releases: Release[] = j.albums.items.map((a: any) => ({
      id: a.id, title: a.name, artist: a.artists.map((x: any) => x.name).join(", "),
      kind: a.album_type === "album" ? "Album" : a.album_type === "single" ? "Single" : "Release",
      when: ago(a.release_date), image: a.images?.[1]?.url ?? a.images?.[0]?.url, url: a.external_urls?.spotify,
    }));
    return { releases, live: true };
  } catch {
    return { releases: SAMPLE_RELEASES, live: false, note: "Could not reach Spotify. Showing sample releases." };
  }
}
