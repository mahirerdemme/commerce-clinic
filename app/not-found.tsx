export const metadata = { title: "Sayfa bulunamadı | Commerce Clinic", robots: { index: false } };

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
        color: "#111",
        background: "#fff",
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ fontSize: ".75rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#666", margin: 0 }}>
          404
        </p>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 500, letterSpacing: "-.03em", margin: "1rem 0" }}>
          Bu sayfa bulunamadı.
        </h1>
        <a
          href="/"
          style={{
            display: "inline-flex",
            minHeight: 48,
            alignItems: "center",
            padding: "0 1.375rem",
            borderRadius: 12,
            background: "#0A0A0A",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Ana sayfaya dön
        </a>
      </div>
    </main>
  );
}
