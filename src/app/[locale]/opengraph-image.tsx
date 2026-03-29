import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Crypto Timeline — A History of Cryptography";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const eras = [
  { name: "Caesar", year: "50 BC", color: "#c9a227" },
  { name: "DES", year: "1977", color: "#e8850a" },
  { name: "RSA", year: "1977", color: "#a855f7" },
  { name: "AES", year: "2001", color: "#00a3ff" },
  { name: "ECC", year: "1985", color: "#10b981" },
  { name: "PQC", year: "2024+", color: "#22d3ee" },
];

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #080b14 0%, #0d1117 40%, #161b27 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "48px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#e8eaf0",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            Crypto Timeline
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#8892a4",
              marginTop: "12px",
              display: "flex",
            }}
          >
            From Caesar to Quantum — An Interactive Cryptography Journey
          </div>
        </div>

        {/* Era timeline bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0",
            zIndex: 1,
          }}
        >
          {eras.map((era, i) => (
            <div
              key={era.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Connector line (not on first) */}
                {i > 0 && (
                  <div
                    style={{
                      width: "60px",
                      height: "2px",
                      background: `linear-gradient(90deg, ${eras[i - 1].color}40, ${era.color}40)`,
                      display: "flex",
                    }}
                  />
                )}
                {/* Era dot */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: era.color,
                    boxShadow: `0 0 20px ${era.color}60`,
                    display: "flex",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: era.color,
                  marginTop: "12px",
                  display: "flex",
                }}
              >
                {era.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#7a8599",
                  marginTop: "4px",
                  display: "flex",
                }}
              >
                {era.year}
              </div>
            </div>
          ))}
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#7a8599",
              display: "flex",
            }}
          >
            TechBi Company
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
