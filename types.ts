export type Track = { title: string; artist: string; genre: string; score: number; move: number; history: number[]; hue: number; image?: string; url?: string; pinned?: boolean };
export type Release = { id: string; title: string; artist: string; kind: string; when: string; image?: string; url?: string };
export type Artist = { name: string; genre: string; growth: string };
