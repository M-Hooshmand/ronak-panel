/* ------------------------------------------------------------------
   Management data — pulled from the accounting DB by the Ronak agent
   All amounts are تومان (Toman), clean and categorised.
   ------------------------------------------------------------------ */

export type CheckStatus = "وصول‌شده" | "در جریان" | "سرسید" | "برگشتی";

export const cashAccounts = [
  { name: "بانک ملت — جاری ۱۲۳۴", kind: "بانک", balance: 4_820_000_000, change: 6.4, last: "امروز ۰۹:۱۲" },
  { name: "بانک صادرات — جاری ۸۸۱۰", kind: "بانک", balance: 1_350_000_000, change: -2.1, last: "امروز ۰۹:۱۲" },
  { name: "بانک سامان — سپرده کوتاه‌مدت", kind: "بانک", balance: 940_000_000, change: 1.2, last: "امروز ۰۹:۱۲" },
  { name: "صندوق مرکزی", kind: "صندوق", balance: 210_000_000, change: 0, last: "دیروز ۱۸:۴۰" },
  { name: "تنخواه واحدها", kind: "تنخواه", balance: 80_000_000, change: -4.5, last: "دیروز ۱۷:۰۵" },
];

export const totalCash = cashAccounts.reduce((s, a) => s + a.balance, 0);

export const checks = [
  { id: "۴۵۸۱۲۳", dir: "دریافتی", party: "بازرگانی نیک‌رو", bank: "ملت", amount: 420_000_000, due: "۱۴۰۵/۰۹/۰۳", status: "در جریان" as CheckStatus, days: 3 },
  { id: "۴۵۸۱۲۴", dir: "دریافتی", party: "پخش آرمان", bank: "صادرات", amount: 285_000_000, due: "۱۴۰۵/۰۹/۰۵", status: "در جریان" as CheckStatus, days: 5 },
  { id: "۷۷۲۰۱۹", dir: "دریافتی", party: "صنایع پارس‌فولاد", bank: "سامان", amount: 640_000_000, due: "۱۴۰۵/۰۸/۲۸", status: "وصول‌شده" as CheckStatus, days: -3 },
  { id: "۴۵۸۱۲۵", dir: "دریافتی", party: "مشتری اصفهان", bank: "ملت", amount: 120_000_000, due: "۱۴۰۵/۰۸/۲۶", status: "برگشتی" as CheckStatus, days: -5 },
  { id: "۹۹۰۲۱۴", dir: "پرداختی", party: "تأمین‌کننده ورق", bank: "ملت", amount: 310_000_000, due: "۱۴۰۵/۰۹/۰۴", status: "سرسید" as CheckStatus, days: 4 },
  { id: "۹۹۰۲۱۵", dir: "پرداختی", party: "حمل و نقل شرق", bank: "ملت", amount: 145_000_000, due: "۱۴۰۵/۰۹/۰۷", status: "در جریان" as CheckStatus, days: 7 },
  { id: "۹۹۰۲۱۶", dir: "پرداختی", party: "اجاره انبار", bank: "صادرات", amount: 220_000_000, due: "۱۴۰۵/۰۹/۱۰", status: "در جریان" as CheckStatus, days: 10 },
  { id: "۹۹۰۲۱۷", dir: "پرداختی", party: "خدمات فنی مهر", bank: "سامان", amount: 96_000_000, due: "۱۴۰۵/۰۸/۲۷", status: "وصول‌شده" as CheckStatus, days: -4 },
];

export const clearedThisMonth = checks
  .filter((c) => c.dir === "دریافتی" && c.status === "وصول‌شده")
  .reduce((s, c) => s + c.amount, 0);
export const inCourse = checks
  .filter((c) => c.dir === "دریافتی" && c.status !== "وصول‌شده" && c.status !== "برگشتی")
  .reduce((s, c) => s + c.amount, 0);
export const bounced = checks
  .filter((c) => c.status === "برگشتی")
  .reduce((s, c) => s + c.amount, 0);

export const cashTrend = [
  6.1, 6.24, 6.18, 6.35, 6.5, 6.44, 6.62, 6.71, 6.65, 6.8, 6.74, 6.92,
  7.05, 6.98, 7.12, 7.3, 7.22, 7.05, 6.94, 7.1, 7.26, 7.18, 7.32, 7.45,
  7.38, 7.5, 7.42, 7.55, 7.48, 7.6, 7.4,
].map((v, i) => ({ label: `${i + 1}`, values: [Math.round(v * 1_000_000_000)] }));

export const inventory = [
  { sku: "RAW-1042", name: "ورق گالوانیزه ۰٫۵", unit: "کیلوگرم", qty: 1_240, reorder: 3_000, price: 780_000, turnover: 12 },
  { sku: "RAW-2071", name: "پروفیل آلومینیوم ۴۰×۴۰", unit: "شاخه", qty: 380, reorder: 500, price: 4_200_000, turnover: 8 },
  { sku: "FIN-3310", name: "پنل ایستاده مدل A", unit: "عدد", qty: 148, reorder: 120, price: 18_500_000, turnover: 5 },
  { sku: "FIN-3312", name: "پنل دیواری مدل B", unit: "عدد", qty: 42, reorder: 100, price: 12_800_000, turnover: 9 },
  { sku: "RAW-1188", name: "پیچ و مهره استیل", unit: "بسته", qty: 2_100, reorder: 1_500, price: 620_000, turnover: 18 },
  { sku: "CON-5501", name: "رنگ پودری RAL 9016", unit: "کیلوگرم", qty: 96, reorder: 250, price: 2_950_000, turnover: 7 },
  { sku: "FIN-3320", name: "باکس کنترل هوشمند", unit: "عدد", qty: 26, reorder: 60, price: 34_000_000, turnover: 4 },
  { sku: "RAW-1409", name: "نوار لاستیکی درب", unit: "متر", qty: 3_800, reorder: 2_000, price: 310_000, turnover: 16 },
];

export const inventoryValue = inventory.reduce((s, i) => s + i.qty * i.price, 0);
export const belowReorder = inventory.filter((i) => i.qty < i.reorder);

export const fixedAssets = [
  { name: "خط تولید برش لیزر", cat: "ماشین‌آلات", cost: 4_200_000_000, accum: 1_260_000_000, date: "۱۴۰۱/۰۴/۱۲", rate: 10 },
  { name: "دستگاه پرس ۲۰۰ تن", cat: "ماشین‌آلات", cost: 2_800_000_000, accum: 980_000_000, date: "۱۴۰۰/۱۱/۰۳", rate: 10 },
  { name: "ساختمان انبار مرکزی", cat: "املاک", cost: 2_500_000_000, accum: 250_000_000, date: "۱۳۹۹/۰۶/۲۰", rate: 5 },
  { name: "ناوگان حمل (۲ کامیونت)", cat: "وسایل نقلیه", cost: 1_650_000_000, accum: 660_000_000, date: "۱۴۰۱/۰۹/۱۵", rate: 25 },
  { name: "تجهیزات اداری و IT", cat: "تجهیزات", cost: 620_000_000, accum: 310_000_000, date: "۱۴۰۲/۰۲/۰۸", rate: 30 },
];

export const assetsCost = fixedAssets.reduce((s, a) => s + a.cost, 0);
export const assetsBook = fixedAssets.reduce((s, a) => s + (a.cost - a.accum), 0);

export const pnl = [
  { label: "درآمد فروش", cur: 9_840_000_000, prev: 8_920_000_000, level: 0 },
  { label: "برگشت از فروش و تخفیفات", cur: -180_000_000, prev: -160_000_000, level: 0, neg: true },
  { label: "فروش خالص", cur: 9_660_000_000, prev: 8_760_000_000, level: 1, sub: true },
  { label: "بهای تمام‌شده کالای فروش‌رفته", cur: -6_420_000_000, prev: -5_910_000_000, level: 0, neg: true },
  { label: "سود ناخالص", cur: 3_240_000_000, prev: 2_850_000_000, level: 1, sub: true },
  { label: "هزینه فروش و توزیع", cur: -420_000_000, prev: -380_000_000, level: 0, neg: true },
  { label: "هزینه اداری و عمومی", cur: -780_000_000, prev: -720_000_000, level: 0, neg: true },
  { label: "هزینه مالی", cur: -110_000_000, prev: -95_000_000, level: 0, neg: true },
  { label: "سود عملیاتی", cur: 1_930_000_000, prev: 1_655_000_000, level: 1, sub: true },
  { label: "سایر درآمدها و هزینه‌ها", cur: 45_000_000, prev: -30_000_000, level: 0 },
  { label: "سود قبل از مالیات", cur: 1_975_000_000, prev: 1_625_000_000, level: 1, sub: true },
  { label: "مالیات بر درآمد (۲۵٪)", cur: -493_750_000, prev: -406_250_000, level: 0, neg: true },
  { label: "سود خالص", cur: 1_481_250_000, prev: 1_218_750_000, level: 2, total: true },
];

const bsCurrentAssets: Array<[string, number]> = [
  ["موجودی نقد و بانک", 7_400_000_000],
  ["حساب‌های دریافتنی", 4_200_000_000],
  ["موجودی کالا", inventoryValue],
  ["پیش‌پرداخت‌ها و سایر", 900_000_000],
];
const bsNonCurrentAssets: Array<[string, number]> = [
  ["دارایی ثابت (خالص)", 8_900_000_000],
  ["دارایی نامشهود", 320_000_000],
];
const bsCurrentLiabilities: Array<[string, number]> = [
  ["حساب‌های پرداختنی", 3_800_000_000],
  ["چک‌های پرداختنی", 2_100_000_000],
  ["مالیات و بیمه پرداختنی", 780_000_000],
  ["تسهیلات کوتاه‌مدت", 2_500_000_000],
];
const bsNonCurrentLiabilities: Array<[string, number]> = [["تسهیلات بلندمدت", 3_200_000_000]];

const bsTotalAssets = [...bsCurrentAssets, ...bsNonCurrentAssets].reduce((s, [, v]) => s + v, 0);
const bsTotalLiabilities = [...bsCurrentLiabilities, ...bsNonCurrentLiabilities].reduce((s, [, v]) => s + v, 0);
const bsCapital = 8_000_000_000;
const bsNetProfit = 1_481_250_000;
const bsRetained = bsTotalAssets - bsTotalLiabilities - bsCapital - bsNetProfit;

export const balanceSheet = {
  currentAssets: bsCurrentAssets,
  nonCurrentAssets: bsNonCurrentAssets,
  currentLiabilities: bsCurrentLiabilities,
  nonCurrentLiabilities: bsNonCurrentLiabilities,
  equity: [
    ["سرمایه", bsCapital],
    ["سود انباشته", bsRetained],
    ["سود دوره جاری", bsNetProfit],
  ] as Array<[string, number]>,
};

export const cashFlow = [
  { label: "جریان نقد عملیاتی", value: 2_100_000_000, parts: [["سود عملیاتی", 1_930_000_000], ["تغییر سرمایه در گردش", 170_000_000]] as Array<[string, number]> },
  { label: "جریان نقد سرمایه‌گذاری", value: -1_400_000_000, parts: [["خرید دارایی ثابت", -1_250_000_000], ["فروش دارایی", 150_000_000], ["سایر", -300_000_000]] as Array<[string, number]> },
  { label: "جریان نقد تأمین مالی", value: 600_000_000, parts: [["دریافت تسهیلات", 800_000_000], ["بازپرداخت اقساط", -200_000_000]] as Array<[string, number]> },
];

export const payrollRows = [
  { name: "سارا محمدی", role: "مدیر مالی", base: 320_000_000, ben: 65_000_000, ins: 22_400_000, tax: 32_800_000 },
  { name: "رضا کریمی", role: "مدیر فروش", base: 280_000_000, ben: 58_000_000, ins: 19_600_000, tax: 26_500_000 },
  { name: "مهدی رستمی", role: "سرپرست انبار", base: 210_000_000, ben: 42_000_000, ins: 14_700_000, tax: 14_200_000 },
  { name: "نگار احمدی", role: "کارشناس حسابداری", base: 190_000_000, ben: 36_000_000, ins: 13_300_000, tax: 11_500_000 },
  { name: "امیر حسینی", role: "اپراتور تولید", base: 165_000_000, ben: 30_000_000, ins: 11_550_000, tax: 6_800_000 },
  { name: "فاطمه رضایی", role: "کارشناس خرید", base: 175_000_000, ben: 34_000_000, ins: 12_250_000, tax: 8_100_000 },
];

export const payrollTotals = payrollRows.reduce(
  (t, r) => ({
    base: t.base + r.base,
    ben: t.ben + r.ben,
    ins: t.ins + r.ins,
    tax: t.tax + r.tax,
  }),
  { base: 0, ben: 0, ins: 0, tax: 0 },
);

export const payrollGross = payrollTotals.base + payrollTotals.ben;
export const employerInsurance = Math.round(payrollTotals.base * 0.23);
export const vatPayable = 410_000_000;
export const incomeTax = 493_750_000;

export const taxObligations = [
  { label: "مالیات بر ارزش افزوده", amount: vatPayable, due: "۱۴۰۵/۰۹/۱۵", status: "پرداخت‌نشده", tone: "warn" },
  { label: "بیمه تأمین اجتماعی", amount: 326_600_000, due: "۱۴۰۵/۰۹/۱۵", status: "پرداخت‌نشده", tone: "warn" },
  { label: "مالیات حقوق و دستمزد", amount: payrollTotals.tax, due: "۱۴۰۵/۰۹/۱۵", status: "پرداخت‌نشده", tone: "warn" },
  { label: "مالیات بر درآمد (علی‌الحساب)", amount: incomeTax, due: "۱۴۰۵/۱۰/۳۰", status: "زمان‌بندی‌شده", tone: "muted" },
  { label: "عوارض و مالیات مشاغل", amount: 64_000_000, due: "۱۴۰۵/۰۸/۲۰", status: "پرداخت‌شده", tone: "success" },
];

export const payrollTrend = [
  { label: "تیر", values: [1.28, 0.29] },
  { label: "مرداد", values: [1.31, 0.3] },
  { label: "شهریور", values: [1.34, 0.31] },
  { label: "مهر", values: [1.38, 0.32] },
  { label: "آبان", values: [1.42, 0.33] },
];

export const mgAlerts = [
  { tone: "danger", title: "چک برگشتی", body: "چک ۴۵۸۱۲۵ مشتری اصفهان (۱۲۰ میلیون) برگشت خورد.", href: "/treasury" },
  { tone: "warn", title: "سرسید ۳ روز آینده", body: "چک دریافتی ۴۲۰ میلیون تومان از بازرگانی نیک‌رو.", href: "/treasury" },
  { tone: "warn", title: "۶ قلم کالا زیر حد سفارش", body: "ورق گالوانیزه و پروفیل آلومینیوم بیشترین کسری را دارند.", href: "/inventory" },
  { tone: "muted", title: "مغایرت بانکی", body: "۱۲ میلیون تومان مغایرت در حساب سامان شناسایی شد.", href: "/treasury" },
  { tone: "indigo", title: "تعهد مالیاتی نزدیک", body: "ارزش افزوده، بیمه و مالیات حقوق تا ۱۵ آذر باید تسویه شود.", href: "/payroll" },
];

export const cashComposition = [
  { label: "بانک ملت", value: 4_820_000_000, color: "#2FE0BE" },
  { label: "بانک صادرات", value: 1_350_000_000, color: "#7C8CFF" },
  { label: "بانک سامان", value: 940_000_000, color: "#F7B955" },
  { label: "صندوق و تنخواه", value: 290_000_000, color: "#7BE495" },
];
