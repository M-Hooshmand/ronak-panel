/* ------------------------------------------------------------------
   Management data — real figures extracted from the Sepidar ledger
   (fiscal year ۱۴۰۴ vs ۱۴۰۳). All amounts are TOMAN unless noted.
   ------------------------------------------------------------------ */

export type CheckStatus = "وصول‌شده" | "در جریان" | "سرسید" | "برگشتی";

export const cashAccounts = [
  { name: "صادرات ۰۱۱۱۵۹۹۱۷۶۰۰۸", kind: "بانک", balance: 5600915833, change: 94.9, last: "۱۴۰۴/۱۲/۲۹" },
  { name: "سپه تهران ۳۱۰۱۰۷۱۴۸۰۲۰۵", kind: "بانک", balance: 224631968, change: 3.8, last: "۱۴۰۴/۱۲/۲۹" },
  { name: "بانك ايران زمين - ۱۲۲۰۱۱۱۰۲۸۷۸۱۱", kind: "بانک", balance: 76517244, change: 1.3, last: "۱۴۰۴/۱۲/۲۹" },
  { name: "اقتصاد نوين ۱۶۰۲۸۵۰۵۶۲۴۳۶۱۱", kind: "بانک", balance: 436472, change: 0.0, last: "۱۴۰۴/۱۲/۲۹" },
  { name: "بانك ايران زمين شعبه گلشهر ۱۲۲۰۸۴۰۰۱۰۲۸۷۸۱۰۰۱", kind: "بانک", balance: 10123, change: 0.0, last: "۱۴۰۴/۱۲/۲۹" },
  { name: "اقتصاد نوين ۱۶۰۲۲۵۶۲۴۳۶۱۰", kind: "بانک", balance: 57893, change: 0.0, last: "۱۴۰۴/۱۲/۲۹" },
];

export const totalCash = cashAccounts.reduce((s, a) => s + a.balance, 0);

export const checks = [
  { id: "۱", dir: "دریافتی", party: "آراد صنعت پروفيل هيركان", bank: "ملي", amount: 30000000, due: "۱۴۰۴/۰۱/۲۰", status: "در جریان" as CheckStatus, days: -339 },
  { id: "۲", dir: "دریافتی", party: "آلتين پليمر ايرانيان", bank: "ملي", amount: 30000000, due: "۱۴۰۴/۰۱/۲۵", status: "در جریان" as CheckStatus, days: -334 },
  { id: "۳", dir: "دریافتی", party: "توليدي ويستا بست", bank: "ملي", amount: 250000000, due: "۱۴۰۴/۰۲/۳۰", status: "در جریان" as CheckStatus, days: -299 },
  { id: "۴", dir: "دریافتی", party: "توليدي ويستا بست", bank: "ملي", amount: 200000000, due: "۱۴۰۴/۰۲/۳۱", status: "در جریان" as CheckStatus, days: -298 },
  { id: "۵", dir: "دریافتی", party: "توليدي ويستا بست", bank: "ملي", amount: 450000000, due: "۱۴۰۴/۰۲/۳۱", status: "در جریان" as CheckStatus, days: -298 },
  { id: "۶", dir: "دریافتی", party: "دارما بسپار نگار ويرا", bank: "ملي", amount: 300000000, due: "۱۴۰۴/۰۳/۰۷", status: "در جریان" as CheckStatus, days: -292 },
  { id: "۷", dir: "دریافتی", party: "دارما بسپار نگار ويرا", bank: "ملي", amount: 300000000, due: "۱۴۰۴/۰۳/۱۲", status: "در جریان" as CheckStatus, days: -287 },
  { id: "۸", dir: "دریافتی", party: "صنايع فناور پلاستيك سپاهان", bank: "ملي", amount: 371256214, due: "۱۴۰۴/۰۴/۰۷", status: "در جریان" as CheckStatus, days: -262 },
  { id: "۹", dir: "دریافتی", party: "جهان پروفيل آذربايجان", bank: "ملي", amount: 163796225, due: "۱۴۰۴/۰۴/۱۰", status: "در جریان" as CheckStatus, days: -259 },
  { id: "۱۰", dir: "دریافتی", party: "ارتا پروفيل پيشرو صنعت جهان", bank: "ملي", amount: 216000000, due: "۱۴۰۴/۰۴/۱۶", status: "در جریان" as CheckStatus, days: -253 },
  { id: "۱۱", dir: "دریافتی", party: "آلتون تجارت ميلاد نو", bank: "ملي", amount: 60000000, due: "۱۴۰۴/۰۴/۲۰", status: "در جریان" as CheckStatus, days: -249 },
  { id: "۱۲", dir: "دریافتی", party: "تك نما پي وي سي سپاهان", bank: "ملي", amount: 96000000, due: "۱۴۰۴/۰۴/۲۷", status: "در جریان" as CheckStatus, days: -242 },
  { id: "۱۳", dir: "دریافتی", party: "جهان پروفيل پادير", bank: "ملي", amount: 266000000, due: "۱۴۰۴/۰۴/۲۸", status: "در جریان" as CheckStatus, days: -241 },
  { id: "۱۴", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 100000000, due: "۱۴۰۴/۰۵/۰۱", status: "در جریان" as CheckStatus, days: -238 },
  { id: "۱۵", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 20000000, due: "۱۴۰۴/۰۵/۰۵", status: "در جریان" as CheckStatus, days: -234 },
  { id: "۱۶", dir: "دریافتی", party: "مهرداد", bank: "ملي", amount: 66000000, due: "۱۴۰۴/۰۵/۰۵", status: "در جریان" as CheckStatus, days: -234 },
  { id: "۱۷", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 20000000, due: "۱۴۰۴/۰۵/۱۰", status: "در جریان" as CheckStatus, days: -229 },
  { id: "۱۸", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 90000000, due: "۱۴۰۴/۰۵/۱۰", status: "در جریان" as CheckStatus, days: -229 },
  { id: "۱۹", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 29000000, due: "۱۴۰۴/۰۵/۱۰", status: "در جریان" as CheckStatus, days: -229 },
  { id: "۲۰", dir: "دریافتی", party: "آلتون تجارت ميلاد نو", bank: "ملي", amount: 40000000, due: "۱۴۰۴/۰۵/۱۵", status: "در جریان" as CheckStatus, days: -224 },
  { id: "۲۱", dir: "دریافتی", party: "آلتون تجارت ميلاد نو", bank: "ملي", amount: 10000000, due: "۱۴۰۴/۰۵/۱۵", status: "در جریان" as CheckStatus, days: -224 },
  { id: "۲۲", dir: "دریافتی", party: "آق پروفيل گلستان", bank: "ملي", amount: 120000000, due: "۱۴۰۴/۰۵/۱۶", status: "در جریان" as CheckStatus, days: -223 },
  { id: "۲۳", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 15000000, due: "۱۴۰۴/۰۵/۲۰", status: "در جریان" as CheckStatus, days: -219 },
  { id: "۲۴", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 75000000, due: "۱۴۰۴/۰۵/۲۱", status: "در جریان" as CheckStatus, days: -218 },
  { id: "۲۵", dir: "دریافتی", party: "آق پروفيل گلستان", bank: "ملي", amount: 94800000, due: "۱۴۰۴/۰۵/۲۱", status: "در جریان" as CheckStatus, days: -218 },
  { id: "۲۶", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 26500000, due: "۱۴۰۴/۰۵/۲۲", status: "در جریان" as CheckStatus, days: -217 },
  { id: "۲۷", dir: "دریافتی", party: "آلتون تجارت ميلاد نو", bank: "ملي", amount: 80000000, due: "۱۴۰۴/۰۵/۲۲", status: "در جریان" as CheckStatus, days: -217 },
  { id: "۲۸", dir: "دریافتی", party: "آلتون تجارت ميلاد نو", bank: "ملي", amount: 30000000, due: "۱۴۰۴/۰۵/۳۰", status: "در جریان" as CheckStatus, days: -209 },
  { id: "۲۹", dir: "دریافتی", party: "آلتون تجارت ميلاد نو", bank: "ملي", amount: 20000000, due: "۱۴۰۴/۰۵/۳۰", status: "در جریان" as CheckStatus, days: -209 },
  { id: "۳۰", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 10000000, due: "۱۴۰۴/۰۵/۳۰", status: "در جریان" as CheckStatus, days: -209 },
  { id: "۳۱", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 150000000, due: "۱۴۰۴/۰۶/۲۵", status: "در جریان" as CheckStatus, days: -184 },
  { id: "۳۲", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 250000000, due: "۱۴۰۴/۰۷/۰۱", status: "در جریان" as CheckStatus, days: -178 },
  { id: "۳۳", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 48700000, due: "۱۴۰۴/۰۷/۰۵", status: "در جریان" as CheckStatus, days: -174 },
  { id: "۳۴", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 50000000, due: "۱۴۰۴/۰۷/۱۰", status: "در جریان" as CheckStatus, days: -169 },
  { id: "۳۵", dir: "دریافتی", party: "صنعتگران نادر پرگاس", bank: "ملي", amount: 264604168, due: "۱۴۰۴/۰۷/۱۰", status: "در جریان" as CheckStatus, days: -169 },
  { id: "۳۶", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 250000000, due: "۱۴۰۴/۰۷/۲۸", status: "در جریان" as CheckStatus, days: -151 },
  { id: "۳۷", dir: "دریافتی", party: "توليدي درب و پنجره كيان پن", bank: "ملي", amount: 33000000, due: "۱۴۰۴/۰۷/۳۰", status: "در جریان" as CheckStatus, days: -149 },
  { id: "۳۸", dir: "دریافتی", party: "مهرداد", bank: "ملي", amount: 110000000, due: "۱۴۰۴/۰۷/۳۰", status: "در جریان" as CheckStatus, days: -149 },
  { id: "۳۹", dir: "دریافتی", party: "دارما بسپار نگار ويرا", bank: "ملي", amount: 415018600, due: "۱۴۰۴/۰۸/۰۵", status: "در جریان" as CheckStatus, days: -144 },
  { id: "۴۰", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 82000000, due: "۱۴۰۴/۰۸/۱۰", status: "در جریان" as CheckStatus, days: -139 },
  { id: "۴۱", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 10000000, due: "۱۴۰۴/۰۸/۱۲", status: "در جریان" as CheckStatus, days: -137 },
  { id: "۴۲", dir: "دریافتی", party: "توليدي درب و پنجره كيان پن", bank: "ملي", amount: 76000000, due: "۱۴۰۴/۰۸/۱۵", status: "در جریان" as CheckStatus, days: -134 },
  { id: "۴۳", dir: "دریافتی", party: "توليدي درب و پنجره كيان پن", bank: "ملي", amount: 50000000, due: "۱۴۰۴/۰۸/۲۰", status: "در جریان" as CheckStatus, days: -129 },
  { id: "۴۴", dir: "دریافتی", party: "آسيا جام پروفيل", bank: "ملي", amount: 150000000, due: "۱۴۰۴/۰۸/۲۵", status: "در جریان" as CheckStatus, days: -124 },
  { id: "۴۵", dir: "دریافتی", party: "پنجره آريا", bank: "ملي", amount: 574618960, due: "۱۴۰۴/۰۸/۲۵", status: "در جریان" as CheckStatus, days: -124 },
  { id: "۴۶", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 30000000, due: "۱۴۰۴/۰۸/۳۰", status: "در جریان" as CheckStatus, days: -119 },
  { id: "۴۷", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 10000000, due: "۱۴۰۴/۰۹/۱۲", status: "در جریان" as CheckStatus, days: -107 },
  { id: "۴۸", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 12500000, due: "۱۴۰۴/۰۹/۲۰", status: "در جریان" as CheckStatus, days: -99 },
  { id: "۴۹", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 134000000, due: "۱۴۰۴/۰۹/۲۵", status: "در جریان" as CheckStatus, days: -94 },
  { id: "۵۰", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 55000000, due: "۱۴۰۴/۰۹/۳۰", status: "در جریان" as CheckStatus, days: -89 },
  { id: "۵۱", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 75000000, due: "۱۴۰۴/۰۹/۳۰", status: "در جریان" as CheckStatus, days: -89 },
  { id: "۵۲", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 100000000, due: "۱۴۰۴/۰۹/۳۰", status: "در جریان" as CheckStatus, days: -89 },
  { id: "۵۳", dir: "دریافتی", party: "جهان پروفيل پادير", bank: "ملي", amount: 120000000, due: "۱۴۰۴/۱۰/۰۷", status: "در جریان" as CheckStatus, days: -82 },
  { id: "۵۴", dir: "دریافتی", party: "توليدي درب و پنجره كيان پن", bank: "ملي", amount: 23000000, due: "۱۴۰۴/۱۰/۱۰", status: "در جریان" as CheckStatus, days: -79 },
  { id: "۵۵", dir: "دریافتی", party: "توليدي درب و پنجره كيان پن", bank: "ملي", amount: 20000000, due: "۱۴۰۴/۱۰/۱۰", status: "در جریان" as CheckStatus, days: -79 },
  { id: "۵۶", dir: "دریافتی", party: "توليدي درب و پنجره كيان پن", bank: "ملي", amount: 8000000, due: "۱۴۰۴/۱۰/۱۵", status: "در جریان" as CheckStatus, days: -74 },
  { id: "۵۷", dir: "دریافتی", party: "خاوران شيمي پارس تك", bank: "ملي", amount: 60800000, due: "۱۴۰۴/۱۰/۱۵", status: "در جریان" as CheckStatus, days: -74 },
  { id: "۵۸", dir: "دریافتی", party: "خاوران شيمي پارس تك", bank: "ملي", amount: 83343750, due: "۱۴۰۴/۱۰/۱۹", status: "در جریان" as CheckStatus, days: -70 },
  { id: "۵۹", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 100000000, due: "۱۴۰۴/۱۰/۲۰", status: "در جریان" as CheckStatus, days: -69 },
  { id: "۶۰", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 200000000, due: "۱۴۰۴/۱۰/۲۰", status: "در جریان" as CheckStatus, days: -69 },
  { id: "۶۱", dir: "دریافتی", party: "دارما بسپار نگار ويرا", bank: "ملي", amount: 300000000, due: "۱۴۰۴/۱۰/۲۰", status: "در جریان" as CheckStatus, days: -69 },
  { id: "۶۲", dir: "دریافتی", party: "دارما بسپار نگار ويرا", bank: "ملي", amount: 285000000, due: "۱۴۰۴/۱۰/۲۵", status: "در جریان" as CheckStatus, days: -64 },
  { id: "۶۳", dir: "دریافتی", party: "آق پروفيل گلستان", bank: "ملي", amount: 140000000, due: "۱۴۰۴/۱۰/۲۶", status: "در جریان" as CheckStatus, days: -63 },
  { id: "۶۴", dir: "دریافتی", party: "توليدي درب و پنجره كيان پن", bank: "ملي", amount: 50000000, due: "۱۴۰۴/۱۰/۲۸", status: "در جریان" as CheckStatus, days: -61 },
  { id: "۶۵", dir: "دریافتی", party: "توليدي درب و پنجره كيان پن", bank: "ملي", amount: 50000000, due: "۱۴۰۴/۱۰/۳۰", status: "در جریان" as CheckStatus, days: -59 },
  { id: "۶۶", dir: "دریافتی", party: "توليدي درب و پنجره كيان پن", bank: "ملي", amount: 60000000, due: "۱۴۰۴/۱۰/۳۰", status: "در جریان" as CheckStatus, days: -59 },
  { id: "۶۷", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 300000000, due: "۱۴۰۴/۱۰/۳۰", status: "در جریان" as CheckStatus, days: -59 },
  { id: "۶۸", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 185000000, due: "۱۴۰۴/۱۰/۳۰", status: "در جریان" as CheckStatus, days: -59 },
  { id: "۶۹", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 179980000, due: "۱۴۰۴/۱۰/۳۰", status: "در جریان" as CheckStatus, days: -59 },
  { id: "۷۰", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 75000000, due: "۱۴۰۴/۱۰/۳۰", status: "در جریان" as CheckStatus, days: -59 },
  { id: "۷۱", dir: "دریافتی", party: "خاوران شيمي پارس تك", bank: "ملي", amount: 29144995, due: "۱۴۰۴/۱۰/۳۰", status: "در جریان" as CheckStatus, days: -59 },
  { id: "۷۲", dir: "دریافتی", party: "آق پروفيل گلستان", bank: "ملي", amount: 140000000, due: "۱۴۰۴/۱۱/۰۲", status: "در جریان" as CheckStatus, days: -57 },
  { id: "۷۳", dir: "دریافتی", party: "پنجره آريا", bank: "ملي", amount: 547213490, due: "۱۴۰۴/۱۱/۰۵", status: "در جریان" as CheckStatus, days: -54 },
  { id: "۷۴", dir: "دریافتی", party: "دارما بسپار نگار ويرا", bank: "ملي", amount: 360000000, due: "۱۴۰۴/۱۱/۰۵", status: "در جریان" as CheckStatus, days: -54 },
  { id: "۷۵", dir: "دریافتی", party: "آسيا جام پروفيل", bank: "ملي", amount: 300000000, due: "۱۴۰۴/۱۱/۰۸", status: "در جریان" as CheckStatus, days: -51 },
  { id: "۷۶", dir: "دریافتی", party: "آق پروفيل گلستان", bank: "ملي", amount: 140000000, due: "۱۴۰۴/۱۱/۱۱", status: "در جریان" as CheckStatus, days: -48 },
  { id: "۷۷", dir: "دریافتی", party: "طلا پروفيل ارس", bank: "ملي", amount: 1100000000, due: "۱۴۰۴/۱۱/۱۴", status: "در جریان" as CheckStatus, days: -45 },
  { id: "۷۸", dir: "دریافتی", party: "خاوران شيمي پارس تك", bank: "ملي", amount: 150000000, due: "۱۴۰۴/۱۱/۱۵", status: "در جریان" as CheckStatus, days: -44 },
  { id: "۷۹", dir: "دریافتی", party: "خاوران شيمي پارس تك", bank: "ملي", amount: 83343750, due: "۱۴۰۴/۱۱/۱۹", status: "در جریان" as CheckStatus, days: -40 },
  { id: "۸۰", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 100000000, due: "۱۴۰۴/۱۱/۲۱", status: "در جریان" as CheckStatus, days: -38 },
  { id: "۸۱", dir: "دریافتی", party: "توليدي درب و پنجره كيان پن", bank: "ملي", amount: 200000000, due: "۱۴۰۴/۱۱/۲۵", status: "در جریان" as CheckStatus, days: -34 },
  { id: "۸۲", dir: "دریافتی", party: "آق پروفيل گلستان", bank: "ملي", amount: 140000000, due: "۱۴۰۴/۱۱/۲۶", status: "در جریان" as CheckStatus, days: -33 },
  { id: "۸۳", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 100000000, due: "۱۴۰۴/۱۱/۳۰", status: "در جریان" as CheckStatus, days: -29 },
  { id: "۸۴", dir: "دریافتی", party: "صنايع سنگ شير پارس", bank: "ملي", amount: 100000000, due: "۱۴۰۴/۱۱/۳۰", status: "در جریان" as CheckStatus, days: -29 },
  { id: "۸۵", dir: "دریافتی", party: "پنجره آريا", bank: "ملي", amount: 305004700, due: "۱۴۰۴/۱۱/۳۰", status: "در جریان" as CheckStatus, days: -29 },
  { id: "۸۶", dir: "دریافتی", party: "آق پروفيل گلستان", bank: "ملي", amount: 140000000, due: "۱۴۰۴/۱۲/۰۲", status: "در جریان" as CheckStatus, days: -27 },
  { id: "۸۷", dir: "دریافتی", party: "خاوران شيمي پارس تك", bank: "ملي", amount: 150000000, due: "۱۴۰۴/۱۲/۱۵", status: "در جریان" as CheckStatus, days: -14 },
  { id: "۸۸", dir: "دریافتی", party: "آق پروفيل گلستان", bank: "ملي", amount: 129575560, due: "۱۴۰۴/۱۲/۱۶", status: "در جریان" as CheckStatus, days: -13 },
  { id: "۸۹", dir: "دریافتی", party: "آبايان پليمر صنعت جنوب پارس", bank: "ملي", amount: 220000000, due: "۱۴۰۴/۱۲/۲۴", status: "در جریان" as CheckStatus, days: -5 },
  { id: "۹۰", dir: "دریافتی", party: "پنجره آريا", bank: "ملي", amount: 600000000, due: "۱۴۰۴/۱۲/۲۵", status: "در جریان" as CheckStatus, days: -4 },
  { id: "۹۱", dir: "دریافتی", party: "آبايان پليمر صنعت جنوب پارس", bank: "ملي", amount: 220100000, due: "۱۴۰۴/۱۲/۲۷", status: "در جریان" as CheckStatus, days: -2 },
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
4655953307, 1392352794, 3351315364, 6308160941, 10846051328, 924179549, 1681579188, 630888010, 581135630, 2426895241, 3402638765, 5902569534
].map((v, i) => ({ label: String(i + 1), values: [v] }));

export const inventory = [
  { sku: "70100", name: "لفاف", unit: "كيلوگرم", qty: 2606933, reorder: 56, price: 2400, turnover: 0.0 },
  { sku: "40005", name: "فيلم پلي اتيلن", unit: "كيلوگرم", qty: 1116448, reorder: 68, price: 2900, turnover: 0.0 },
  { sku: "70010", name: "ليبل", unit: "كيلوگرم", qty: 448706, reorder: 337, price: 3600, turnover: 0.0 },
  { sku: "70200", name: "فيلم", unit: "كيلوگرم", qty: 46508, reorder: 0, price: 6810, turnover: 0 },
  { sku: "40011", name: "paytex-nl15 ps", unit: "كيلوگرم", qty: 100640, reorder: 0, price: 2200, turnover: 0 },
  { sku: "40015", name: "لوله مقواي", unit: "كيلوگرم", qty: 144566, reorder: 0, price: 1500, turnover: 0 },
  { sku: "70102", name: "رزين", unit: "كيلوگرم", qty: 70710, reorder: 0, price: 2600, turnover: 0 },
  { sku: "40001", name: "نايلون", unit: "كيلوگرم", qty: 410587, reorder: 0, price: 400, turnover: 0 },
  { sku: "40014", name: "كارتن", unit: "عدد", qty: 72854, reorder: 0, price: 1500, turnover: 0 },
  { sku: "40012", name: "paytex-nl60sb", unit: "كيلوگرم", qty: 62820, reorder: 0, price: 1600, turnover: 0 },
  { sku: "703004", name: "محلول كاربرد تعليق شكن", unit: "كيلوگرم", qty: 15540, reorder: 0, price: 6210, turnover: 0 },
  { sku: "703002", name: "TMUL-9045", unit: "كيلوگرم", qty: 2003, reorder: 0, price: 32040, turnover: 0 },
  { sku: "70104", name: "PAYTEX-PS120", unit: "كيلوگرم", qty: 27230, reorder: 0, price: 1100, turnover: 0 },
  { sku: "70105", name: "OP1006PPI/A", unit: "كيلوگرم", qty: 1590, reorder: 0, price: 15220, turnover: 0 },
  { sku: "40004", name: "سيلندر 281/03", unit: "عدد", qty: 10, reorder: 0, price: 1014360, turnover: 0 },
  { sku: "70101", name: "چسپ", unit: "كيلوگرم", qty: 17595, reorder: 0, price: 400, turnover: 0 },
  { sku: "70107", name: "اورپرينت", unit: "كيلوگرم", qty: 1033, reorder: 0, price: 5710, turnover: 0 },
  { sku: "40013", name: "PS-110", unit: "كيلوگرم", qty: 4000, reorder: 0, price: 1000, turnover: 0 },
  { sku: "70300", name: "اسپانلس پلي استر", unit: "كيلوگرم", qty: 440, reorder: 0, price: 5010, turnover: 0 },
  { sku: "70106", name: "OP1006PPI/B", unit: "كيلوگرم", qty: 96, reorder: 0, price: 15220, turnover: 0 },
  { sku: "703003", name: "آمونياك 25%", unit: "ليتر", qty: 1320, reorder: 0, price: 300, turnover: 0 },
  { sku: "703005", name: "پودر سديم", unit: "كيلوگرم", qty: 150, reorder: 0, price: 1800, turnover: 0 },
  { sku: "70021", name: "كليشه", unit: "ست", qty: 1, reorder: 6, price: 193620, turnover: 72.0 },
  { sku: "703001", name: "هيدرو كربن رزين", unit: "كيلوگرم", qty: 100, reorder: 0, price: 1600, turnover: 0 },
  { sku: "40007", name: "كت وين", unit: "كيلوگرم", qty: 3384, reorder: 0, price: 10, turnover: 0 },
  { sku: "70001", name: "نيووين", unit: "كيلوگرم", qty: 2394, reorder: 0, price: 10, turnover: 0 },
  { sku: "40009", name: "سوپر وين", unit: "كيلوگرم", qty: 2064, reorder: 0, price: 10, turnover: 0 },
  { sku: "40008", name: "دكتر وين", unit: "كيلوگرم", qty: 981, reorder: 0, price: 10, turnover: 0 },
  { sku: "40006", name: "sing board", unit: "كيلوگرم", qty: 890, reorder: 0, price: 10, turnover: 0 },
  { sku: "70103", name: "گالن", unit: "عدد", qty: 1, reorder: 0, price: 3000, turnover: 0 },
  { sku: "30001", name: "فيلم محافظ", unit: "متر مربع", qty: -6288649, reorder: 2264281, price: 10, turnover: 0 },
  { sku: "50001", name: "سيلندر", unit: "عدد", qty: 0, reorder: 0, price: 103320, turnover: 0 },
  { sku: "50002", name: "نرم افزار", unit: "عدد", qty: 0, reorder: 0, price: 10, turnover: 0 },
  { sku: "50003", name: "حكاكي", unit: "عدد", qty: 0, reorder: 0, price: 74890, turnover: 0 },
  { sku: "50005", name: "طرح بلوند", unit: "كيلوگرم", qty: 0, reorder: 0, price: 800, turnover: 0 },
  { sku: "70020", name: "نوار محافظ", unit: "متر مربع", qty: -1051468, reorder: 320164, price: 10, turnover: 0 },
  { sku: "9090", name: "ثبت كارت بازرگاني", unit: "عدد", qty: 0, reorder: 0, price: 10, turnover: 0 },
  { sku: "9091", name: "شارژ صنعتي", unit: "متر مربع", qty: 0, reorder: 0, price: 200, turnover: 0 },
  { sku: "30002", name: "فيلم محافظ كيلوي", unit: "كيلوگرم", qty: -149399, reorder: 33890, price: 36740, turnover: 0 },
  { sku: "70019", name: "نوار محافظ كيلويي", unit: "كيلوگرم", qty: -13317, reorder: 1225, price: 10, turnover: 0 },
  { sku: "1", name: "حسابرسي", unit: "عدد", qty: 0, reorder: 0, price: 4738020, turnover: 0 },
  { sku: "2", name: "حمل", unit: "عدد", qty: 0, reorder: 0, price: 45350, turnover: 0 },
  { sku: "5", name: "آزمايشگاه", unit: "عدد", qty: 0, reorder: 0, price: 33740, turnover: 0 },
  { sku: "11", name: "بيمه", unit: "عدد", qty: 0, reorder: 0, price: 539420, turnover: 0 },
  { sku: "12", name: "پشتيباني نرم افزار", unit: "عدد", qty: 0, reorder: 0, price: 55860, turnover: 0 },
];

export const inventoryValue = inventory.reduce((s, i) => s + Math.max(i.qty, 0) * i.price, 0);
export const belowReorder = inventory.filter((i) => i.reorder > 0 && i.qty < i.reorder);

export const fixedAssets = [
  { name: "زمين", cat: "املاک", cost: 7871701236, accum: 0, date: "۱۴۰۴/۰۱/۰۱", rate: 0 },
  { name: "ساختمانها", cat: "املاک", cost: 7102878378, accum: 0, date: "۱۴۰۴/۰۱/۰۱", rate: 7 },
  { name: "تاسيسات", cat: "تاسیسات", cost: 1010000000, accum: 0, date: "۱۴۰۴/۰۱/۰۱", rate: 7 },
  { name: "ماشين آلات و تجهيزات توليد", cat: "ماشین‌آلات", cost: 4979543830, accum: 45167876, date: "۱۴۰۴/۰۱/۰۱", rate: 10 },
  { name: "اثاثيه ومنصوبات", cat: "تجهیزات", cost: 227208800, accum: 0, date: "۱۴۰۴/۰۱/۰۱", rate: 15 },
  { name: "دارائي نامشهود", cat: "دارایی نامشهود", cost: 9045000, accum: 0, date: "۱۴۰۴/۰۱/۰۱", rate: 15 },
];

export const assetsCost = fixedAssets.reduce((s, a) => s + a.cost, 0);
export const assetsBook = fixedAssets.reduce((s, a) => s + (a.cost - a.accum), 0);

export const pnl = [
  { label: "درآمد فروش", cur: 75426553097, prev: 69087698829, level: 0 },
  { label: "برگشت از فروش و تخفیفات", cur: -305714600, prev: -213758380, level: 0, neg: true },
  { label: "فروش خالص", cur: 75120838497, prev: 68873940449, level: 1, sub: true },
  { label: "بهای تمام‌شده کالای فروش‌رفته", cur: -62869800492, prev: -57235510940, level: 0, neg: true },
  { label: "سود ناخالص", cur: 12251038005, prev: 11638429509, level: 1, sub: true },
  { label: "هزینه حقوق و دستمزد", cur: -4336878624, prev: -3497451648, level: 0, neg: true },
  { label: "هزینه اداری و عمومی", cur: -370684465, prev: -273818578, level: 0, neg: true },
  { label: "هزینه تولید و عملیاتی", cur: -1934407781, prev: -2161523369, level: 0, neg: true },
  { label: "سود عملیاتی", cur: 5609067135, prev: 5705635914, level: 1, sub: true },
  { label: "سایر درآمدها و هزینه‌ها", cur: -1671414, prev: -2925486, level: 0 },
  { label: "سود قبل از مالیات", cur: 5607395721, prev: 5702710427, level: 1, sub: true },
  { label: "مالیات بر درآمد (۲۵٪)", cur: -1401848930, prev: -1425677607, level: 0, neg: true },
  { label: "سود خالص", cur: 4205546791, prev: 4277032820, level: 2, total: true },
];

const bsCurrentAssets: Array<[string, number]> = [
  ["موجودی نقد و بانک", 5902569534],
  ["موجودی کالا", 12682885926],
];
const bsNonCurrentAssets: Array<[string, number]> = [
  ["دارایی ثابت (خالص)", 21140134368],
  ["دارایی نامشهود و سایر", 9045000],
];
const bsCurrentLiabilities: Array<[string, number]> = [
  ["حساب‌های پرداختنی", 9915768094],
  ["مالیات و بیمه پرداختنی", 842704701],
  ["پیش‌دریافت‌ها", 15004202350],
  ["جاری شرکا و سایر", 3239783360],
];
const bsNonCurrentLiabilities: Array<[string, number]> = [

];

const bsTotalAssets = [...bsCurrentAssets, ...bsNonCurrentAssets].reduce((s, [, v]) => s + v, 0);
const bsTotalLiabilities = [...bsCurrentLiabilities, ...bsNonCurrentLiabilities].reduce((s, [, v]) => s + v, 0);
const bsCapital = 0;
const bsNetProfit = 4205546791;
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
  { label: "جریان نقد عملیاتی", value: -3985808500, parts: [["سود دوره", 5607395721], ["تغییر موجودی کالا", -12682885926], ["تغییر دریافتنی‌ها", 2986791645], ["تغییر پرداختنی‌ها", 3337615920]] as Array<[string, number]> },
  { label: "جریان نقد سرمایه‌گذاری", value: -7933701236, parts: [["خرید دارایی ثابت", -7933701236]] as Array<[string, number]> },
  { label: "جریان نقد تأمین مالی", value: 13062612680, parts: [["تغییر تسهیلات و سرمایه", 13062612680]] as Array<[string, number]> },
];

export const payrollRows = [
  { name: "فروردین ۱۴۰۴", role: "حقوق و دستمزد", base: 241601271, ben: 62300000, ins: 69575172, tax: 2549429 },
  { name: "اردیبهشت ۱۴۰۴", role: "حقوق و دستمزد", base: 241601271, ben: 62300000, ins: 69575172, tax: 2549429 },
  { name: "خرداد ۱۴۰۴", role: "حقوق و دستمزد", base: 241601271, ben: 62300000, ins: 69575172, tax: 2549429 },
  { name: "تیر ۱۴۰۴", role: "حقوق و دستمزد", base: 234009818, ben: 59200000, ins: 67116138, tax: 2903131 },
  { name: "مرداد ۱۴۰۴", role: "حقوق و دستمزد", base: 234009818, ben: 59200000, ins: 67116138, tax: 3201924 },
  { name: "شهریور ۱۴۰۴", role: "حقوق و دستمزد", base: 245241096, ben: 62097455, ins: 70412332, tax: 3016756 },
  { name: "مهر ۱۴۰۴", role: "حقوق و دستمزد", base: 233558616, ben: 59003989, ins: 66929234, tax: 2595003 },
  { name: "آبان ۱۴۰۴", role: "حقوق و دستمزد", base: 222885648, ben: 55903989, ins: 63761451, tax: 2595003 },
  { name: "آذر ۱۴۰۴", role: "حقوق و دستمزد", base: 223440048, ben: 56100000, ins: 63888963, tax: 2595004 },
  { name: "دی ۱۴۰۴", role: "حقوق و دستمزد", base: 234390216, ben: 59200000, ins: 67120502, tax: 2595004 },
  { name: "بهمن ۱۴۰۴", role: "حقوق و دستمزد", base: 234476205, ben: 59114011, ins: 67140279, tax: 2595004 },
  { name: "اسفند ۱۴۰۴", role: "حقوق و دستمزد", base: 226660332, ben: 59116877, ins: 65356137, tax: 2595004 },
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
export const employerInsurance = 807566692;
export const vatPayable = 749365295;
export const incomeTax = 1401848930;

export const taxObligations = [
  { label: "مالیات بر ارزش افزوده", amount: vatPayable, due: "۱۴۰۵/۰۹/۱۵", status: "پرداخت‌نشده", tone: "warn" },
  { label: "بیمه تأمین اجتماعی", amount: 85366360, due: "۱۴۰۵/۰۹/۱۵", status: "پرداخت‌نشده", tone: "warn" },
  { label: "مالیات حقوق و دستمزد", amount: 7973046, due: "۱۴۰۵/۰۹/۱۵", status: "پرداخت‌نشده", tone: "warn" },
  { label: "مالیات بر درآمد (علی‌الحساب)", amount: incomeTax, due: "۱۴۰۵/۱۰/۳۰", status: "زمان‌بندی‌شده", tone: "muted" },
  { label: "عوارض و مالیات مشاغل", amount: 64_000_000, due: "۱۴۰۵/۰۸/۲۰", status: "پرداخت‌شده", tone: "success" },
];

export const payrollTrend = [
  { label: "فروردین", values: [0.30, 0.07] },
  { label: "اردیبهشت", values: [0.30, 0.07] },
  { label: "خرداد", values: [0.30, 0.07] },
  { label: "تیر", values: [0.29, 0.07] },
  { label: "مرداد", values: [0.29, 0.07] },
  { label: "شهریور", values: [0.31, 0.07] },
  { label: "مهر", values: [0.29, 0.07] },
  { label: "آبان", values: [0.28, 0.06] },
  { label: "آذر", values: [0.28, 0.06] },
  { label: "دی", values: [0.29, 0.07] },
  { label: "بهمن", values: [0.29, 0.07] },
  { label: "اسفند", values: [0.29, 0.07] },
];

export const mgAlerts = [
  { tone: "warn", title: "5 قلم کالا زیر حد سفارش", body: "بر اساس حد سفارش تعریف‌شده در سپیدار.", href: "/inventory" },
  { tone: "warn", title: "مالیات ارزش افزوده پرداختنی", body: "749,365,295 تومان بدهی ارزش افزوده در پایان ۱۴۰۴.", href: "/payroll" },
  { tone: "muted", title: "سود دوره ۱۴۰۴", body: "سود خالص دوره 4,205,546,791 تومان است.", href: "/statements" },
  { tone: "indigo", title: "پیش‌دریافت‌های مشتریان", body: "15,004,202,350 تومان پیش‌دریافت ثبت‌شده در دفاتر.", href: "/statements" },
];

export const cashComposition = [
  { label: "صادرات  0111599176008", value: 5600915833, color: "#2FE0BE" },
  { label: "سپه تهران 3101071480205", value: 224631968, color: "#7C8CFF" },
  { label: "بانك ايران زمين - 12201110287811", value: 76517244, color: "#F7B955" },
  { label: "اقتصاد نوين  160285056243611", value: 436472, color: "#7BE495" },
  { label: "بانك ايران زمين شعبه  گلشهر 122084001028781001", value: 10123, color: "#FF6B81" },
  { label: "اقتصاد نوين 1602256243610", value: 57893, color: "#8A9BB4" },
  { label: "سایر حساب‌های نقدی", value: 0, color: "#8A9BB4" },
];
