import Dashboard from "@/components/Dashboard";
import { getNewReleases } from "@/lib/spotify";
import { TRACKS, ARTISTS } from "@/lib/sample";
export const revalidate = 3600;
export default async function Page() {
  const { releases, live, note } = await getNewReleases();
  return <Dashboard tracks={TRACKS} artists={ARTISTS} releases={releases} live={live} note={note} />;
}
