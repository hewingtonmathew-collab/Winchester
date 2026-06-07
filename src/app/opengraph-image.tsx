import { ImageResponse } from "next/og";

export const alt = "SafeShield — School Compliance Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B1118",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Georgia, 'Times New Roman', serif",
          position: "relative",
        }}
      >
        {/* Gold left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "15%",
            bottom: "15%",
            width: "4px",
            background: "#C9A84C",
            opacity: 0.7,
            display: "flex",
          }}
        />

        {/* Shield bars + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "0px",
            marginBottom: "40px",
          }}
        >
          {/* 5-bar shield mark */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "5px",
              marginRight: "28px",
              paddingBottom: "2px",
            }}
          >
            <div style={{ width: "10px", height: 24, background: "#C9A84C", borderRadius: "2px", opacity: 0.85, display: "flex" }} />
            <div style={{ width: "10px", height: 34, background: "#C9A84C", borderRadius: "2px", opacity: 0.85, display: "flex" }} />
            <div style={{ width: "10px", height: 42, background: "#C9A84C", borderRadius: "2px", opacity: 1.0, display: "flex" }} />
            <div style={{ width: "10px", height: 34, background: "#C9A84C", borderRadius: "2px", opacity: 0.85, display: "flex" }} />
            <div style={{ width: "10px", height: 24, background: "#C9A84C", borderRadius: "2px", opacity: 0.85, display: "flex" }} />
          </div>

          {/* Wordmark */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "7px",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                lineHeight: 1,
              }}
            >
              WINCHESTER CONSULTANCY
            </span>
            <span
              style={{
                color: "#C9A84C",
                fontSize: "13px",
                letterSpacing: "0.28em",
                lineHeight: 1,
              }}
            >
              SCHOOL COMPLIANCE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: "72px",
            height: "1px",
            background: "#C9A84C",
            opacity: 0.6,
            marginBottom: "40px",
            display: "flex",
          }}
        />

        {/* Main headline — flexDirection column so text wraps predictably */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.05,
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontSize: "66px",
              fontWeight: 900,
            }}
          >
            Intelligence That Builds
          </span>
          <span
            style={{
              color: "#C9A84C",
              fontSize: "66px",
              fontWeight: 900,
            }}
          >
            Confidence.
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            color: "#A7B1BE",
            fontSize: "24px",
            fontWeight: 400,
            lineHeight: 1.5,
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Strategic assurance for schools and multi-academy trusts.
        </div>
      </div>
    ),
    { ...size }
  );
}
