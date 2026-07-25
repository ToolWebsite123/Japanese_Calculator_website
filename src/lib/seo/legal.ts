import { buildPageMetadata, type Metadata } from "./metadata";

type BuildLegalMetadataParams = {
  title: string;
  description: string;
  path: string;
};

export function buildLegalMetadata({
  title,
  description,
  path,
}: BuildLegalMetadataParams): Metadata {
  return buildPageMetadata({
    title,
    description,
    path,
    openGraphType: "website",
  });
}
