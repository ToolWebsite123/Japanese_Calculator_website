import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "坪・畳・㎡（平米）変換計算機｜坪数・畳数をかんたん換算｜電卓.online";
const metaDescription =
  "坪・畳・㎡（平米）を相互に変換できる無料計算機。1坪＝約3.306㎡の換算に加え、京間・中京間・江戸間・団地間など畳の種類にも対応。坪・㎡・畳の早見表つきで、土地や部屋の広さの確認に役立ちます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/tsubo-converter",
  keywords: ["坪 計算", "坪数", "畳 換算", "平米 変換", "坪 平米"],
});
