/* Sales, Production & Procurement demo data (Toman) */

export const customers = [
  { name: "شرکت پخش آرمان", city: "تهران", balance: 1_240_000_000, credit: 2_000_000_000, last: "۱۴۰۵/۰۸/۲۷", rep: "رضا کریمی", status: "فعال" },
  { name: "بازرگانی نیک‌رو", city: "کرج", balance: 680_000_000, credit: 1_000_000_000, last: "۱۴۰۵/۰۸/۲۵", rep: "مریم صادقی", status: "فعال" },
  { name: "گروه صنعتی پارس‌فولاد", city: "اصفهان", balance: 2_450_000_000, credit: 3_500_000_000, last: "۱۴۰۵/۰۸/۲۱", rep: "رضا کریمی", status: "فعال" },
  { name: "تجهیزات پزشکی مهر", city: "شیراز", balance: 0, credit: 800_000_000, last: "۱۴۰۵/۰۷/۱۵", rep: "مریم صادقی", status: "غیرفعال" },
  { name: "ساختمانی آبان", city: "تبریز", balance: 320_000_000, credit: 500_000_000, last: "۱۴۰۵/۰۸/۱۸", rep: "مریم صادقی", status: "فعال" },
];

export const salesInvoices = [
  { no: "INV-1405-8812", customer: "شرکت پخش آرمان", date: "۱۴۰۵/۰۸/۲۷", amount: 482_000_000, status: "ثبت‌شده", due: "۱۴۰۵/۰۹/۲۷" },
  { no: "INV-1405-8811", customer: "پارس‌فولاد", date: "۱۴۰۵/۰۸/۲۱", amount: 1_150_000_000, status: "ثبت‌شده", due: "۱۴۰۵/۰۹/۲۱" },
  { no: "INV-1405-8810", customer: "بازرگانی نیک‌رو", date: "۱۴۰۵/۰۸/۲۵", amount: 285_000_000, status: "در انتظار", due: "۱۴۰۵/۰۹/۲۵" },
  { no: "INV-1405-8809", customer: "ساختمانی آبان", date: "۱۴۰۵/۰۸/۱۸", amount: 320_000_000, status: "ثبت‌شده", due: "۱۴۰۵/۰۹/۱۸" },
  { no: "INV-1405-8808", customer: "تجهیزات پزشکی مهر", date: "۱۴۰۵/۰۷/۱۵", amount: 96_000_000, status: "سرسید", due: "۱۴۰۵/۰۸/۱۵" },
];

export const aging = [
  { bucket: "جاری", amount: 1_180_000_000, color: "#2FE0BE" },
  { bucket: "۱–۳۰ روز", amount: 640_000_000, color: "#7BE495" },
  { bucket: "۳۱–۶۰ روز", amount: 285_000_000, color: "#F7B955" },
  { bucket: "بیش از ۶۰ روز", amount: 96_000_000, color: "#FF6B81" },
];

export const commission = [
  { rep: "رضا کریمی", target: 4_000_000_000, sold: 3_920_000_000, rate: 1.2 },
  { rep: "مریم صادقی", target: 2_500_000_000, sold: 2_340_000_000, rate: 1.2 },
  { rep: "سعید نادری", target: 1_800_000_000, sold: 1_050_000_000, rate: 1.0 },
];

export const productionOrders = [
  { no: "PR-1405-118", product: "پنل ایستاده مدل A", qty: 300, done: 246, line: "خط ۱", due: "۱۴۰۵/۰۹/۰۵", status: "در جریان" },
  { no: "PR-1405-117", product: "باکس کنترل هوشمند", qty: 80, done: 62, line: "خط ۲", due: "۱۴۰۵/۰۹/۰۳", status: "در جریان" },
  { no: "PR-1405-116", product: "پنل دیواری مدل B", qty: 150, done: 150, line: "خط ۱", due: "۱۴۰۵/۰۸/۲۶", status: "تکمیل" },
  { no: "PR-1405-115", product: "پنل ایستاده مدل A", qty: 120, done: 108, line: "خط ۱", due: "۱۴۰۵/۰۸/۲۴", status: "تأخیر" },
  { no: "PR-1405-114", product: "قاب فلزی سفارشی", qty: 60, done: 12, line: "خط ۳", due: "۱۴۰۵/۰۹/۱۰", status: "در جریان" },
];

export const quality = [
  { item: "پنل ایستاده مدل A", inspected: 246, defect: 7, rate: 97.2, cause: "رنگ‌پاشی" },
  { item: "باکس کنترل هوشمند", inspected: 62, defect: 4, rate: 93.5, cause: "مونتاژ برد" },
  { item: "پنل دیواری مدل B", inspected: 150, defect: 2, rate: 98.7, cause: "بسته‌بندی" },
  { item: "قاب فلزی سفارشی", inspected: 12, defect: 1, rate: 91.7, cause: "برش" },
];

export const downtime = [
  { reason: "خرابی دستگاه پرس", minutes: 145, share: 38, line: "خط ۱" },
  { reason: "کمبود مواد اولیه", minutes: 98, share: 26, line: "خط ۲" },
  { reason: "تعویض قالب", minutes: 72, share: 19, line: "خط ۱" },
  { reason: "قطعی برق", minutes: 40, share: 11, line: "همه خطوط" },
  { reason: "سایر", minutes: 23, share: 6, line: "—" },
];

export const productionTrend = [
  { label: "شنبه", values: [610] },
  { label: "یکشنبه", values: [680] },
  { label: "دوشنبه", values: [640] },
  { label: "سه‌شنبه", values: [720] },
  { label: "چهارشنبه", values: [690] },
  { label: "پنجشنبه", values: [520] },
];

export const suppliers = [
  { name: "فولاد مبارکه", category: "ورق", rating: 4.8, onTime: 96, balance: 1_250_000_000, status: "فعال" },
  { name: "آلومینیوم اراک", category: "پروفیل", rating: 4.5, onTime: 92, balance: 620_000_000, status: "فعال" },
  { name: "رنگ‌سازان پارس", category: "رنگ پودری", rating: 4.1, onTime: 85, balance: 180_000_000, status: "فعال" },
  { name: "بازرگانی قطعات شرق", category: "قطعات", rating: 3.4, onTime: 71, balance: 0, status: "نیازمند بازبینی" },
  { name: "پلاستیک نیک‌پور", category: "نوار و بسته‌بندی", rating: 4.6, onTime: 94, balance: 95_000_000, status: "فعال" },
];

export const purchaseRequests = [
  { no: "PR-901", item: "ورق گالوانیزه ۰٫۵", qty: "۳٬۲۰۰ کیلوگرم", requester: "مهدی رستمی", date: "۱۴۰۵/۰۸/۲۸", status: "در انتظار تأیید" },
  { no: "PR-902", item: "پروفیل آلومینیوم ۴۰×۴۰", qty: "۴۰۰ شاخه", requester: "حسین مرادی", date: "۱۴۰۵/۰۸/۲۷", status: "تأییدشده" },
  { no: "PR-903", item: "رنگ پودری RAL 9016", qty: "۲۵۰ کیلوگرم", requester: "حسین مرادی", date: "۱۴۰۵/۰۸/۲۷", status: "در انتظار تأیید" },
  { no: "PR-904", item: "باکس کنترل هوشمند", qty: "۶۰ عدد", requester: "رضا کریمی", date: "۱۴۰۵/۰۸/۲۶", status: "تأییدشده" },
  { no: "PR-905", item: "پیچ و مهره استیل", qty: "۱٬۰۰۰ بسته", requester: "مهدی رستمی", date: "۱۴۰۵/۰۸/۲۵", status: "ردشده" },
];

export const purchaseOrders = [
  { no: "PO-5401", supplier: "فولاد مبارکه", date: "۱۴۰۵/۰۸/۲۵", amount: 2_496_000_000, delivery: "۱۴۰۵/۰۹/۰۲", status: "در راه" },
  { no: "PO-5402", supplier: "آلومینیوم اراک", date: "۱۴۰۵/۰۸/۲۴", amount: 840_000_000, delivery: "۱۴۰۵/۰۹/۰۱", status: "تأییدشده" },
  { no: "PO-5403", supplier: "رنگ‌سازان پارس", date: "۱۴۰۵/۰۸/۲۰", amount: 737_500_000, delivery: "۱۴۰۵/۰۸/۲۸", status: "دریافت‌شده" },
  { no: "PO-5404", supplier: "بازرگانی قطعات شرق", date: "۱۴۰۵/۰۸/۱۸", amount: 312_000_000, delivery: "۱۴۰۵/۰۸/۳۰", status: "تأخیر" },
];

export const receipts = [
  { no: "GRN-771", po: "PO-5403", supplier: "رنگ‌سازان پارس", date: "۱۴۰۵/۰۸/۲۸", items: 1, status: "کنترل کیفی" },
  { no: "GRN-770", po: "PO-5398", supplier: "فولاد مبارکه", date: "۱۴۰۵/۰۸/۲۶", items: 2, status: "انبار شده" },
  { no: "GRN-769", po: "PO-5395", supplier: "پلاستیک نیک‌پور", date: "۱۴۰۵/۰۸/۲۴", items: 3, status: "انبار شده" },
];
