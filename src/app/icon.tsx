import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A1622",
          borderRadius: 8,
        }}
      >
        <svg width={24} height={24} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3FBFE3" />
              <stop offset="100%" stopColor="#1B95C0" />
            </linearGradient>
          </defs>
          <path d="M32 4 L56 14 V32 C56 44 46 54 32 60 C18 54 8 44 8 32 V14 Z" fill="url(#g)" />
          <line x1="32" y1="14" x2="32" y2="48" stroke="white" strokeWidth="3" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
