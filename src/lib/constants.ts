export type CalculatorCategory =
  | "basic"
  | "scientific"
  | "finance"
  | "health"
  | "conversion"
  | "more";

export type NavItem = {
  href: string;
  labelKey: string;
  icon: string;
  category: CalculatorCategory;
  descriptionKey?: string;
  primary?: boolean;
  secondary?: boolean;
};

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    href: "/scientific-calculator",
    labelKey: "nav.scientific",
    icon: "ƒ",
    category: "scientific",
    descriptionKey: "scientific.description",
    primary: true,
  },
  {
    href: "/fraction-calculator",
    labelKey: "nav.fraction",
    icon: "分",
    category: "scientific",
    descriptionKey: "fraction.description",
    primary: true,
  },
  {
    href: "/squareroot-calculator",
    labelKey: "nav.root",
    icon: "√",
    category: "scientific",
    descriptionKey: "root.description",
    primary: true,
  },
  {
    href: "/algebra-calculator",
    labelKey: "nav.algebra",
    icon: "x",
    category: "scientific",
    descriptionKey: "algebra.description",
    primary: true,
  },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    href: "/web-calculator",
    labelKey: "nav.webCalculator",
    icon: "W",
    category: "basic",
    descriptionKey: "webCalculator.description",
    secondary: true,
  },
  {
    href: "/financial-calculator",
    labelKey: "nav.financial",
    icon: "金",
    category: "finance",
    descriptionKey: "financial.description",
    secondary: true,
  },
  {
    href: "/time-calculator",
    labelKey: "nav.time",
    icon: "時",
    category: "basic",
    descriptionKey: "time.description",
    secondary: true,
  },
  {
    href: "/percentage-calculator",
    labelKey: "nav.percentage",
    icon: "%",
    category: "basic",
    descriptionKey: "percentageCalc.description",
    secondary: true,
  },
  {
    href: "/factorization-calculator",
    labelKey: "nav.factorization",
    icon: "因",
    category: "scientific",
    descriptionKey: "factorization.description",
    secondary: true,
  },
  {
    href: "/compound-interest-calculator",
    labelKey: "nav.compoundInterest",
    icon: "複",
    category: "finance",
    descriptionKey: "compoundInterest.description",
    secondary: true,
  },
  {
    href: "/simultaneous-equations-calculator",
    labelKey: "nav.simultaneousEquations",
    icon: "連",
    category: "scientific",
    descriptionKey: "simultaneousEquations.description",
    secondary: true,
  },
  {
    href: "/interest-calculator",
    labelKey: "nav.interest",
    icon: "利",
    category: "finance",
    descriptionKey: "interestMethod.description",
    secondary: true,
  },
  {
    href: "/long-division-calculator",
    labelKey: "nav.longDivision",
    icon: "筆",
    category: "basic",
    descriptionKey: "longDivision.description",
    secondary: true,
  },
  {
    href: "/bmi-calculator",
    labelKey: "nav.bmi",
    icon: "B",
    category: "health",
    descriptionKey: "bmi.description",
    secondary: true,
  },
  {
    href: "/unit-converter",
    labelKey: "nav.units",
    icon: "⇄",
    category: "conversion",
    descriptionKey: "units.description",
    secondary: true,
  },
  {
    href: "/era-converter",
    labelKey: "nav.era",
    icon: "暦",
    category: "conversion",
    descriptionKey: "era.description",
    secondary: true,
  },
  {
    href: "/social-insurance-calculator",
    labelKey: "nav.socialInsurance",
    icon: "保",
    category: "finance",
    descriptionKey: "socialInsurance.description",
    secondary: true,
  },
  { href: "/unemployment-insurance-calculation", labelKey: "失業保険 計算", icon: "失", category: "finance", descriptionKey: "unemploymentInsurance.description", secondary: true },
  { href: "/discount-calculation", labelKey: "割引 計算", icon: "割", category: "basic", descriptionKey: "discountCalc.description", secondary: true },
  { href: "/due-date-calculation", labelKey: "出産予定日 計算", icon: "産", category: "health", descriptionKey: "dueDate.description", secondary: true },
  { href: "/mahjong-score-calculation", labelKey: "麻雀 点数 計算", icon: "麻", category: "more", descriptionKey: "mahjong.description", secondary: true },
  { href: "/income-tax-calculation", labelKey: "所得税 計算", icon: "税", category: "finance", descriptionKey: "incomeTax.description", secondary: true },
  { href: "/furusato-nozei-calculation", labelKey: "ふるさと納税", icon: "納", category: "finance", descriptionKey: "furusatoNozei.description", secondary: true },
  { href: "/furusato-nozei-simulation-calculation", labelKey: "ふるさと納税 シミュレーション", icon: "詳", category: "finance", descriptionKey: "furusatoNozei.description", secondary: true },
];

export const NAV_ITEMS: NavItem[] = [
  ...PRIMARY_NAV_ITEMS,
  ...SECONDARY_NAV_ITEMS,
];

export const HISTORY_MAX = 10;
export const HISTORY_STORAGE_KEY = "dentaku-pro-history";
export const THEME_STORAGE_KEY = "dentaku-pro-theme";

export const TAX_RATES = [0.08, 0.1] as const;
