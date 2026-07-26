export type Metadata = {
  title?: string | { absolute: string };
  description?: string;
  keywords?: string[];
  alternates?: Record<string, unknown>;
  openGraph?: Record<string, unknown>;
  twitter?: Record<string, unknown>;
};

export type Viewport = Record<string, unknown>;

export namespace MetadataRoute {
  export type Sitemap = Array<Record<string, unknown>>;
  export type Robots = Record<string, unknown>;
}
