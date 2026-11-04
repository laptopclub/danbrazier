import { ImageResponse } from "next/og";

export const size = { height: 180, width: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#0a0a0a",
        color: "#ffffff",
        display: "flex",
        fontFamily: "Arial",
        fontSize: 120,
        fontWeight: 700,
        height: "100%",
        justifyContent: "center",
        width: "100%"
      }}
    >
      D
    </div>,
    size
  );
}
