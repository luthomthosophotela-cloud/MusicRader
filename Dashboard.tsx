"use client";
import { useState } from "react";
import type { Track, Release, Artist } from "@/lib/types";

const GENRES = ["All", "Amapiano", "Hip-hop", "Gqom", "Maskandi", "Afro-pop", "Gospel"];
const GRAD = ["#7a2cff,#ff4d7d", "#f6b81c,#e8590c", "#0f9d7a,#1b3a8a", "#ff4d7d,#7a1f5c"];

function Art({ name, hue, size, image }: { name: string; hue: number; size: number; image?: string }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  return (
    <div className="art" style={{ width: size, height: size, background: `linear-gradient(135deg,${GRAD[hue % 4]})` }}>
      {image ? <img src={image} alt="" /> : initials}
    </div>
  );
}

function Spark({ data, up }: { data: number[]; up: boolean }) {
  const mx = Math.max(...data), mn = Math.min(...data);
  const pts = data.map((v, i) => `${i * 14},${22 - ((v - mn) / (mx - mn || 1)) * 20}`).join(" ");
  return <svg className="spark" viewBox="0 0 70 24"><polyline points={pts} fill="none" stroke={up ? "var(--grn)" : "var(--pro)"} strokeWidth="2" /></svg>;
}

const Move = ({ m }: { m: number }) =>
  m > 0 ? <span className="mv up">▲ {m}</span> : m < 0 ? <span className="mv dn">▼ {-m}</span> : <span className="mv mut">–</span>;

export default function Dashboard({ tracks, artists, releases, live, note }: { tracks: Track[]; artists: Artist[]; releases: Release[]; live: boolean; note?: string }) {
  const [genre, setGenre] = useState("All");
  const [sel, setSel] = useState(0);
  const [following, setFollowing] = useState<Set<number>>(new Set());
  const cur = tracks[sel];
  const rows = tracks.map((t, i) => ({ t, i })).filter(({ t }) => genre === "All" || t.genre === genre);

  const toggleTheme = () => {
    const d = document.documentElement;
    const dark = d.dataset.theme ? d.dataset.theme === "dark" : matchMedia("(prefers-color-scheme:dark)").matches;
    d.dataset.theme = dark ? "light" : "dark";
  };
  const toggleFollow = (i: number) => setFollowing(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="wrap">
      <header>
        <div className="logo"><span className="dot" />Mzansi Music Radar</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="sample" title={note}>{live ? "Releases: live from Spotify" : "Releases: sample data"}</span>
          <button className="tg" onClick={toggleTheme} aria-label="Toggle light or dark mode">Theme</button>
        </div>
      </header>

      <section className="hero">
        <div>
          <h1>Every new South African song, on one radar.</h1>
          <p>Track what dropped today, what is climbing, and which artists are about to break. Tap a blip to see the track.</p>
          <div className="now" aria-live="polite">
            <Art name={cur.title} hue={cur.hue} size={64} image={cur.image} />
            <div><b>{cur.title}</b><div className="mut">{cur.artist}</div><span className="tag">{cur.genre}</span> <span className="tag">Score {cur.score}</span>{cur.pinned && <> <span className="tag">Added by you</span></>}{cur.url && <div><a href={cur.url} target="_blank" rel="noreferrer" style={{ color: "var(--taxi)" }}>Open on Spotify</a></div>}</div>
          </div>
        </div>
        <div className="radar" role="group" aria-label="Radar of trending songs">
          <svg viewBox="0 0 100 100"><g fill="none" stroke="var(--line)" strokeWidth=".4"><circle cx="50" cy="50" r="15" /><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="46" /><path d="M50 4v92M4 50h92" /></g></svg>
          <div className="sweep" />
          {tracks.map((t, i) => {
            const a = (i * 137.5 * Math.PI) / 180, d = 46 - ((t.score - 60) / 36) * 36 + 4, s = 8 + t.score / 12;
            return <button key={i} className="blip" aria-label={`${t.title} by ${t.artist}`} aria-pressed={i === sel}
              style={{ left: `${50 + Math.cos(a) * d}%`, top: `${50 + Math.sin(a) * d}%`, width: s, height: s, opacity: genre === "All" || genre === t.genre ? 1 : 0.2 }}
              onClick={() => setSel(i)} />;
          })}
        </div>
      </section>

      <div className="tabs" role="group" aria-label="Filter by genre">
        {GENRES.map(g => <button key={g} className="tab" aria-pressed={g === genre} onClick={() => setGenre(g)}>{g}</button>)}
      </div>

      <div className="cols">
        <section>
          <h2>Trending chart</h2>
          {rows.length ? rows.map(({ t, i }, k) => (
            <button key={i} className="row" aria-pressed={i === sel} onClick={() => setSel(i)}>
              <span className="rk">{k + 1}</span><Art name={t.title} hue={t.hue} size={44} image={t.image} />
              <span><b>{t.title}</b><br /><span className="mut">{t.artist} · {t.genre}</span></span>
              <Spark data={t.history} up={t.move >= 0} /><Move m={t.move} />
            </button>
          )) : <div className="empty">No {genre} tracks on the chart yet. Try another genre.</div>}
          <p className="mut" style={{ fontSize: 13 }}>Chart scores are sample data until daily snapshots are stored.</p>
        </section>
        <aside>
          <h2>Released this week</h2>
          {note && <div className="empty" style={{ marginBottom: 10 }}>{note}</div>}
          {releases.map((r, i) => {
            const body = (<>
              <Art name={r.title} hue={i} size={52} image={r.image} />
              <div><b>{r.title}</b><div className="mut">{r.artist}</div><span className="tag">{r.kind}</span> <span className="tag">{r.when}</span></div>
            </>);
            return r.url ? <a key={r.id} className="card" href={r.url} target="_blank" rel="noreferrer">{body}</a> : <div key={r.id} className="card">{body}</div>;
          })}
          {live && <p className="mut" style={{ fontSize: 13 }}>Spotify lists releases available in South Africa, not only South African artists.</p>}
          <h2 style={{ marginTop: 24 }}>Artists to watch</h2>
          {artists.map((a, i) => (
            <div className="card" key={a.name}>
              <Art name={a.name} hue={i + 1} size={52} />
              <div><b>{a.name}</b><div className="mut">{a.genre} · <span className="up">{a.growth}</span> listeners</div></div>
              <button className="follow" aria-pressed={following.has(i)} onClick={() => toggleFollow(i)}>{following.has(i) ? "Following" : "Follow"}</button>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
