/* ------------------------------------------------------------------
   Mock data — Ronak ETL / data-quality / accounting bridge
   All names, amounts and statuses are internally consistent.
   ------------------------------------------------------------------ */
import { ledgerVouchers } from "./sepidar.vouchers";

export type Company = {
  id: string;
  name: string;
  short: string;
  industry: string;
  branches: number;
  plan: string;
};

export const companies: Company[] = [
  { id: "tadbir", name: "شرکت تدبیر صنعت پلاست", short: "تدبیر", industry: "تولید فیلم و لفاف پلاستیکی", branches: 1, plan: "سپیدار ۶٫۱٫۹" },
];

export const branches: Record<string, string[]> = {
  tadbir: ["اشتهارد — کارخانه"],
};

/* ------------------------------ Sources ------------------------------ */
export type SourceKind = "SQL Server" | "PostgreSQL" | "Oracle" | "MySQL";
export type ConnStatus = "connected" | "warning" | "disconnected";

export type DataSource = {
  id: string;
  name: string;
  kind: SourceKind;
  host: string;
  database: string;
  company: string;
  branch: string;
  status: ConnStatus;
  lastSync: string;
  sizeMb: number;
  tables: number;
  rows: number;
};

export const sources: DataSource[] = [
  { id: "SRC-10", name: "حسابداری مرکزی آرمان", kind: "SQL Server", host: "10.20.4.11:1433", database: "ArmanAcc_1405", company: "شرکت پخش آرمان", branch: "تهران — مرکز", status: "connected", lastSync: "۴ دقیقه پیش", sizeMb: 8412, tables: 186, rows: 4_912_400 },
  { id: "SRC-11", name: "انبار اصفهان", kind: "SQL Server", host: "10.20.4.18:1433", database: "ArmanWMS_Isf", company: "شرکت پخش آرمان", branch: "اصفهان", status: "connected", lastSync: "۹ دقیقه پیش", sizeMb: 2210, tables: 74, rows: 1_284_900 },
  { id: "SRC-12", name: "فروش مشهد", kind: "PostgreSQL", host: "10.20.6.24:5432", database: "sales_mashhad", company: "شرکت پخش آرمان", branch: "مشهد", status: "warning", lastSync: "۲ ساعت پیش", sizeMb: 640, tables: 31, rows: 388_120 },
  { id: "SRC-20", name: "دفتر مالی پارس‌فولاد", kind: "Oracle", host: "10.31.0.7:1521", database: "PARSERP", company: "گروه صنعتی پارس‌فولاد", branch: "اصفهان — کارخانه", status: "connected", lastSync: "۶ دقیقه پیش", sizeMb: 15820, tables: 412, rows: 9_740_500 },
  { id: "SRC-21", name: "حقوق و دستمزد پارس‌فولاد", kind: "SQL Server", host: "10.31.0.9:1433", database: "ParsHR", company: "گروه صنعتی پارس‌فولاد", branch: "تهران — دفتر مرکزی", status: "connected", lastSync: "۵۱ دقیقه پیش", sizeMb: 320, tables: 22, rows: 96_300 },
  { id: "SRC-30", name: "بازرگانی نیک‌رو", kind: "MySQL", host: "10.44.2.5:3306", database: "nikro_trade", company: "بازرگانی نیک‌رو", branch: "تهران — مرکز", status: "disconnected", lastSync: "دیروز ۱۸:۰۲", sizeMb: 1840, tables: 58, rows: 742_100 },
  { id: "SRC-40", name: "کارخانه سلامت‌گستر", kind: "PostgreSQL", host: "10.52.8.3:5432", database: "salamat_erp", company: "داروسازی سلامت‌گستر", branch: "تهران — کارخانه", status: "connected", lastSync: "۱۲ دقیقه پیش", sizeMb: 4310, tables: 118, rows: 2_185_600 },
  { id: "SRC-41", name: "توزیع سلامت‌گستر", kind: "SQL Server", host: "10.52.8.14:1433", database: "SalamatDist", company: "داروسازی سلامت‌گستر", branch: "کرج", status: "warning", lastSync: "۳ ساعت پیش", sizeMb: 910, tables: 44, rows: 264_800 },
];

export const sourceMeta: Record<SourceKind, { port: string; vendor: string; color: string; abbr: string }> = {
  "SQL Server": { port: "1433", vendor: "Microsoft", color: "#7C8CFF", abbr: "MS" },
  PostgreSQL: { port: "5432", vendor: "PostgreSQL Global", color: "#2FE0BE", abbr: "PG" },
  Oracle: { port: "1521", vendor: "Oracle Corp", color: "#FF6B81", abbr: "OR" },
  MySQL: { port: "3306", vendor: "Oracle / MySQL", color: "#F7B955", abbr: "MY" },
};

/* ------------------------------ Agents ------------------------------ */
export type AgentStatus = "online" | "degraded" | "offline";

export type Agent = {
  id: string;
  code: string;
  company: string;
  branch: string;
  host: string;
  os: string;
  version: string;
  latestVersion: string;
  status: AgentStatus;
  ip: string;
  lastHeartbeat: string;
  installedAt: string;
  token: string;
  heartbeat: number[];
  cpu: number;
  memory: number;
  queue: number;
};

export const agents: Agent[] = [
  { id: "AG-01", code: "RONAK-AG-01", company: "شرکت پخش آرمان", branch: "تهران — مرکز", host: "arman-acc-01", os: "Windows Server 2019", version: "2.4.1", latestVersion: "2.4.1", status: "online", ip: "10.20.4.11", lastHeartbeat: "۲۲ ثانیه پیش", installedAt: "۱۴۰۴/۰۲/۱۸", token: "rnk_live_7f3a…c91d", heartbeat: [14, 18, 13, 22, 19, 26, 21, 30, 25, 27, 24, 31, 28, 33, 26, 29, 35, 32, 30, 34], cpu: 18, memory: 42, queue: 3 },
  { id: "AG-02", code: "RONAK-AG-02", company: "شرکت پخش آرمان", branch: "اصفهان", host: "arman-isf-02", os: "Ubuntu 22.04 LTS", version: "2.4.1", latestVersion: "2.4.1", status: "online", ip: "10.20.4.18", lastHeartbeat: "۴۱ ثانیه پیش", installedAt: "۱۴۰۴/۰۳/۰۲", token: "rnk_live_1b8e…4a72", heartbeat: [9, 12, 10, 15, 13, 11, 16, 14, 18, 15, 19, 17, 21, 18, 20, 16, 22, 19, 17, 20], cpu: 12, memory: 38, queue: 0 },
  { id: "AG-03", code: "RONAK-AG-03", company: "شرکت پخش آرمان", branch: "مشهد", host: "arman-mhd-03", os: "Windows Server 2022", version: "2.3.8", latestVersion: "2.4.1", status: "degraded", ip: "10.20.6.24", lastHeartbeat: "۷ دقیقه پیش", installedAt: "۱۴۰۴/۰۱/۱۱", token: "rnk_live_9c47…8b10", heartbeat: [22, 25, 21, 28, 24, 30, 26, 8, 4, 3, 6, 5, 9, 7, 11, 6, 3, 2, 4, 3], cpu: 71, memory: 84, queue: 118 },
  { id: "AG-04", code: "RONAK-AG-04", company: "گروه صنعتی پارس‌فولاد", branch: "اصفهان — کارخانه", host: "pars-erp-01", os: "Oracle Linux 8", version: "2.4.1", latestVersion: "2.4.1", status: "online", ip: "10.31.0.7", lastHeartbeat: "۱۸ ثانیه پیش", installedAt: "۱۴۰۳/۱۱/۲۶", token: "rnk_live_3d2f…7e55", heartbeat: [28, 32, 30, 36, 33, 38, 35, 41, 37, 42, 39, 44, 40, 43, 46, 42, 45, 48, 44, 47], cpu: 24, memory: 51, queue: 7 },
  { id: "AG-05", code: "RONAK-AG-05", company: "بازرگانی نیک‌رو", branch: "تهران — مرکز", host: "nikro-acc", os: "Windows Server 2019", version: "2.3.6", latestVersion: "2.4.1", status: "offline", ip: "10.44.2.5", lastHeartbeat: "۱۸ ساعت پیش", installedAt: "۱۴۰۴/۰۴/۱۹", token: "rnk_live_5a11…0c93", heartbeat: [20, 22, 18, 24, 21, 19, 23, 17, 14, 10, 6, 4, 3, 0, 0, 0, 0, 0, 0, 0], cpu: 0, memory: 0, queue: 342 },
  { id: "AG-06", code: "RONAK-AG-06", company: "داروسازی سلامت‌گستر", branch: "تهران — کارخانه", host: "salamat-erp-01", os: "Ubuntu 24.04 LTS", version: "2.4.1", latestVersion: "2.4.1", status: "online", ip: "10.52.8.3", lastHeartbeat: "۳۵ ثانیه پیش", installedAt: "۱۴۰۴/۰۵/۰۷", token: "rnk_live_8e6b…2f44", heartbeat: [11, 14, 12, 16, 15, 19, 17, 20, 18, 22, 21, 24, 22, 25, 23, 26, 24, 28, 26, 27], cpu: 16, memory: 45, queue: 2 },
];

export const agentVersions = [
  { version: "2.4.1", date: "۱۴۰۵/۰۸/۲۱", notes: "پایدارسازی تونل TLS، افزایش سرعت استخراج دسته‌ای", size: "24.6 مگابایت" },
  { version: "2.3.8", date: "۱۴۰۵/۰۶/۱۲", notes: "پشتیبانی از Oracle 19c و اصلاح ضربان قلب", size: "23.9 مگابایت" },
  { version: "2.3.6", date: "۱۴۰۵/۰۴/۳۰", notes: "افزودن حالت کم‌مصرف و تشخیص خودکار اسکیما", size: "23.4 مگابایت" },
];

/* ---------------------------- Pipelines ---------------------------- */
export type StageState = "ok" | "warn" | "idle" | "error";
export type PipelineStage = { key: string; label: string; state: StageState };
export type RunStatus = "success" | "failed" | "running";
export type PipelineRun = { id: string; startedAt: string; duration: string; records: number; status: RunStatus };

export type Pipeline = {
  id: string;
  name: string;
  company: string;
  source: string;
  target: string;
  schedule: string;
  active: boolean;
  stages: PipelineStage[];
  lastRun: string;
  nextRun: string;
  records: number;
  errors: number;
  duration: string;
  runs: PipelineRun[];
};

export const stageLabels = ["استخراج", "پاک‌سازی", "نگاشت", "اعتبارسنجی", "بارگذاری"];

const runSet = (base: number, seed: number): PipelineRun[] =>
  Array.from({ length: 6 }, (_, i) => {
    const failed = (i + seed) % 7 === 0;
    return {
      id: `RUN-${base + i}`,
      startedAt: `۱۴۰۵/۰۸/${["۲۹", "۲۸", "۲۸", "۲۷", "۲۷", "۲۶"][i]} — ${["۰۳:۱۵", "۰۳:۱۵", "۱۵:۳۰", "۰۳:۱۵", "۱۵:۳۰", "۰۳:۱۵"][i]}`,
      duration: `${(1 + ((i * 7 + seed) % 9)).toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])}:${["۱۲", "۴۸", "۰۴", "۳۷", "۵۲", "۲۱"][i]}`,
      records: Math.round(base * (0.92 + ((i * 13 + seed) % 17) / 100)),
      status: failed ? "failed" : "success",
    };
  });

export const pipelines: Pipeline[] = [
  {
    id: "PL-100", name: "فروش روزانه ← دفتر کل", company: "شرکت پخش آرمان", source: "حسابداری مرکزی آرمان", target: "سپیدار — دفتر مرکزی",
    schedule: "هر روز ۰۳:۱۵", active: true,
    stages: [
      { key: "extract", label: "استخراج", state: "ok" }, { key: "clean", label: "پاک‌سازی", state: "ok" },
      { key: "map", label: "نگاشت", state: "ok" }, { key: "validate", label: "اعتبارسنجی", state: "ok" }, { key: "load", label: "بارگذاری", state: "ok" },
    ],
    lastRun: "امروز ۰۳:۱۵", nextRun: "فردا ۰۳:۱۵", records: 184_420, errors: 0, duration: "۴:۱۲", runs: runSet(48210, 1),
  },
  {
    id: "PL-101", name: "اسناد خرید و هزینه", company: "شرکت پخش آرمان", source: "حسابداری مرکزی آرمان", target: "سپیدار — دفتر مرکزی",
    schedule: "هر روز ۰۳:۴۵", active: true,
    stages: [
      { key: "extract", label: "استخراج", state: "ok" }, { key: "clean", label: "پاک‌سازی", state: "ok" },
      { key: "map", label: "نگاشت", state: "warn" }, { key: "validate", label: "اعتبارسنجی", state: "ok" }, { key: "load", label: "بارگذاری", state: "ok" },
    ],
    lastRun: "امروز ۰۳:۴۵", nextRun: "فردا ۰۳:۴۵", records: 42_180, errors: 14, duration: "۲:۳۸", runs: runSet(48190, 3),
  },
  {
    id: "PL-102", name: "موجودی و انبارگردانی", company: "شرکت پخش آرمان", source: "انبار اصفهان", target: "سپیدار — انبار",
    schedule: "هر ۶ ساعت", active: true,
    stages: [
      { key: "extract", label: "استخراج", state: "ok" }, { key: "clean", label: "پاک‌سازی", state: "warn" },
      { key: "map", label: "نگاشت", state: "ok" }, { key: "validate", label: "اعتبارسنجی", state: "warn" }, { key: "load", label: "بارگذاری", state: "ok" },
    ],
    lastRun: "امروز ۱۲:۰۰", nextRun: "امروز ۱۸:۰۰", records: 61_240, errors: 37, duration: "۳:۰۳", runs: runSet(48170, 5),
  },
  {
    id: "PL-103", name: "حقوق و دستمزد مهر", company: "گروه صنعتی پارس‌فولاد", source: "حقوق و دستمزد پارس‌فولاد", target: "سپیدار — مالی",
    schedule: "پایان هر ماه", active: false,
    stages: [
      { key: "extract", label: "استخراج", state: "ok" }, { key: "clean", label: "پاک‌سازی", state: "ok" },
      { key: "map", label: "نگاشت", state: "idle" }, { key: "validate", label: "اعتبارسنجی", state: "idle" }, { key: "load", label: "بارگذاری", state: "idle" },
    ],
    lastRun: "۱۴۰۵/۰۷/۳۰ — ۲۱:۱۰", nextRun: "۱۴۰۵/۰۸/۳۰ — ۲۱:۰۰", records: 940, errors: 0, duration: "۰:۵۴", runs: runSet(47120, 2),
  },
  {
    id: "PL-104", name: "دریافتنی و تسویه مشتریان", company: "بازرگانی نیک‌رو", source: "بازرگانی نیک‌رو", target: "هلو — سرور مرکزی",
    schedule: "هر ۱۲ ساعت", active: false,
    stages: [
      { key: "extract", label: "استخراج", state: "error" }, { key: "clean", label: "پاک‌سازی", state: "idle" },
      { key: "map", label: "نگاشت", state: "idle" }, { key: "validate", label: "اعتبارسنجی", state: "idle" }, { key: "load", label: "بارگذاری", state: "idle" },
    ],
    lastRun: "۱۴۰۵/۰۸/۲۸ — ۰۹:۰۰", nextRun: "—", records: 0, errors: 1, duration: "۰:۰۰", runs: runSet(48100, 6),
  },
  {
    id: "PL-105", name: "فروش و مرجوعی سلامت‌گستر", company: "داروسازی سلامت‌گستر", source: "کارخانه سلامت‌گستر", target: "سپیدار — کارخانه",
    schedule: "هر روز ۰۲:۳۰", active: true,
    stages: [
      { key: "extract", label: "استخراج", state: "ok" }, { key: "clean", label: "پاک‌سازی", state: "ok" },
      { key: "map", label: "نگاشت", state: "ok" }, { key: "validate", label: "اعتبارسنجی", state: "ok" }, { key: "load", label: "بارگذاری", state: "warn" },
    ],
    lastRun: "امروز ۰۲:۳۰", nextRun: "فردا ۰۲:۳۰", records: 96_870, errors: 6, duration: "۲:۵۶", runs: runSet(48200, 4),
  },
];

/* --------------------------- Data quality --------------------------- */
export type Severity = "high" | "medium" | "low";
export type IssueStatus = "open" | "fixed" | "ignored";
export type IssueCategory =
  | "رکورد تکراری"
  | "کد حساب نامعتبر"
  | "مغایرت جمع"
  | "فیلد خالی"
  | "تاریخ نامعتبر";

export type QualityIssue = {
  id: string;
  category: IssueCategory;
  title: string;
  detail: string;
  severity: Severity;
  company: string;
  pipeline: string;
  records: number;
  detectedAt: string;
  status: IssueStatus;
};

export const qualityIssues: QualityIssue[] = [
  { id: "QI-2041", category: "مغایرت جمع", title: "عدم تراز سند افتتاحیه انبار اصفهان", detail: "جمع بدهکار ۸٬۴۲۰٬۰۰۰٬۰۰۰ ریال با بستانکار ۸٬۳۹۵٬۰۰۰٬۰۰۰ ریال اختلاف دارد.", severity: "high", company: "شرکت پخش آرمان", pipeline: "موجودی و انبارگردانی", records: 1, detectedAt: "۱۴۰۵/۰۸/۲۹ — ۱۲:۰۴", status: "open" },
  { id: "QI-2040", category: "کد حساب نامعتبر", title: "کد حساب ۱۰۹۹۹ در ۴۶ ردیف سند خرید", detail: "کد حساب در دفتر کل مقصد وجود ندارد و در جدول نگاشت تعریف نشده است.", severity: "high", company: "شرکت پخش آرمان", pipeline: "اسناد خرید و هزینه", records: 46, detectedAt: "۱۴۰۵/۰۸/۲۹ — ۰۳:۴۸", status: "open" },
  { id: "QI-2039", category: "رکورد تکراری", title: "فاکتورهای فروش با شماره تکراری", detail: "۱۲۸ رکورد با کلید combination (شماره فاکتور، شعبه) تکراری شناسایی شد.", severity: "medium", company: "گروه صنعتی پارس‌فولاد", pipeline: "فروش روزانه ← دفتر کل", records: 128, detectedAt: "۱۴۰۵/۰۸/۲۸ — ۲۳:۱۹", status: "open" },
  { id: "QI-2038", category: "تاریخ نامعتبر", title: "تاریخ ۱۴۰۵/۱۳/۰۲ در اسناد حقوق", detail: "ماه ۱۳ در تقویم شمسی وجود ندارد؛ ۹ رکورد رد شد.", severity: "medium", company: "گروه صنعتی پارس‌فولاد", pipeline: "حقوق و دستمزد مهر", records: 9, detectedAt: "۱۴۰۵/۰۸/۲۸ — ۲۱:۱۲", status: "open" },
  { id: "QI-2037", category: "فیلد خالی", title: "مرکز هزینه خالی در اسناد فروش مشهد", detail: "۳۱۲ ردیف بدون مرکز هزینه؛ به‌صورت پیش‌فرض «نامشخص» درج می‌شود.", severity: "low", company: "شرکت پخش آرمان", pipeline: "فروش روزانه ← دفتر کل", records: 312, detectedAt: "۱۴۰۵/۰۸/۲۸ — ۱۵:۳۱", status: "open" },
  { id: "QI-2036", category: "مغایرت جمع", title: "اختلاف جمع در سند برگشت از فروش", detail: "جمع بدهکار و بستانکار ۳٬۱۰۰٬۰۰۰ ریال اختلاف دارد.", severity: "high", company: "بازرگانی نیک‌رو", pipeline: "دریافتنی و تسویه مشتریان", records: 2, detectedAt: "۱۴۰۵/۰۸/۲۸ — ۰۹:۰۵", status: "open" },
  { id: "QI-2035", category: "کد حساب نامعتبر", title: "حساب بانک ملت با کد قدیمی", detail: "کد ۱۰۲۰۱ به ۱۰۲۰۲ تغییر کرده؛ نیاز به به‌روزرسانی نگاشت.", severity: "medium", company: "شرکت پخش آرمان", pipeline: "فروش روزانه ← دفتر کل", records: 21, detectedAt: "۱۴۰۵/۰۸/۲۷ — ۱۸:۴۲", status: "open" },
  { id: "QI-2034", category: "رکورد تکراری", title: "تکرار اسناد پرداخت به تأمین‌کننده", detail: "۸ رکورد بر اساس شماره حواله یکسان در دو شعبه.", severity: "medium", company: "داروسازی سلامت‌گستر", pipeline: "فروش و مرجوعی سلامت‌گستر", records: 8, detectedAt: "۱۴۰۵/۰۸/۲۷ — ۱۱:۲۶", status: "open" },
  { id: "QI-2033", category: "فیلد خالی", title: "شرح سند خالی", detail: "۴۳ ردیف بدون شرح؛ مطابق قاعده، شرح از فیلد مرجع پر می‌شود.", severity: "low", company: "داروسازی سلامت‌گستر", pipeline: "فروش و مرجوعی سلامت‌گستر", records: 43, detectedAt: "۱۴۰۵/۰۸/۲۶ — ۲۰:۱۰", status: "open" },
  { id: "QI-2032", category: "مغایرت جمع", title: "جمع مالیات ارزش افزوده نامتوازن", detail: "مالیات محاسبه‌شده ۱۰٪ با مبلغ سند ۹٪ هم‌خوانی ندارد.", severity: "medium", company: "شرکت پخش آرمان", pipeline: "اسناد خرید و هزینه", records: 17, detectedAt: "۱۴۰۵/۰۸/۲۶ — ۱۴:۰۲", status: "fixed" },
  { id: "QI-2031", category: "تاریخ نامعتبر", title: "تاریخ خارج از دوره مالی", detail: "۶ سند با تاریخ ۱۴۰۴/۱۲/۳۰ در دوره ۱۴۰۵ ثبت شده بود.", severity: "low", company: "بازرگانی نیک‌رو", pipeline: "دریافتنی و تسویه مشتریان", records: 6, detectedAt: "۱۴۰۵/۰۸/۲۵ — ۱۰:۵۵", status: "fixed" },
  { id: "QI-2030", category: "رکورد تکراری", title: "تکرار سطرهای انبارگردانی", detail: "۳۴ سطر تکراری در شمارش انبار حذف شد.", severity: "low", company: "شرکت پخش آرمان", pipeline: "موجودی و انبارگردانی", records: 34, detectedAt: "۱۴۰۵/۰۸/۲۴ — ۱۶:۳۰", status: "fixed" },
  { id: "QI-2029", category: "کد حساب نامعتبر", title: "کد مرکز هزینه نامعتبر", detail: "کد ۹۹ در مراکز هزینه وجود ندارد؛ نگاشت اصلاح شد.", severity: "medium", company: "گروه صنعتی پارس‌فولاد", pipeline: "فروش روزانه ← دفتر کل", records: 12, detectedAt: "۱۴۰۵/۰۸/۲۳ — ۰۹:۱۸", status: "fixed" },
  { id: "QI-2028", category: "فیلد خالی", title: "کد اقتصادی مشتری خالی", detail: "برای ۶۱ مشتری حقوقی کد اقتصادی ثبت نشده است.", severity: "low", company: "بازرگانی نیک‌رو", pipeline: "دریافتنی و تسویه مشتریان", records: 61, detectedAt: "۱۴۰۵/۰۸/۲۲ — ۱۳:۴۰", status: "ignored" },
];

export type QualityRule = {
  id: string;
  name: string;
  category: IssueCategory;
  expression: string;
  severity: Severity;
  active: boolean;
  hits: number;
};

export const qualityRules: QualityRule[] = [
  { id: "R-01", name: "یکتایی شماره فاکتور", category: "رکورد تکراری", expression: "unique(invoice_no, branch_id)", severity: "high", active: true, hits: 128 },
  { id: "R-02", name: "اعتبار کد حساب مقصد", category: "کد حساب نامعتبر", expression: "account_code IN dest_chart_of_accounts", severity: "high", active: true, hits: 67 },
  { id: "R-03", name: "تراز بدهکار و بستانکار", category: "مغایرت جمع", expression: "sum(debit) == sum(credit)", severity: "high", active: true, hits: 19 },
  { id: "R-04", name: "الزام مرکز هزینه", category: "فیلد خالی", expression: "cost_center IS NOT NULL", severity: "medium", active: true, hits: 312 },
  { id: "R-05", name: "اعتبار تاریخ شمسی", category: "تاریخ نامعتبر", expression: "is_valid_jalali(voucher_date)", severity: "medium", active: true, hits: 15 },
  { id: "R-06", name: "بازه تاریخ دوره مالی", category: "تاریخ نامعتبر", expression: "voucher_date BETWEEN period_start AND period_end", severity: "low", active: true, hits: 6 },
  { id: "R-07", name: "الزام شرح سند", category: "فیلد خالی", expression: "description != ''", severity: "low", active: false, hits: 43 },
  { id: "R-08", name: "هم‌خوانی نرخ مالیات", category: "مغایرت جمع", expression: "vat == round(subtotal * 0.10)", severity: "medium", active: true, hits: 22 },
];

/* ----------------------------- Vouchers ----------------------------- */
export type VoucherStatus = "posted" | "pending" | "error" | "draft";
export type VoucherType =
  | "فروش"
  | "خرید"
  | "دریافت"
  | "پرداخت"
  | "برگشت"
  | "حقوق"
  | "انبار"
  | "سایر"
  | "عمومی"
  | "سایر سیستم‌ها"
  | "بستن حساب‌ها"
  | "اختتامیه"
  | "افتتاحیه"
  | "تسعیر";

export type VoucherLine = {
  code: string;
  account: string;
  debit: number;
  credit: number;
  costCenter?: string;
};

export type Voucher = {
  id: string;
  number: string;
  date: string;
  description: string;
  type: VoucherType;
  company: string;
  branch: string;
  status: VoucherStatus;
  source: string;
  lines: VoucherLine[];
  destinationNo?: string;
  postedAt?: string;
  error?: string;
  createdBy: string;
  reference?: string;
};

export const vouchers: Voucher[] = ledgerVouchers;

export const voucherStatusMeta: Record<VoucherStatus, { label: string; tone: string }> = {
  posted: { label: "ثبت‌شده", tone: "success" },
  pending: { label: "در انتظار", tone: "warn" },
  error: { label: "خطا", tone: "danger" },
  draft: { label: "پیش‌نویس", tone: "muted" },
};

export const accountMapping = [
  { srcCode: "01", srcName: "حسابهاي دريافتني", dstCode: "0-11-12-01", dstName: "حسابهاي دريافتني", confidence: 100, status: "ok" },
  { srcCode: "05", srcName: "موجودي بانكهاي ريالي", dstCode: "0-11-10-05", dstName: "موجودي بانكهاي ريالي", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "حسابهاي پرداختني", dstCode: "0-21-10-01", dstName: "حسابهاي پرداختني", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "موجودي  انبار مواد اوليه", dstCode: "0-11-15-01", dstName: "موجودي  انبار مواد اوليه", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "فروش  داخلي محصولات", dstCode: "0-41-10-01", dstName: "فروش  داخلي محصولات", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "بهاي تمام‌شده كالاي فروش رفته داخلي محصولات", dstCode: "0-51-10-01", dstName: "بهاي تمام‌شده كالاي فروش رفته داخلي محصولات", confidence: 100, status: "ok" },
  { srcCode: "02", srcName: "چكهاي دريافتني نزد صندوق", dstCode: "0-11-12-02", dstName: "چكهاي دريافتني نزد صندوق", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "پيش دريافت فروش محصولات", dstCode: "0-21-13-01", dstName: "پيش دريافت فروش محصولات", confidence: 100, status: "ok" },
  { srcCode: "12", srcName: "ماليات ارزش افزوده پرداختي", dstCode: "0-21-11-12", dstName: "ماليات ارزش افزوده پرداختي", confidence: 100, status: "ok" },
  { srcCode: "12", srcName: "ماليات بر ارزش افزوده دريافتني", dstCode: "0-11-13-12", dstName: "ماليات بر ارزش افزوده دريافتني", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "جاري شركا", dstCode: "0-21-15-01", dstName: "جاري شركا", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "سود (زيان ) انباشته", dstCode: "0-31-12-01", dstName: "سود (زيان ) انباشته", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "زمين", dstCode: "0-12-10-01", dstName: "زمين", confidence: 100, status: "ok" },
  { srcCode: "02", srcName: "ساختمانها", dstCode: "0-12-10-02", dstName: "ساختمانها", confidence: 100, status: "ok" },
  { srcCode: "07", srcName: "حقوق ودستمزد پرداختني", dstCode: "0-21-11-07", dstName: "حقوق ودستمزد پرداختني", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "پيش پرداخت خريد موجودي ها", dstCode: "0-11-18-01", dstName: "پيش پرداخت خريد موجودي ها", confidence: 100, status: "ok" },
  { srcCode: "04", srcName: "ماشين آلات و تجهيزات توليد", dstCode: "0-12-10-04", dstName: "ماشين آلات و تجهيزات توليد", confidence: 100, status: "ok" },
  { srcCode: "02", srcName: "تعديلات سنواتي", dstCode: "0-31-12-02", dstName: "تعديلات سنواتي", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "حقوق پايه", dstCode: "0-61-10-01", dstName: "حقوق پايه", confidence: 100, status: "ok" },
  { srcCode: "04", srcName: "سازمان تامين اجتماعي – حق بيمه پرداختني كاركنان", dstCode: "0-21-11-04", dstName: "سازمان تامين اجتماعي – حق بيمه پرداختني كاركنان", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "ماليات برعملكرد", dstCode: "0-21-14-01", dstName: "ماليات برعملكرد", confidence: 100, status: "ok" },
  { srcCode: "30", srcName: "هزينه هاي حمل و انبارداري", dstCode: "0-61-12-30", dstName: "هزينه هاي حمل و انبارداري", confidence: 100, status: "ok" },
  { srcCode: "14", srcName: "ساير حسابهاي پرداختني", dstCode: "0-21-11-14", dstName: "ساير حسابهاي پرداختني", confidence: 100, status: "ok" },
  { srcCode: "03", srcName: "تاسيسات", dstCode: "0-12-10-03", dstName: "تاسيسات", confidence: 100, status: "ok" },
  { srcCode: "11", srcName: "بيمه سهم كارفرما", dstCode: "0-61-10-11", dstName: "بيمه سهم كارفرما", confidence: 100, status: "ok" },
  { srcCode: "02", srcName: "هزينه مزايا ماهانه", dstCode: "0-61-10-02", dstName: "هزينه مزايا ماهانه", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "سرمايه", dstCode: "0-31-10-01", dstName: "سرمايه", confidence: 100, status: "ok" },
  { srcCode: "01", srcName: "برگشت از فروش  داخلي محصولات", dstCode: "0-41-11-01", dstName: "برگشت از فروش  داخلي محصولات", confidence: 100, status: "ok" },
];

/* ------------------------------ Reports ------------------------------ */
export const salesTrend = [
  { month: "فروردین", value: 0, records: 0 },
  { month: "اردیبهشت", value: 11836, records: 39 },
  { month: "خرداد", value: 6256, records: 18 },
  { month: "تیر", value: 5716, records: 12 },
  { month: "مرداد", value: 6380, records: 9 },
  { month: "شهریور", value: 10166, records: 29 },
  { month: "مهر", value: 9663, records: 27 },
  { month: "آبان", value: 7246, records: 25 },
  { month: "آذر", value: 7507, records: 15 },
  { month: "دی", value: 0, records: 0 },
  { month: "بهمن", value: 12299, records: 28 },
  { month: "اسفند", value: 7160, records: 21 },
];

export const balanceSheet = [
  { label: "دارایی جاری", assets: 18585, liabilities: 0, equity: 0 },
  { label: "دارایی ثابت", assets: 21149, liabilities: 0, equity: 0 },
  { label: "بدهی جاری", assets: 0, liabilities: 29002, equity: 0 },
  { label: "بدهی بلندمدت", assets: 0, liabilities: 0, equity: 0 },
  { label: "سرمایه", assets: 0, liabilities: 0, equity: 0 },
  { label: "اندوخته قانونی", assets: 0, liabilities: 0, equity: 0 },
  { label: "سود انباشته", assets: 0, liabilities: 0, equity: 0 },
  { label: "سود دوره جاری", assets: 0, liabilities: 0, equity: 4206 },
];

export const recordTrend = [
  { day: "14 اسفند", processed: 3, valid: 3 },
  { day: "15 اسفند", processed: 5, valid: 5 },
  { day: "17 اسفند", processed: 17, valid: 17 },
  { day: "18 اسفند", processed: 17, valid: 17 },
  { day: "19 اسفند", processed: 14, valid: 14 },
  { day: "20 اسفند", processed: 8, valid: 8 },
  { day: "22 اسفند", processed: 2, valid: 2 },
  { day: "23 اسفند", processed: 9, valid: 9 },
  { day: "24 اسفند", processed: 21, valid: 21 },
  { day: "25 اسفند", processed: 16, valid: 16 },
  { day: "26 اسفند", processed: 74, valid: 74 },
  { day: "27 اسفند", processed: 34, valid: 34 },
  { day: "28 اسفند", processed: 94, valid: 94 },
  { day: "29 اسفند", processed: 52, valid: 52 },
];

export const vouchersByStatus = [
  { label: "ثبت‌شده", value: 2893, color: "#7BE495" },
  { label: "در انتظار", value: 0, color: "#F7B955" },
  { label: "خطا", value: 0, color: "#FF6B81" },
  { label: "پیش‌نویس", value: 0, color: "#8A9BB4" },
];

export const agentPerformance = [
  { name: "ARN-01", value: 99.8, records: 1_842_000 },
  { name: "ARN-02", value: 99.6, records: 964_000 },
  { name: "ARN-03", value: 82.4, records: 388_000 },
  { name: "PRS-04", value: 99.9, records: 3_218_000 },
  { name: "NKR-05", value: 41.2, records: 96_000 },
  { name: "SLM-06", value: 99.4, records: 1_264_000 },
];

/* ------------------------------- Logs ------------------------------- */
export type LogLevel = "info" | "warn" | "error";
export type LogEntry = {
  id: string;
  ts: string;
  level: LogLevel;
  source: string;
  message: string;
  actor: string;
  ip: string;
};

export const logs: LogEntry[] = [
  { id: "L-9821", ts: "۱۴۰۵/۰۸/۲۹ ۱۲:۰۴:۵۱", level: "error", source: "quality-engine", message: "قاعده R-03 نقض شد: عدم تراز در سند QI-2041 (اختلاف ۲۵٬۰۰۰٬۰۰۰ ریال)", actor: "system", ip: "10.0.3.14" },
  { id: "L-9820", ts: "۱۴۰۵/۰۸/۲۹ ۱۱:۵۸:۲۲", level: "warn", source: "agent-gateway", message: "ضربان قلب RONAK-AG-03 با تأخیر ۴۱۲ ثانیه دریافت شد", actor: "gateway", ip: "10.20.6.24" },
  { id: "L-9819", ts: "۱۴۰۵/۰۸/۲۹ ۱۱:۴۲:۰۸", level: "info", source: "voucher-service", message: "۱۲ سند فروش با موفقیت در سپیدار ثبت شد (batch #۲۴۸۱)", actor: "system", ip: "10.0.3.21" },
  { id: "L-9818", ts: "۱۴۰۵/۰۸/۲۹ ۱۱:۱۵:۳۳", level: "error", source: "voucher-service", message: "ثبت سند ۱۴۰۵-۰۸۲۸-۰۱۲ ناموفق: کد حساب ۱۰۹۹۹ در مقصد یافت نشد", actor: "system", ip: "10.0.3.21" },
  { id: "L-9817", ts: "۱۴۰۵/۰۸/۲۹ ۱۰:۵۲:۱۹", level: "info", source: "pipeline-runner", message: "پایپلاین «فروش روزانه ← دفتر کل» با ۱۸۴٬۴۲۰ رکورد تکمیل شد", actor: "scheduler", ip: "10.0.3.10" },
  { id: "L-9816", ts: "۱۴۰۵/۰۸/۲۹ ۱۰:۳۱:۰۰", level: "warn", source: "mapping-engine", message: "نگاشت حساب ۶۰۱۰۱ با اطمینان ۸۸٪ نیازمند بازبینی دستی است", actor: "mapping-engine", ip: "10.0.3.18" },
  { id: "L-9815", ts: "۱۴۰۵/۰۸/۲۹ ۱۰:۰۲:۴۴", level: "info", source: "auth", message: "ورود موفق کاربر m.rostami از مرورگر Chrome / Windows", actor: "m.rostami", ip: "185.55.12.9" },
  { id: "L-9814", ts: "۱۴۰۵/۰۸/۲۹ ۰۹:۴۸:۱۲", level: "info", source: "agent-gateway", message: "توکن ایجنت RONAK-AG-02 با موفقیت چرخش یافت", actor: "system", ip: "10.20.4.18" },
  { id: "L-9813", ts: "۱۴۰۵/۰۸/۲۹ ۰۹:۳۰:۰۱", level: "info", source: "connector", message: "اتصال TLS به 10.31.0.7:1521 برقرار شد (TLS 1.3, AES-256-GCM)", actor: "agent", ip: "10.31.0.7" },
  { id: "L-9812", ts: "۱۴۰۵/۰۸/۲۹ ۰۸:۵۹:۵۷", level: "warn", source: "connector", message: "کندی پاسخ‌دهی منبع «فروش مشهد» (۲.۸ ثانیه) — تلاش مجدد انجام شد", actor: "agent", ip: "10.20.6.24" },
  { id: "L-9811", ts: "۱۴۰۵/۰۸/۲۹ ۰۸:۱۲:۳۰", level: "error", source: "connector", message: "اتصال به منبع «بازرگانی نیک‌رو» برقرار نشد: connection refused (3306)", actor: "agent", ip: "10.44.2.5" },
  { id: "L-9810", ts: "۱۴۰۵/۰۸/۲۹ ۰۷:۴۰:۱۵", level: "info", source: "reporting", message: "گزارش «روند فروش» برای دوره آبان ۱۴۰۵ بازتولید شد", actor: "s.kazemi", ip: "185.55.12.22" },
  { id: "L-9809", ts: "۱۴۰۵/۰۸/۲۹ ۰۶:۰۵:۲۸", level: "info", source: "backup", message: "پشتیبان‌گیری خودکار داده‌های نگاشت با موفقیت انجام شد (۴۲ مگابایت)", actor: "system", ip: "10.0.3.5" },
  { id: "L-9808", ts: "۱۴۰۵/۰۸/۲۹ ۰۴:۰۲:۰۳", level: "warn", source: "quality-engine", message: "۳۱۲ رکورد با فیلد خالی «مرکز هزینه» شناسایی شد", actor: "system", ip: "10.0.3.14" },
  { id: "L-9807", ts: "۱۴۰۵/۰۸/۲۹ ۰۳:۵۱:۳۹", level: "info", source: "voucher-service", message: "سند خرید ۱۴۰۵-۰۸۲۹-۰۰۲ در صف ثبت قرار گرفت", actor: "system", ip: "10.0.3.21" },
  { id: "L-9806", ts: "۱۴۰۵/۰۸/۲۹ ۰۳:۱۵:۰۲", level: "info", source: "pipeline-runner", message: "اجرای زمان‌بندی‌شده pipeline PL-100 آغاز شد", actor: "scheduler", ip: "10.0.3.10" },
  { id: "L-9805", ts: "۱۴۰۵/۰۸/۲۸ ۲۳:۱۹:۴۰", level: "warn", source: "quality-engine", message: "۱۲۸ رکورد تکراری در منابع پارس‌فولاد یافت شد", actor: "system", ip: "10.0.3.14" },
  { id: "L-9804", ts: "۱۴۰۵/۰۸/۲۸ ۲۱:۱۲:۱۱", level: "error", source: "quality-engine", message: "تاریخ نامعتبر ۱۴۰۵/۱۳/۰۲ در ۹ رکورد حقوق رد شد", actor: "system", ip: "10.0.3.14" },
  { id: "L-9803", ts: "۱۴۰۵/۰۸/۲۸ ۱۸:۴۳:۰۰", level: "info", source: "auth", message: "توکن API جدید برای اتصال گزارش‌ساز ایجاد شد", actor: "a.tavakoli", ip: "185.55.12.31" },
  { id: "L-9802", ts: "۱۴۰۵/۰۸/۲۸ ۱۶:۲۰:۰۵", level: "info", source: "agent-gateway", message: "ایجنت RONAK-AG-06 نسخه ۲.۴.۱ را با موفقیت نصب کرد", actor: "system", ip: "10.52.8.3" },
  { id: "L-9801", ts: "۱۴۰۵/۰۸/۲۸ ۱۴:۰۵:۳۳", level: "warn", source: "system", message: "مصرف CPU ایجنت RONAK-AG-03 به ۷۱٪ رسید", actor: "monitor", ip: "10.20.6.24" },
  { id: "L-9800", ts: "۱۴۰۵/۰۸/۲۸ ۱۱:۳۰:۲۲", level: "info", source: "voucher-service", message: "سند ۱۴۰۵-۰۸۲۸-۰۱۱ با شماره مقصد ۸۴۱۹۸۸ ثبت شد", actor: "system", ip: "10.0.3.21" },
  { id: "L-9798", ts: "۱۴۰۵/۰۸/۲۸ ۰۹:۰۵:۱۲", level: "error", source: "pipeline-runner", message: "اجرای PL-104 متوقف شد: منبع در دسترس نیست", actor: "scheduler", ip: "10.0.3.10" },
  { id: "L-9797", ts: "۱۴۰۵/۰۸/۲۸ ۰۸:۰۰:۰۰", level: "info", source: "system", message: "دوره مالی آبان ۱۴۰۵ باز شد", actor: "s.kazemi", ip: "185.55.12.22" },
];

/* --------------------------- Activity feed --------------------------- */
export type Activity = {
  id: string;
  title: string;
  sub: string;
  time: string;
  tone: "success" | "warn" | "danger" | "info";
  icon: "check" | "alert" | "sync" | "file" | "user" | "shield";
};

export const activities: Activity[] = [
  { id: "A1", title: "۱۸۴٬۴۲۰ رکورد فروش پردازش شد", sub: "پایپلاین فروش روزانه ← دفتر کل", time: "۳ دقیقه پیش", tone: "success", icon: "sync" },
  { id: "A2", title: "۱۲ سند در سپیدار ثبت شد", sub: "شرکت پخش آرمان — دسته #۲۴۸۱", time: "۱۸ دقیقه پیش", tone: "success", icon: "file" },
  { id: "A3", title: "ضربان قلب ایجنت مشهد با تأخیر", sub: "RONAK-AG-03 — ۷ دقیقه بدون پاسخ", time: "۳۲ دقیقه پیش", tone: "warn", icon: "alert" },
  { id: "A4", title: "خطا در ثبت سند برگشت از فروش", sub: "کد حساب ۱۰۹۹۹ در مقصد موجود نیست", time: "۴۸ دقیقه پیش", tone: "danger", icon: "shield" },
  { id: "A5", title: "نگاشت ۲ حساب بازبینی شد", sub: "برگشت از فروش، هزینه حمل و نقل", time: "۱ ساعت پیش", tone: "info", icon: "user" },
  { id: "A6", title: "گزارش روند فروش آبان آماده شد", sub: "توسط سارا کاظمی", time: "۲ ساعت پیش", tone: "success", icon: "check" },
];

/* ------------------------------ Settings ------------------------------ */
export const roles = [
  { name: "مدیر سازمان", members: 2, perms: "دسترسی کامل به همه بخش‌ها", color: "#2FE0BE" },
  { name: "حسابدار ارشد", members: 3, perms: "اسناد، گزارش‌ها، نگاشت حساب", color: "#7C8CFF" },
  { name: "تحلیلگر داده", members: 4, perms: "داشبورد، کیفیت داده، گزارش‌ها (فقط خواندن)", color: "#F7B955" },
  { name: "پشتیبانی فنی", members: 2, perms: "منابع، ایجنت‌ها، لاگ‌ها", color: "#8A9BB4" },
];

export const teamMembers = [
  { name: "سرپرست", email: "Admin@spidar.local", role: "مدیر سیستم", last: "—", initials: "س", color: "#2FE0BE" },
  { name: "مهرداد آريا", email: "آريا@spidar.local", role: "حسابدار", last: "—", initials: "م", color: "#7C8CFF" },
  { name: "baghaei", email: "baghaei@spidar.local", role: "کاربر", last: "—", initials: "b", color: "#F7B955" },
];

/* ------------------------------ Helpers ------------------------------ */
export function voucherTotal(v: Voucher): number {
  return v.lines.reduce((s, l) => s + l.debit, 0);
}
