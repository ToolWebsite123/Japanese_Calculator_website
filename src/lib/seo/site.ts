export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.xn--2kr778m.online";
export const SITE_NAME = "電卓.Online";
export const HOME_META_TITLE =
  "電卓オンライン｜関数電卓・税金計算・単位変換など無料計算ツール集｜電卓.online";

export const HOME_META_DESCRIPTION =
  "電卓.onlineは、関数電卓・BMI・分数・ルート・複利・所得税・単位変換など25種類の計算ツールを無料で提供するサイトです。数値を入力するだけでリアルタイムに自動計算。会員登録不要でブラウザからすぐ使え、入力データは外部に送信されません。";

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
