export default function Loading() {
  return <div className="wrap" style={{ paddingTop: 40 }}>{[0, 1, 2, 3, 4].map(i => <div className="sk" key={i} />)}</div>;
}
