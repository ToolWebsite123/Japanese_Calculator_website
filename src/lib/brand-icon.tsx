import { ImageResponse } from "next/og";

type BrandIconOptions = {
  size: number;
  borderRadius?: number;
  fontSize: number;
};

export function createBrandIconResponse({
  size,
  borderRadius = Math.round(size * 0.2),
  fontSize,
}: BrandIconOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#231942",
          borderRadius,
          color: "white",
          fontSize,
          fontWeight: 700,
        }}
      >
        電
      </div>
    ),
    { width: size, height: size }
  );
}
