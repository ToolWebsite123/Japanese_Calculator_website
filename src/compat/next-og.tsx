import type { ReactElement } from "react";

export class ImageResponse extends Response {
  constructor(_element: ReactElement, init: { width?: number; height?: number } = {}) {
    super("", {
      status: 200,
      headers: {
        "content-type": "image/png",
        "x-image-width": String(init.width ?? ""),
        "x-image-height": String(init.height ?? ""),
      },
    });
  }
}