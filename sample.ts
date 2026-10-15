import type { Track, Release, Artist } from "./types";
// Invented demo data. Replace TRACKS with computed scores once snapshots exist in the database.
const t = (title: string, artist: string, genre: string, score: number, move: number, history: number[], hue: number, extra: Partial<Track> = {}): Track => ({ title, artist, genre, score, move, history, hue, ...extra });
export const TRACKS: Track[] = [
  // Real track added by hand. Title, artists and cover come from its Spotify page; genre and score are placeholders.
  t("Nayvee's Prayer", "DJ Zinhle, Nayvee Womculo, Young Stunna", "Amapiano", 93, 0, [93, 93, 93, 93, 93, 93], 0, {
    image: "https://i.scdn.co/image/ab67616d0000b273269a92c3f4038da72977c4d4",
    url: "https://open.spotify.com/track/5egspxTv2n1RX7etEQqXul",
    pinned: true,
  }),
  t("Mlilo Wami", "Thandeka Vuyo", "Amapiano", 96, 4, [40, 52, 58, 70, 81, 96], 0),
  t("Sunset on Bree", "Kgosi & The Taxi Kings", "Afro-pop", 91, 2, [60, 64, 70, 78, 85, 91], 1),
  t("Ngiyabonga", "Zinhle Mabaso", "Gospel", 88, 6, [30, 44, 55, 63, 78, 88], 2),
  t("Durban Heat", "DJ Ndlovu Jr", "Gqom", 84, -1, [90, 88, 86, 85, 85, 84], 0),
  t("Joburg Sleeps Never", "Lwazi M", "Hip-hop", 81, 3, [50, 55, 63, 70, 76, 81], 3),
  t("Inkomo", "Mthandeni Zungu", "Maskandi", 77, 9, [20, 28, 38, 52, 66, 77], 1),
  t("Log Drum Letter", "Naledi Sky", "Amapiano", 74, -2, [82, 80, 79, 78, 76, 74], 2),
  t("Karoo Nights", "Dry Rivers", "Afro-pop", 69, 1, [60, 62, 63, 66, 67, 69], 3),
  t("Hamba Juba", "Sbu the Voice", "Amapiano", 66, 5, [30, 36, 44, 52, 60, 66], 0),
  t("Rooftop Prayer", "Grace Ledwaba", "Gospel", 62, 0, [60, 62, 61, 62, 62, 62], 1),
];
export const ARTISTS: Artist[] = [
  { name: "Mthandeni Zungu", genre: "Maskandi", growth: "+212%" },
  { name: "Naledi Sky", genre: "Amapiano", growth: "+148%" },
  { name: "Dry Rivers", genre: "Afro-pop", growth: "+96%" },
];
export const SAMPLE_RELEASES: Release[] = [
  { id: "s1", title: "Phakama", artist: "Thandeka Vuyo", kind: "Single", when: "Today" },
  { id: "s2", title: "Midnight Taxi", artist: "Kgosi & The Taxi Kings", kind: "EP", when: "Yesterday" },
  { id: "s3", title: "Umoya", artist: "Zinhle Mabaso", kind: "Single", when: "2 days ago" },
  { id: "s4", title: "Lobola Season", artist: "Sbu the Voice", kind: "Album", when: "4 days ago" },
];
