const DAYMS = 24 * 3600 * 1000
const DEFAULT_DATE = new Date(0)
const DEFAULT_DATE_JSON = dateToJson(DEFAULT_DATE)

function isBst(year) {
  return new Date(year, 1, 30).getMonth() === 1
}

function isBst2(year) {
  return year % 100 === 0 ? year % 400 : year % 4
}

/* const a = new Date(2025, 0, 30)
const b = new Date(2024, 8, 21)
console.log(daysBetweenDates(b, a)) */
function daysBetweenDates(origin, final) {
  return Math.floor((final.getTime() - origin.getTime()) / DAYMS)
}

function dateToJson(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  }
}

function jsonToDate(json) {
  for (let key in json) {
    if (json[key] === undefined || typeof json[key] !== 'number') {
      json[key] = DEFAULT_DATE_JSON[key]
    }
  }
  const { year, month, day, hour, minute, second } = json

  return new Date(year, month, day, hour, minute, second)
}

function addMonth(date, n) {
  const json = dateToJson(date)
  json['month'] += n
  return jsonToDate(json)
}

function addYear(date, n) {
  const json = dateToJson(date)
  json['year'] += n
  return jsonToDate(json)
}

/*
const a = new Date(2025, 0, 30)
const b = new Date(2024, 8, 21)
console.log(monthsBetweenDates(b, a))
*/
function monthsBetweenDates(origin, final) {
  const { year: oYear, month: oMonth, day: oDay } = dateToJson(origin)
  const { year: fYear, month: fMonth, day: fDay } = dateToJson(final)

  return 12 * (fYear - oYear) + (fMonth - oMonth) + (fDay < oDay ? -1 : 0)
}

/* const a = new Date(2025, 8, 21)
const b = new Date(2024, 8, 21)
console.log(yearsBetweenDates(b, a)) // 1 */
function yearsBetweenDates(origin, final) {
  const { year: oYear, month: oMonth, day: oDay } = dateToJson(origin)
  const { year: fYear, month: fMonth, day: fDay } = dateToJson(final)

  return fYear - oYear - (fMonth >= oMonth && fDay >= oDay ? 0 : 1)
}

/* 
const a = new Date()
const b = new Date(1998, 8, 25)
const output = diff(b, a)
console.log(JSON.stringify(output))
*/
function diff(origin, final) {
  let y = yearsBetweenDates(origin, final)
  origin = addYear(origin, y)
  let m = monthsBetweenDates(origin, final)
  origin = addMonth(origin, m)
  let d = daysBetweenDates(origin, final)
  return { years: y, months: m, days: d }
}

export default diff
export { jsonToDate }
