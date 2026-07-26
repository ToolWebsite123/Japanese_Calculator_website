export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xn--2kr778m.online";
export const SITE_NAME = "電卓.Online";
export const HOME_META_TITLE = "電卓.Online｜オールインワン計算プラットフォーム";

export const HOME_META_DESCRIPTION =
  "電卓.online：BMI・分数・ルート・関数・複利・財務・単位変換など様々な計算を無料でまとめて提供。数値を入力するだけでリアルタイムに自動計算し、計算過程の確認やダウンロードも可能です。会員登録不要でブラウザからすぐ使え、入力データは外部に送信されません。スマホ・タブレット・PCに対応。";

export const LEGAL_PATHS = [
  "/about",
  "/privacy-policy",
  "/terms",
  "/contact",
  "/disclaimer",
] as const;

export function absoluteUrl(path = "/"): string {
  const normalized = path === "/" ? "/" : path.endsWith("/") ? path.slice(0, -1) : path;
  return normalized === "/" ? SITE_URL : `${SITE_URL}${normalized}`;
}
