import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B1118",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "2px",
          paddingBottom: "5px",
          borderRadius: "6px",
        }}
      >
        {[7, 10, 13, 10, 7].map((h, i) => (
          <div
            key={i}
            style={{
              width: "3px",
              height: h,
              background: "#C9A84C",
              borderRadius: "1px",
              opacity: i === 2 ? 1 : 0.85,
            }}
          />
        ))}
      </div>
    ),
    { ...size }
  );
}
