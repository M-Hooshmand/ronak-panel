/* ------------------------------------------------------------------
   HR domain data — personnel, time-clock, leaves, letters
   ------------------------------------------------------------------ */

export type Dept = "مالی" | "فروش" | "تولید" | "تأمین" | "منابع انسانی" | "انبار";
export type AttStatus = "حاضر" | "مرخصی" | "ماموریت" | "غایب" | "تأخیر";

export const departments: Array<{ name: Dept; headcount: number; color: string }> = [
  { name: "تولید", headcount: 34, color: "#2FE0BE" },
  { name: "فروش", headcount: 12, color: "#7C8CFF" },
  { name: "مالی", headcount: 7, color: "#F7B955" },
  { name: "تأمین", headcount: 6, color: "#7BE495" },
  { name: "انبار", headcount: 5, color: "#C3CBFF" },
  { name: "منابع انسانی", headcount: 3, color: "#FF9DB0" },
];

export type Employee = {
  id: number;
  code: string;
  name: string;
  role: string;
  dept: Dept;
  join: string;
  contract: string;
  contractEnd: string;
  mobile: string;
  nid: string;
  base: number;
  status: "فعال" | "مرخصی" | "پایان قرارداد";
};

export const employees: Employee[] = [
  { id: 1, code: "EMP-1001", name: "سارا محمدی", role: "مدیر مالی", dept: "مالی", join: "۱۳۹۹/۰۴/۰۱", contract: "دائم", contractEnd: "—", mobile: "۰۹۱۲۱۱۱۲۲۳۳", nid: "۰۰۱۲۳۴۵۶۷۸", base: 320_000_000, status: "فعال" },
  { id: 2, code: "EMP-1002", name: "رضا کریمی", role: "مدیر فروش", dept: "فروش", join: "۱۴۰۰/۰۲/۱۵", contract: "دائم", contractEnd: "—", mobile: "۰۹۱۲۳۳۳۴۴۵۵", nid: "۰۰۲۳۴۵۶۷۸۹", base: 280_000_000, status: "فعال" },
  { id: 3, code: "EMP-1003", name: "مهدی رستمی", role: "سرپرست انبار", dept: "انبار", join: "۱۴۰۰/۰۹/۱۰", contract: "یک‌ساله", contractEnd: "۱۴۰۵/۰۹/۱۰", mobile: "۰۹۱۹۴۴۴۵۵۶۶", nid: "۰۰۳۴۵۶۷۸۹۰", base: 210_000_000, status: "فعال" },
  { id: 4, code: "EMP-1004", name: "نگار احمدی", role: "کارشناس حسابداری", dept: "مالی", join: "۱۴۰۱/۰۱/۲۰", contract: "دائم", contractEnd: "—", mobile: "۰۹۳۵۵۵۶۶۷۷۸", nid: "۰۰۴۵۶۷۸۹۰۱", base: 190_000_000, status: "فعال" },
  { id: 5, code: "EMP-1005", name: "امیر حسینی", role: "اپراتور تولید", dept: "تولید", join: "۱۴۰۱/۰۶/۰۵", contract: "یک‌ساله", contractEnd: "۱۴۰۵/۱۲/۰۵", mobile: "۰۹۱۲۶۶۶۷۷۸۸", nid: "۰۰۵۶۷۸۹۰۱۲", base: 165_000_000, status: "مرخصی" },
  { id: 6, code: "EMP-1006", name: "فاطمه رضایی", role: "کارشناس خرید", dept: "تأمین", join: "۱۴۰۲/۰۳/۱۲", contract: "دائم", contractEnd: "—", mobile: "۰۹۳۰۷۷۷۸۸۹۹", nid: "۰۰۶۷۸۹۰۱۲۳", base: 175_000_000, status: "فعال" },
  { id: 7, code: "EMP-1007", name: "حسین مرادی", role: "سرپرست تولید", dept: "تولید", join: "۱۳۹۸/۱۱/۰۲", contract: "دائم", contractEnd: "—", mobile: "۰۹۱۲۸۸۸۹۹۰۰", nid: "۰۰۷۸۹۰۱۲۳۴", base: 245_000_000, status: "فعال" },
  { id: 8, code: "EMP-1008", name: "مریم صادقی", role: "کارشناس فروش", dept: "فروش", join: "۱۴۰۳/۰۲/۰۸", contract: "یک‌ساله", contractEnd: "۱۴۰۶/۰۲/۰۸", mobile: "۰۹۳۹۹۹۰۰۱۱۲", nid: "۰۰۸۹۰۱۲۳۴۵", base: 158_000_000, status: "فعال" },
  { id: 9, code: "EMP-1009", name: "علی اکبری", role: "تعمیرکار خط", dept: "تولید", join: "۱۴۰۰/۰۷/۱۹", contract: "دائم", contractEnd: "—", mobile: "۰۹۱۲۰۰۱۱۲۲۳", nid: "۰۰۹۰۱۲۳۴۵۶", base: 172_000_000, status: "فعال" },
  { id: 10, code: "EMP-1010", name: "زهرا نوری", role: "کارشناس منابع انسانی", dept: "منابع انسانی", join: "۱۴۰۲/۱۰/۰۳", contract: "دائم", contractEnd: "—", mobile: "۰۹۳۳۱۲۳۴۵۶۷", nid: "۰۱۰۱۲۳۴۵۶۷", base: 168_000_000, status: "فعال" },
];

export type Attendance = {
  empId: number;
  in: string;
  out: string;
  worked: string;
  overtime: string;
  delay: number;
  leave: string;
  status: AttStatus;
};

export const attendanceToday: Attendance[] = [
  { empId: 1, in: "۰۷:۵۲", out: "۱۶:۳۴", worked: "۸:۴۲", overtime: "۰:۳۴", delay: 0, leave: "—", status: "حاضر" },
  { empId: 2, in: "۰۸:۰۳", out: "۱۷:۱۰", worked: "۹:۰۷", overtime: "۰:۵۲", delay: 3, leave: "—", status: "تأخیر" },
  { empId: 3, in: "۰۷:۴۵", out: "۱۶:۲۰", worked: "۸:۳۵", overtime: "۰:۲۰", delay: 0, leave: "—", status: "حاضر" },
  { empId: 4, in: "۰۸:۰۰", out: "۱۶:۳۰", worked: "۸:۳۰", overtime: "۰:۰۰", delay: 0, leave: "—", status: "حاضر" },
  { empId: 5, in: "—", out: "—", worked: "۰", overtime: "۰", delay: 0, leave: "مرخصی استحقاقی", status: "مرخصی" },
  { empId: 6, in: "۰۷:۵۸", out: "۱۶:۴۰", worked: "۸:۴۲", overtime: "۰:۴۰", delay: 0, leave: "—", status: "حاضر" },
  { empId: 7, in: "۰۷:۳۰", out: "۱۸:۰۵", worked: "۱۰:۳۵", overtime: "۲:۰۵", delay: 0, leave: "—", status: "حاضر" },
  { empId: 8, in: "۰۸:۱۵", out: "۱۷:۰۰", worked: "۸:۴۵", overtime: "۰:۰۰", delay: 15, leave: "—", status: "تأخیر" },
  { empId: 9, in: "۰۶:۵۵", out: "۱۵:۴۰", worked: "۸:۴۵", overtime: "۰:۱۵", delay: 0, leave: "—", status: "حاضر" },
  { empId: 10, in: "۰۸:۰۲", out: "—", worked: "—", overtime: "—", delay: 2, leave: "—", status: "حاضر" },
];

export const monthSummary = [
  { empId: 1, days: 21, overtime: 18.5, delay: 12, leave: 1, mission: 0 },
  { empId: 2, days: 20, overtime: 22.0, delay: 41, leave: 2, mission: 1 },
  { empId: 3, days: 22, overtime: 9.0, delay: 0, leave: 0, mission: 0 },
  { empId: 4, days: 22, overtime: 4.5, delay: 8, leave: 0, mission: 0 },
  { empId: 5, days: 19, overtime: 12.0, delay: 26, leave: 3, mission: 0 },
  { empId: 6, days: 21, overtime: 10.5, delay: 5, leave: 1, mission: 0 },
  { empId: 7, days: 22, overtime: 34.0, delay: 0, leave: 0, mission: 1 },
  { empId: 8, days: 21, overtime: 6.0, delay: 33, leave: 1, mission: 0 },
  { empId: 9, days: 22, overtime: 15.5, delay: 0, leave: 0, mission: 0 },
  { empId: 10, days: 21, overtime: 7.0, delay: 14, leave: 1, mission: 0 },
];

export const timeclock = {
  device: "ZKTeco K40",
  ip: "192.168.10.42",
  connection: "متصل",
  lastSync: "امروز ۰۸:۱۵",
  recordsToday: 84,
  unmatched: 3,
  firmware: "6.60.1",
  bridge: "Ronak Agent 2.4.1",
};

export type Leave = {
  id: string;
  empId: number;
  kind: "استحقاقی" | "استعلاجی" | "بدون حقوق" | "ساعتی" | "ماموریت";
  from: string;
  to: string;
  amount: string;
  reason: string;
  status: "تأییدشده" | "در انتظار" | "ردشده";
};

export const leaves: Leave[] = [
  { id: "LR-2401", empId: 5, kind: "استحقاقی", from: "۱۴۰۵/۰۸/۲۸", to: "۱۴۰۵/۰۸/۳۰", amount: "۳ روز", reason: "سفر خانوادگی", status: "تأییدشده" },
  { id: "LR-2402", empId: 8, kind: "ساعتی", from: "۱۴۰۵/۰۸/۲۹", to: "۱۴۰۵/۰۸/۲۹", amount: "۲ ساعت", reason: "پزشک", status: "در انتظار" },
  { id: "LR-2403", empId: 2, kind: "ماموریت", from: "۱۴۰۵/۰۸/۳۰", to: "۱۴۰۵/۰۹/۰۱", amount: "۲ روز", reason: "جلسه مشتری — اصفهان", status: "تأییدشده" },
  { id: "LR-2404", empId: 4, kind: "استعلاجی", from: "۱۴۰۵/۰۸/۲۶", to: "۱۴۰۵/۰۸/۲۶", amount: "۱ روز", reason: "استراحت پزشکی", status: "تأییدشده" },
  { id: "LR-2405", empId: 9, kind: "بدون حقوق", from: "۱۴۰۵/۰۹/۰۲", to: "۱۴۰۵/۰۹/۰۳", amount: "۲ روز", reason: "امور شخصی", status: "در انتظار" },
  { id: "LR-2406", empId: 7, kind: "ماموریت", from: "۱۴۰۵/۰۸/۲۴", to: "۱۴۰۵/۰۸/۲۵", amount: "۲ روز", reason: "بازدید خط تولید", status: "تأییدشده" },
];

export const leaveBalances = [
  { empId: 1, entitled: 26, used: 12, remaining: 14 },
  { empId: 2, entitled: 26, used: 18, remaining: 8 },
  { empId: 3, entitled: 26, used: 6, remaining: 20 },
  { empId: 4, entitled: 26, used: 9, remaining: 17 },
  { empId: 5, entitled: 26, used: 21, remaining: 5 },
  { empId: 6, entitled: 26, used: 8, remaining: 18 },
  { empId: 7, entitled: 30, used: 20, remaining: 10 },
  { empId: 8, entitled: 26, used: 11, remaining: 15 },
  { empId: 9, entitled: 26, used: 14, remaining: 12 },
  { empId: 10, entitled: 26, used: 7, remaining: 19 },
];

export type HrLetter = {
  id: string;
  no: string;
  date: string;
  kind: "ابلاغ" | "گواهی اشتغال" | "اخطار" | "تقدیر" | "حکم" | "بازگشت به کار";
  empId: number;
  subject: string;
  size: "A4" | "A5";
  status: "ثبت‌شده" | "پیش‌نویس" | "ارسال‌شده";
};

export const hrLetters: HrLetter[] = [
  { id: "L-501", no: "۱۴۰۵/۲۸۱", date: "۱۴۰۵/۰۸/۲۹", kind: "ابلاغ", empId: 10, subject: "ابلاغ شرح وظایف کارشناس منابع انسانی", size: "A4", status: "ثبت‌شده" },
  { id: "L-502", no: "۱۴۰۵/۲۸۰", date: "۱۴۰۵/۰۸/۲۸", kind: "گواهی اشتغال", empId: 3, subject: "گواهی اشتغال به کار جهت ارائه به بانک", size: "A5", status: "ارسال‌شده" },
  { id: "L-503", no: "۱۴۰۵/۲۷۹", date: "۱۴۰۵/۰۸/۲۷", kind: "تقدیر", empId: 7, subject: "تقدیر از تلاش در افزایش بهره‌وری خط تولید", size: "A4", status: "ثبت‌شده" },
  { id: "L-504", no: "۱۴۰۵/۲۷۸", date: "۱۴۰۵/۰۸/۲۶", kind: "اخطار", empId: 8, subject: "اخطار کتبی تأخیر مکرر", size: "A4", status: "ثبت‌شده" },
  { id: "L-505", no: "۱۴۰۵/۲۷۷", date: "۱۴۰۵/۰۸/۲۴", kind: "حکم", empId: 5, subject: "حکم افزایش حقوق سالانه", size: "A4", status: "پیش‌نویس" },
  { id: "L-506", no: "۱۴۰۵/۲۷۶", date: "۱۴۰۵/۰۸/۲۲", kind: "بازگشت به کار", empId: 4, subject: "ابلاغ بازگشت به کار پس از مرخصی استعلاجی", size: "A5", status: "ثبت‌شده" },
];

export const discipline = [
  { id: "D-31", empId: 7, type: "تشویق", title: "پاداش بهره‌وری", amount: 25_000_000, date: "۱۴۰۵/۰۸/۲۷", by: "مدیرعامل" },
  { id: "D-32", empId: 8, type: "تنبیه", title: "اخطار کتبی تأخیر", amount: 0, date: "۱۴۰۵/۰۸/۲۶", by: "منابع انسانی" },
  { id: "D-33", empId: 2, type: "تشویق", title: "پاداش تحقق فروش", amount: 40_000_000, date: "۱۴۰۵/۰۸/۲۰", by: "مدیر فروش" },
  { id: "D-34", empId: 5, type: "تنبیه", title: "کسر از اضافه‌کاری", amount: 0, date: "۱۴۰۵/۰۸/۱۸", by: "سرپرست تولید" },
  { id: "D-35", empId: 9, type: "تشویق", title: "تقدیر کاهش توقفات", amount: 12_000_000, date: "۱۴۰۵/۰۸/۱۵", by: "سرپرست تولید" },
];

export const hrAlerts = [
  { tone: "warn", title: "۳ تردد بدون خروج", body: "رکوردهای دستگاه ساعت‌زنی امروز ناقص است.", href: "/hr/attendance" },
  { tone: "danger", title: "۲ مرخصی در انتظار تأیید", body: "درخواست‌های مریم صادقی و علی اکبری.", href: "/hr/leaves" },
  { tone: "muted", title: "پایان قرارداد نزدیک", body: "قرارداد مهدی رستمی تا ۱۴۰۵/۰۹/۱۰.", href: "/hr/employees" },
  { tone: "indigo", title: "نامه بدون امضا", body: "حکم افزایش حقوق در وضعیت پیش‌نویس است.", href: "/hr/letters" },
];

export const attendanceTrend = [
  { label: "شنبه", values: [31, 2] },
  { label: "یکشنبه", values: [33, 1] },
  { label: "دوشنبه", values: [32, 2] },
  { label: "سه‌شنبه", values: [30, 3] },
  { label: "چهارشنبه", values: [33, 1] },
  { label: "پنجشنبه", values: [27, 6] },
];
