import { ImageResponse } from "next/og";

export const size = { height: 32, width: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#0a0a0a",
        color: "#ffffff",
        display: "flex",
        fontFamily: "Arial",
        fontSize: 22,
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
