/* ------------------------------------------------------------------
   منابع انسانی — داده‌های واقعی در دسترس نیست.
   دیتابیس سپیدار (PAY.Personnel) هیچ رکورد پرسنلی ندارد؛ فقط اسناد
   حسابداری حقوق و دستمزد در دفتر کل ثبت شده است (صفحه حقوق و دستمزد).
   همه فهرست‌ها عمداً خالی‌اند تا هیچ داده نمونه‌ای نمایش داده نشود.
   ------------------------------------------------------------------ */

export type Dept = "مالی" | "فروش" | "تولید" | "تأمین" | "منابع انسانی" | "انبار";
export type AttStatus = "حاضر" | "مرخصی" | "ماموریت" | "غایب" | "تأخیر";

export const departments: Array<{ name: Dept; headcount: number; color: string }> = [];

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

export const employees: Employee[] = [];

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

export const attendanceToday: Attendance[] = [];

export const monthSummary: Array<{ empId: number; days: number; overtime: number; delay: number; leave: number; mission: number }> = [];

export const timeclock = {
  device: "—",
  ip: "—",
  connection: "بدون دستگاه",
  lastSync: "—",
  recordsToday: 0,
  unmatched: 0,
  firmware: "—",
  bridge: "—",
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

export const leaves: Leave[] = [];

export const leaveBalances: Array<{ empId: number; entitled: number; used: number; remaining: number }> = [];

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

export const hrLetters: HrLetter[] = [];

export const discipline: Array<{ id: string; empId: number; type: string; title: string; amount: number; date: string; by: string }> = [];

export const hrAlerts: Array<{ tone: string; title: string; body: string; href: string }> = [];

export const attendanceTrend: Array<{ label: string; values: number[] }> = [];
