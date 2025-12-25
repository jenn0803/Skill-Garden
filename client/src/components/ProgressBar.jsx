// components/ProgressBar.jsx
export default function ProgressBar({ progress }) {
  return (
    <div style={{ background: "#eee", height: 10, borderRadius: 5, overflow: "hidden" }}>
      <div style={{ width: `${progress}%`, height: "100%", background: "#4caf50" }} />
    </div>
  );
}
