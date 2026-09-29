import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8FAFC",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: "#0F172A",
            letterSpacing: "-2px",
          }}
        >
          Chronicle
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#10B981",
            marginTop: 20,
          }}
        >
          Every writer has a Chronicle.
        </div>
      </div>
    ),
    { ...size }
  );
}
