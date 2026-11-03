// Core Japanese dictionary: only the strings shared across the whole site
// (layout, navigation, footer, hub, and small shared label sets).
//
// Per-page strings used to live in this file as one 171 KB object, which
// forced every page — legal pages included — to preload the strings of all
// 34 pages (the ~161 KB shared chunk behind the mobile LCP render delay).
// They now live in ./pages/<page>.ts modules (LCP fix F1) and are imported
// only by the components of that page. Keep page-specific copy out of this
// file: anything added here is loaded on every page.
const ja = {
  appName: "オンライン電卓",
  appTagline: "無料オンライン電卓サイト",
  headerTagline: "無料で使えるオンライン計算ツール",
  nav: {
    standard: "電卓",
    scientific: "関数電卓",
    fraction: "分数電卓（乗算対応）",
    root: "ルート計算機",
    characterCount: "文字数計算機",
    tsubo: "坪・畳・㎡ 変換",
    graph: "グラフ計算機",
    algebra: "文字式計算機",
    tax: "消費税計算機",
    discount: "割引計算機",
    loan: "ローン計算機",
    salary: "給料計算機",
    bmi: "BMIの計算",
    units: "単位変換",
    era: "和暦西暦変換",
    history: "履歴",
    menu: "メニュー",
    more: "その他",
    allCalculators: "すべての電卓",
    home: "ホーム",
    calculatorsList: "電卓一覧",
    howToUse: "使い方",
    primarySection: "計算機",
    secondarySection: "その他の計算機",
    webCalculator: "Web電卓",
    financial: "金融電卓",
    time: "時間計算機",
    bookkeeping: "帳簿電卓",
    percentage: "パーセント計算機",
    factorization: "因数分解計算機",
    compoundInterest: "複利計算機",
    simultaneousEquations: "連立方程式計算機",
    interest: "利息計算",
    longDivision: "筆算電卓",
    socialInsurance: "社会保険料計算",
  },
  common: {
    calculate: "計算する",
    clear: "クリア",
    copy: "コピー",
    copied: "コピーしました",
    result: "結果",
    historyEmpty: "履歴はありません",
    historyClear: "履歴を消去",
    lightMode: "ライトモード",
    darkMode: "ダークモード",
    close: "閉じる",
    estimate: "概算",
    note: "注意",
    error: "計算エラー",
    invalidInput: "入力が正しくありません",
    decimal: "小数",
    simplified: "約分後",
  },
  standard: {
    title: "電卓",
    description: "登録不要の電卓無料ツール。四則演算・括弧・メモリに対応した基本計算機。",
    seoHeading: "無料オンライン電卓サイト",
    seoText:
      "基本電卓・関数電卓・分数電卓・ルート計算機・文字式計算機など、用途別に設計された無料のWeb電卓を提供しています。アプリのインストールは不要で、ブラウザからすぐに計算できます。",
  },
  webCalculator: {
    title: "Web電卓",
    description: "インストール不要でブラウザですぐ使えるWeb電卓。税込・税抜、メモリー、計算履歴に対応しています。",
  },
  tsubo: {
    description:
      "坪・畳・㎡（平米）を相互に変換できる計算機。京間・中京間・江戸間・団地間など畳の種類にも対応し、早見表つき。",
  },
  graph: {
    description:
      "関数の式を入力するとグラフを描く計算機。二次関数・三角関数・指数関数などに対応し、値の表も表示。",
  },
  percentageCalc: {
    title: "パーセント計算機",
    description: "比率や増減率を求めるパーセント計算機。割引計算の下準備にも使えます。",
    value: "値",
    percentage: "パーセント (%)",
  },
  bookkeeping: {
    title: "帳簿電卓",
    description: "簿記向け00キー付き帳簿電卓。経理作業に使える計算アプリ向けツール。",
  },
  tax: {
    title: "消費税計算機",
    description: "税率8%・10%に対応した消費税計算機。税込み計算と税抜き計算の両方に対応。",
    rate: "税率",
    price: "金額",
    taxIncluded: "税込",
    taxExcluded: "税抜",
    taxAmount: "消費税額",
    total: "合計",
    mode: "計算モード",
  },
  discount: {
    title: "割引計算機",
    description: "割引率から値下げ後の価格を出す割引計算機。セール時の割引計算に。",
    original: "元の価格",
    discountRate: "割引率",
    finalPrice: "割引後価格",
    saved: "節約額",
  },
  loan: {
    title: "ローン計算機",
    description: "毎月返済額・総利息を試算するローン計算機。住宅ローン計算機としても活用。",
    principal: "借入金額",
    annualRate: "年利（%）",
    termYears: "返済期間（年）",
    monthlyPayment: "月々の返済額",
    totalInterest: "総利息",
    totalPayment: "総返済額",
    amortization: "返済スケジュール",
    payoffGraph: "残高推移グラフ",
    period: "回数",
    payment: "返済額",
    interest: "利息",
    principalPart: "元金",
    balance: "残高",
    scheduleMonthlyNote: "返済期間が5年未満のため、毎月の返済明細を表示しています。",
    scheduleYearlyNote: "返済期間が長いため、見やすさを優先して年ごとの合計で表示しています。",
    remainingBalance: "残高推移",
  },
  salary: {
    title: "給料計算機",
    description: "額面給与から手取りを概算する給料計算機。税金控除後の手取り計算に。",
    grossMonthly: "額面月収",
    grossAnnual: "額面年収",
    netMonthly: "手取り月収（概算）",
    netAnnual: "手取り年収（概算）",
    incomeTax: "所得税",
    residentTax: "住民税",
    healthInsurance: "健康保険料",
    pension: "厚生年金",
    employmentInsurance: "雇用保険",
    socialInsurance: "社会保険合計",
    totalDeductions: "控除合計",
    disclaimer: "本計算は概算です。実際の手取り額とは異なる場合があります。",
  },
  categories: {
    basicName: "基本",
    basicDescription: "四則演算・パーセント・時間計算など日常の計算",
    scientificName: "関数",
    scientificDescription: "関数電卓・分数・代数式など数学計算",
    financeName: "金融",
    financeDescription: "複利・利息・金融計算などお金の計算",
    healthName: "健康",
    healthDescription: "BMIなど健康管理に役立つ計算",
    conversionName: "変換",
    conversionDescription: "単位変換・和暦変換など",
    moreName: "もっと見る",
    moreDescription: "筆算・因数分解・連立方程式などその他の計算機",
  },
  home: {
    allCalculators: "計算機一覧",
    searchPlaceholder: "計算機を検索（例：複利、BMI、関数電卓）",
    searchLabel: "計算機を検索",
    searchNoResults: "該当する計算機が見つかりません",
    categoriesTitle: "カテゴリから探す",
    footerTagline:
      "日常のニーズに対応するオンライン電卓を提供しています。簡単な計算から金融計算、科学計算まで、数秒で正確な結果が得られます。",
    footerCopyright: "© 2026 電卓.オンライン. All rights reserved.",
    faqTitle: "電卓.onlineのよくある質問",
    faqItems: [
      {
        question: "電卓.onlineの計算機はすべて無料ですか？",
        answer:
          "はい。このページのWeb電卓を含め、全28種のツールを無料で使えます。会員登録やアプリのインストールは不要で、ページを開いてすぐに計算できます。",
      },
      {
        question: "2+2×2の答えが6になるのはなぜですか？",
        answer:
          "標準モードでは、掛け算・割り算を先に計算する数学の順序で式全体を評価するため、2×2＝4を先に計算して6になります。押した順に左から計算したい場合は、電卓上部の「計算順序」を「左から順に」に切り替えると、2+2＝4、4×2＝8という順序で計算できます。",
      },
      {
        question: "税込・税抜の計算はできますか？",
        answer:
          "できます。金額を入力して「税込」または「税抜」ボタンを押すだけです。税率は10％と軽減税率8％を切り替えられます。税額の内訳や端数処理の方法まで確認したい場合は、専用の消費税計算機が便利です。",
      },
      {
        question: "入力した数値や計算履歴は保存されますか？",
        answer:
          "サーバーへ送信・保存することはありません。計算はすべてお使いのブラウザの中で処理されます。履歴はブラウザ内にのみ記録され、メモリー（M1〜M3）はページを開いている間だけ保持されます。",
      },
      {
        question: "スマートフォンでも同じ機能が使えますか？",
        answer:
          "はい。スマートフォン・タブレット・PCのいずれでも、同じWeb電卓と全28種のツールをそのまま使えます。画面サイズに合わせてキーの大きさや配置が調整されます。",
      },
      {
        question: "目的に合った計算機はどうやって探せますか？",
        answer:
          "このページの「目的に合った計算機の選び方」か、ページ上部の「電卓一覧」メニューから探せます。キーワードが決まっている場合は、検索窓に「複利」「BMI」のように入力すると候補が表示されます。一覧ページでは全27種の計算機をカテゴリ別に確認できます。",
      },
    ],
  },
  footer: {
    about: "このサイトについて",
    aboutUs: "当サイトについて",
    disclaimer: "免責事項",
    privacy: "プライバシーポリシー",
    contact: "お問い合わせ",
    terms: "利用規約",
    calculators: "計算ツール",
    allCalculators: "すべての電卓",
    scientificCalculator: "関数電卓",
    squareRootCalculator: "ルート計算機",
    bmiCalculation: "BMIの計算",
    dueDateCalculation: "出産予定日 計算",
    hometownTaxDonation: "ふるさと納税",
    mahjongScore: "麻雀 点数計算",
    consumptionTax: "消費税計算",
  },
  legal: {
    privacyTitle: "プライバシーポリシー",
    privacyContent:
      "当サイトは、ユーザーの個人情報の保護を重視しています。当サイトでは、計算履歴などのデータをブラウザのローカルストレージに保存する場合がありますが、サーバーに個人情報を送信することはありません。",
    contactTitle: "お問い合わせ",
    contactContent:
      "当サイトに関するご質問やご意見がございましたら、下記のメールアドレスまでお問い合わせください。",
    contactEmail: "contact@example.com",
    termsTitle: "利用規約",
    termsContent:
      "当サイトの計算機は参考情報として提供されています。計算結果の正確性について保証するものではなく、重要な判断は専門家にご相談ください。当サイトの利用により生じた損害について、当サイトは責任を負いません。",
  },
  socialInsurance: {
    title: "社会保険料計算",
    description: "給与・年齢から健康保険や厚生年金などの社会保険料を計算します。",
  },
  unemploymentInsurance: {
    description: "退職前の給与、年齢、被保険者期間から失業保険の給付額と給付日数を計算します。",
  },
  consumptionTax: {
    description:
      "税抜・税込の変換と消費税額を計算。10％・8％（軽減税率）や端数処理にも対応。",
  },
  discountCalc: {
    description:
      "割引後の価格や割引率を計算。リストプライスからの割引、割引後価格からの逆算にも対応。",
  },
  dueDate: {
    description: "最終月経日や排卵日から出産予定日を計算。妊活タイミングの逆算にも対応しています。",
  },
  mahjong: {
    description: "翻と符から獲得点数を自動計算。符計算のサポート機能も付いています。",
  },
  incomeTax: {
    description:
      "年収から給与所得控除、基礎控除を差し引き、所得税と復興特別所得税を自動計算します。",
  },
  furusatoNozei: {
    description:
      "年収と家族構成から、ふるさと納税の控除上限額（寄付上限の目安）を公式の計算式で算出します。",
  },
};

export default ja;

export type Dictionary = typeof ja;
