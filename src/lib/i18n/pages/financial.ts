// Financial Calculator page strings, split out of the monolithic ja
// dictionary (LCP fix F1) so only this page loads them.
export const financial = {
  title: "金融電卓",
  description: "現在価値・将来価値・支払額・利率・期間数を解けるTVM対応の金融電卓。",
  solveFor: "求める項目",
  presentValue: "現在価値 PV",
  futureValue: "将来価値 FV",
  periodicPayment: "定期支払額 PMT",
  ratePerPeriod: "利率 I/Y（1期間あたり %）",
  periods: "期間数 N",
  solvedValue: "計算結果",
  totalPayments: "支払額の合計",
  interestDifference: "利息・運用差額",
  modeTvm: "金融計算（TVM）",
  modeLoan: "ローン返済",
  loanPrincipal: "借入額（円）",
  loanRate: "年利（%）",
  loanYears: "返済期間（年）",
  repaymentType: "返済方式",
  equalPayment: "元利均等返済",
  equalPrincipal: "元金均等返済",
  monthlyPayment: "毎月返済額",
  firstPayment: "初回返済額",
  lastPayment: "最終回返済額",
  loanTotalPayment: "総返済額",
  loanTotalInterest: "総利息",
  scheduleTitle: "返済予定表",
  scheduleNote: "11年を超える返済期間では、年単位の集計で表示します。",
  explanationTitle: "時間価値（TVM）とは？",
  explanationText:
    "お金には時間価値があります。今ある10万円と、10年後にもらう10万円は同じ価値ではありません。今あるお金は運用して増やせる一方、将来のお金は受け取るまで使えないからです。TVM（Time Value of Money）は、この違いを利率と期間で整理して、現在価値 PV・将来価値 FV・定期支払額 PMT・利率 I/Y・期間数 N の関係を計算する考え方です。例えば、現在10万円を1期間あたり5%で10期間運用し、追加の積立がない場合、将来価値は約16万2,889円になります。逆に、将来目標額や毎期の積立額が決まっていれば、必要な期間数や利率を逆算できます。資産形成だけでなく、分割払い、教育資金、老後資金の計画にも役立つ基本的な金融計算です。",
};

export const financialPage = {
  title: "金融電卓",
  description:
    "PV・FV・PMT・利率・期間のいずれかを求められるTVM対応の金融計算ツール。金融電卓としてブラウザで即時に試算できます。",
  introParagraph:
    "この金融電卓には2つのモードがあります。「金融計算（TVM）」では、現在価値 PV・将来価値 FV・定期支払額 PMT・利率 I/Y・期間数 N のうち4つを入力し、残り1つを求めます。「ローン返済」では、借入額・年利・返済期間から毎月返済額と総利息、返済予定表を計算します（元利均等・元金均等の両方式対応）。入力した金額はブラウザ内だけで処理され、外部サーバーへ送信されません。",
  contentFormulaTitle: "金融計算の公式",
  contentFormulaLines: [
    "TVMの基本式（期末払い）：FV ＝ PV × (1 ＋ i)^n ＋ PMT × ((1 ＋ i)^n − 1) ÷ i。i は1期間あたりの利率、n は期間数です。毎月の積立で考えるときは、i に月利（年利 ÷ 12）、n に月数を入れます。",
    "元利均等返済の毎月返済額：借入額 × 月利 × (1 ＋ 月利)^回数 ÷ ((1 ＋ 月利)^回数 − 1)。毎月の返済額が一定で、その中で元金と利息の割合が変わっていきます。",
    "元金均等返済：元金分は毎月ほぼ一定で、利息は残高に応じて減るため、返済額は少しずつ小さくなります。総利息は元利均等より少なくなります。",
  ],
  contentExamplesTitle: "計算例",
  contentExamplesRows: [
    ["現在価値100,000円を1期間5%で10期間運用（FV）", "162,889円"],
    ["毎月10,000円を月利0.25%で60回積立（FV）", "646,467円"],
    ["借入3,000,000円・年利3%・5年・元利均等", "毎月53,906円／総利息234,367円"],
    ["借入3,000,000円・年利3%・5年・元金均等", "初回57,500円／総利息228,750円"],
    ["借入30,000,000円・年利1.5%・35年・元利均等", "毎月91,855円／総利息8,579,289円"],
  ],
  guideMistakesTitle: "よくある間違い",
  guideMistakes: [
    "I/Yに年利をそのまま入れてしまう（I/Yは1期間あたりの利率です。月単位で計算するときは年利÷12の月利を使います）。",
    "元利均等と元金均等を混同する（同じ条件でも総利息が変わります。上の計算例で比較できます）。",
    "借入の計算をTVMモードでしようとする（ローンは「ローン返済」モードが簡単で、返済予定表も出ます）。",
  ],
  howToTitle: "金融電卓の使い方",
  howToSteps: [
    {
      title: "モードと求める項目を選ぶ",
      body: "まず「金融計算（TVM）」か「ローン返済」かを選びます。TVMでは上部のセグメントで PV・FV・PMT・I/Y・N のいずれかを選択し、選んだ項目以外の4つの欄に既知の数値を入力します。ローン返済では借入額・年利・返済期間・返済方式を入力します。",
    },
    {
      title: "各変数の意味を確認する",
      body: "PVは現在の元本、FVは将来の合計額、PMTは毎期の積立・支払額、I/Yは1期間あたりの利率（%）、Nは期間数です。すべて正の数で入力する想定で、期末に支払が発生するモデルです。",
    },
    {
      title: "結果と計算ステップを確認する",
      body: "入力すると自動で計算され、選択した項目の値が表示されます。あわせて支払額の合計と、利息・運用による差額（FV−PV−支払合計）も参考値として示します。ローン返済モードでは返済予定表も表示されます。",
    },
    {
      title: "FV・PV・PMTの読み取り方",
      body: "例えばPV=10万円、I/Y=5%、N=10、PMT=0でFVを求めると、複利で約16万2,889円になります。逆に目標のFVから必要なPMTや期間を求める使い方もできます。",
    },
  ],
  guideTermsTitle: "用語の説明",
  guideTerms: [
    {
      term: "現在価値（PV）",
      body: "将来のお金を、今の価値に直した金額です。将来の100万円は、利息の分だけ今の価値では小さくなります。",
    },
    {
      term: "将来価値（FV）",
      body: "今のお金が、利息を含めて将来いくらになるかを示す金額です。たとえば現在価値100万円・年利3%・10年なら、将来価値は約1,343,916円です。",
    },
    {
      term: "定期支払額（PMT）",
      body: "毎回決まった時期に積み立てる（または返済する）金額です。積立投資の毎月の拠出額や、ローンの毎回返済額にあたります。",
    },
  ],
  examplesTitle: "計算例",
  answerHeading: "答え",
  stepsHeading: "ステップで解く",
  scenarioTitle: "シナリオ",
  scenarioFv: "PV = {0}円、PMT = {1}円、I/Y = {2}%、N = {3} のとき、将来価値 FV はいくらですか？",
  scenarioPv: "FV = {0}円、PMT = {1}円、I/Y = {2}%、N = {3} のとき、現在価値 PV はいくらですか？",
  scenarioPmt:
    "PV = {0}円、FV = {1}円、I/Y = {2}%、N = {3} のとき、定期支払額 PMT はいくらですか？",
  scenarioIy:
    "PV = {0}円、FV = {1}円、PMT = {2}円、N = {3} のとき、1期間あたりの利率 I/Y は何%ですか？（二分法で求めます）",
  scenarioN: "PV = {0}円、FV = {1}円、PMT = {2}円、I/Y = {3}% のとき、期間数 N はいくつですか？",
  givenTitle: "与えられた条件",
  formulaTitle: "計算式",
  stepRateTitle: "ステップ1：利率を小数に変換する",
  stepAddOneTitle: "ステップ2：1に利率を足す",
  stepPowerTitle: "ステップ3：(1+i) を N 乗する",
  stepAnnuityTitle: "ステップ4：年金係数 ((1+i)^N − 1)/i を求める",
  stepFvMultiplyTitle: "ステップ5：現在価値・支払額を反映する",
  stepFvResultTitle: "ステップ6：最終的な答え",
  stepPvDivideTitle: "ステップ5：将来価値から現在価値を求める",
  stepPvResultTitle: "ステップ6：最終的な答え",
  stepPmtNumTitle: "ステップ5：分子 FV − PV×(1+i)^N を求める",
  stepPmtDivideTitle: "ステップ6：年金係数で割る",
  stepPmtResultTitle: "ステップ7：最終的な答え",
  stepIyBracketTitle: "ステップ1：利率の探索範囲を設定する",
  stepIyMidTitle: "ステップ2：中点の利率で FV を評価する",
  stepIyConvergeTitle: "ステップ3：二分法で収束させる",
  stepIyResultTitle: "ステップ4：最終的な答え",
  stepNLogTitle: "ステップ1：対数で期間を求める",
  stepNBisectionTitle: "ステップ1：期間を二分法で求める",
  stepNResultTitle: "ステップ2：最終的な答え",
  resultLabel: "結果",
  resultFv: "将来価値 FV = {0}",
  resultPv: "現在価値 PV = {0}",
  resultPmt: "定期支払額 PMT = {0}",
  resultIy: "利率 I/Y = {0}%",
  resultN: "期間数 N = {0}",
  faqTitle: "金融電卓・ローン計算のよくある質問",
  faqItems: [
    {
      question: "金融計算（TVM）とは何ですか？",
      answer:
        "TVM（Time Value of Money）は、お金の時間価値を利率と期間で整理する金融計算の枠組みです。現在の元本・将来の合計・毎期の支払額・利率・期間の5つを相互に求められます。",
    },
    {
      question: "PVとFVの違いは何ですか？",
      answer:
        "PV（現在価値）は今ある元本、FV（将来価値）は期間終了時点の合計額です。同じ10万円でも、今受け取るか10年後に受け取るかで価値が異なるため、利率を使って相互に換算します。",
    },
    {
      question: "金融電卓で利率（I/Y）を逆算できますか？",
      answer:
        "はい、PV・FV・PMT・Nの4つを入力してI/Yを選べば、二分法で1期間あたりの利率を求めます。目標額に到達するために必要な利回りの目安を確認する際に使えます。",
    },
    {
      question: "定期積立の試算にも使えますか？",
      answer:
        "はい、PMTに毎期の積立額を入れれば、元本と合わせた将来価値を計算できます。逆に目標FVから必要なPMTを求めることも可能です。",
    },
    {
      question: "入力した金額はサーバーに送られますか？",
      answer:
        "いいえ、すべての金融計算はブラウザ上で完結します。入力したPVや利率などの数値が外部へ送信されることはなく、端末内だけで処理されます。",
    },
    {
      question: "ローンの返済額も計算できますか？",
      answer:
        "はい、「ローン返済」モードで借入額・年利・返済期間を入力すると、毎月返済額・総返済額・総利息と返済予定表を表示します。元利均等返済と元金均等返済の両方に対応しています。",
    },
    {
      question: "ボーナス払いや繰上返済には対応していますか？",
      answer:
        "現在は対応していません。通常返済のみの試算としてご利用ください。ボーナス併用払いや繰上返済を含む正確な返済計画は、借入先金融機関のシミュレーションでもご確認ください。",
    },
  ],
};
