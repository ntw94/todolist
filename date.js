//date.js

/**
 * Date()
 * 날짜를 가져올 수 있는 내장객체
 */

let today = new Date();
console.log(today);

let date2 = new Date("2025-02-16");

let todayDay = new Date();
todayDay.setFullYear(2025);
todayDay.setMonth(5);
todayDay.setDate(16);

let diff = todayDay - date2;
console.log();

let remainDays = Math.ceil(diff /(1000 * 60 * 60 * 24));
console.log(remainDays);
