export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.xn--2kr778m.online";
export const SITE_NAME = "電卓.Online";
export const HOME_META_TITLE =
  "無料Web電卓・計算機｜関数電卓・税金・BMIなど25種の計算ツール｜電卓.online";

export const HOME_META_DESCRIPTION =
  "無料で使えるWeb電卓・計算機サイト。関数電卓・消費税（税込・税抜）・BMI・複利・所得税・単位変換など全25種の計算ツールを登録不要で提供。スマホ対応で、入力データは外部に送信されません。";

export const LEGAL_PATHS = [
  "/about",
  "/privacy-policy",
  "/terms",
  "/contact",
  "/disclaimer",
] as const;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path.replace(/^https?:\/\/xn--2kr778m\.online/, SITE_URL);
  }
  const normalized = path === "/" ? "/" : path.endsWith("/") ? path.slice(0, -1) : path;
  const cleanPath = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return cleanPath === "/" ? SITE_URL : `${SITE_URL}${cleanPath}`;
}
